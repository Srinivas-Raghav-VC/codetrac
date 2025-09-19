import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify user authentication
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ success: false, error: 'No access token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.error('Authentication error:', error);
    return c.json({ success: false, error: 'Invalid or expired token' }, 401);
  }

  c.set('user', user);
  await next();
};

// Helper functions
const getUserKey = (userId: string, key: string) => `user:${userId}:${key}`;

const generateHeatmapData = (problems: any[]) => {
  const heatmapData = [];
  const today = new Date();
  
  // Create a map of dates to problem counts
  const dateCountMap = new Map();
  
  problems.forEach(problem => {
    if (problem.solvedAt) {
      const date = new Date(problem.solvedAt).toISOString().split('T')[0];
      dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
    }
  });
  
  // Generate data for the past 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = dateCountMap.get(dateStr) || 0;
    let level = 0;
    if (count >= 4) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;
    
    heatmapData.push({
      date: dateStr,
      count,
      level
    });
  }
  
  return heatmapData;
};

const calculateStreak = (heatmapData: any[]) => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Calculate current streak (from today backwards)
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  for (const day of heatmapData) {
    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return { currentStreak, longestStreak };
};

// Problem fetching utilities
const fetchCodeforcesProblems = async (url: string) => {
  try {
    // Extract contest and problem ID from URL
    const match = url.match(/codeforces\.com\/(?:contest|problemset\/problem)\/(\d+)\/([A-Z]\d*)/);
    if (!match) throw new Error('Invalid Codeforces URL format');
    
    const [, contestId, problemIndex] = match;
    
    // Fetch problem details from Codeforces API
    const response = await fetch(`https://codeforces.com/api/problemset.problems`);
    const data = await response.json();
    
    if (data.status !== 'OK') throw new Error('Failed to fetch from Codeforces API');
    
    const problem = data.result.problems.find((p: any) => 
      p.contestId.toString() === contestId && p.index === problemIndex
    );
    
    if (!problem) throw new Error('Problem not found');
    
    const difficulty = problem.rating 
      ? problem.rating <= 1200 ? 'Easy' 
        : problem.rating <= 1600 ? 'Medium' 
        : 'Hard'
      : 'Medium';
    
    return {
      title: problem.name,
      difficulty,
      rating: problem.rating,
      tags: problem.tags || [],
      platform: 'Codeforces',
      statement: undefined // Would need to scrape for full statement
    };
  } catch (error) {
    console.error('Error fetching Codeforces problem:', error);
    throw error;
  }
};

const fetchLeetCodeProblem = async (url: string) => {
  try {
    // Extract problem slug from URL
    const match = url.match(/leetcode\.com\/problems\/([^\/]+)/);
    if (!match) throw new Error('Invalid LeetCode URL format');
    
    const slug = match[1];
    
    // Mock LeetCode data (real implementation would use GraphQL API)
    const mockProblems: any = {
      'two-sum': {
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: ['array', 'hash-table'],
        platform: 'LeetCode'
      },
      'add-two-numbers': {
        title: 'Add Two Numbers',
        difficulty: 'Medium', 
        tags: ['linked-list', 'math', 'recursion'],
        platform: 'LeetCode'
      },
      'longest-substring-without-repeating-characters': {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        tags: ['hash-table', 'string', 'sliding-window'],
        platform: 'LeetCode'
      },
      'median-of-two-sorted-arrays': {
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        tags: ['array', 'binary-search', 'divide-and-conquer'],
        platform: 'LeetCode'
      },
      'reverse-integer': {
        title: 'Reverse Integer',
        difficulty: 'Medium',
        tags: ['math'],
        platform: 'LeetCode'
      }
    };
    
    const problem = mockProblems[slug];
    if (!problem) {
      // Fallback to generic problem data
      return {
        title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        difficulty: 'Medium',
        tags: ['algorithm'],
        platform: 'LeetCode'
      };
    }
    
    return problem;
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error);
    throw error;
  }
};

// Authentication endpoints
app.post("/make-server-7ec58213/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      data: { 
        user: data.user,
        message: 'User created successfully'
      }
    });
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-7ec58213/health", (c) => {
  return c.json({ 
    success: true, 
    data: { 
      status: "ok", 
      timestamp: new Date().toISOString() 
    } 
  });
});

// Problem management endpoints
app.get("/make-server-7ec58213/problems", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    
    return c.json({ 
      success: true, 
      data: problems.sort((a: any, b: any) => 
        new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.error('Get problems error:', error);
    return c.json({ success: false, error: 'Failed to fetch problems' }, 500);
  }
});

app.post("/make-server-7ec58213/problems", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problemData = await c.req.json();
    
    // Validate required fields
    if (!problemData.title || !problemData.platform || !problemData.url) {
      return c.json({ 
        success: false, 
        error: 'Title, platform, and URL are required' 
      }, 400);
    }
    
    const newProblem = {
      ...problemData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    problems.push(newProblem);
    
    await kv.set(getUserKey(user.id, 'problems'), problems);
    
    return c.json({ success: true, data: newProblem });
  } catch (error) {
    console.error('Create problem error:', error);
    return c.json({ success: false, error: 'Failed to create problem' }, 500);
  }
});

app.put("/make-server-7ec58213/problems/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problemId = c.req.param('id');
    const updates = await c.req.json();
    
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    const problemIndex = problems.findIndex((p: any) => p.id === problemId);
    
    if (problemIndex === -1) {
      return c.json({ success: false, error: 'Problem not found' }, 404);
    }
    
    problems[problemIndex] = {
      ...problems[problemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(getUserKey(user.id, 'problems'), problems);
    
    return c.json({ success: true, data: problems[problemIndex] });
  } catch (error) {
    console.error('Update problem error:', error);
    return c.json({ success: false, error: 'Failed to update problem' }, 500);
  }
});

app.delete("/make-server-7ec58213/problems/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problemId = c.req.param('id');
    
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    const filteredProblems = problems.filter((p: any) => p.id !== problemId);
    
    if (problems.length === filteredProblems.length) {
      return c.json({ success: false, error: 'Problem not found' }, 404);
    }
    
    await kv.set(getUserKey(user.id, 'problems'), filteredProblems);
    
    return c.json({ success: true, data: { message: 'Problem deleted successfully' } });
  } catch (error) {
    console.error('Delete problem error:', error);
    return c.json({ success: false, error: 'Failed to delete problem' }, 500);
  }
});

// Problem fetching endpoint
app.post("/make-server-7ec58213/fetch-problem", requireAuth, async (c) => {
  try {
    const { url } = await c.req.json();
    
    if (!url) {
      return c.json({ success: false, error: 'URL is required' }, 400);
    }
    
    let problemDetails;
    
    if (url.includes('codeforces.com')) {
      problemDetails = await fetchCodeforcesProblems(url);
    } else if (url.includes('leetcode.com')) {
      problemDetails = await fetchLeetCodeProblem(url);
    } else {
      return c.json({ 
        success: false, 
        error: 'Unsupported platform. Only Codeforces and LeetCode are supported.' 
      }, 400);
    }
    
    return c.json({ success: true, data: problemDetails });
  } catch (error) {
    console.error('Fetch problem error:', error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch problem details: ${error.message}` 
    }, 500);
  }
});

// Dashboard stats endpoint
app.get("/make-server-7ec58213/stats", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    
    const solvedProblems = problems.filter((p: any) => p.status === 'Solved');
    const attemptedProblems = problems.filter((p: any) => p.status === 'Attempted');
    const reviewProblems = problems.filter((p: any) => p.status === 'To Review');
    
    const difficultyStats = problems.reduce((acc: any, problem: any) => {
      if (problem.status === 'Solved') {
        acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
      }
      return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 });
    
    const platformStats = problems.reduce((acc: any, problem: any) => {
      if (problem.status === 'Solved') {
        acc[problem.platform] = (acc[problem.platform] || 0) + 1;
      }
      return acc;
    }, {});
    
    const tagStats = problems
      .filter((p: any) => p.status === 'Solved')
      .flatMap((p: any) => p.tags || [])
      .reduce((acc: any, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
    
    const heatmapData = generateHeatmapData(problems);
    const { currentStreak, longestStreak } = calculateStreak(heatmapData);
    
    return c.json({
      success: true,
      data: {
        totalProblems: problems.length,
        solvedProblems: solvedProblems.length,
        attemptedProblems: attemptedProblems.length,
        reviewProblems: reviewProblems.length,
        difficultyStats,
        platformStats,
        tagStats,
        currentStreak,
        longestStreak
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// Heatmap data endpoint
app.get("/make-server-7ec58213/heatmap", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const problems = await kv.get(getUserKey(user.id, 'problems')) || [];
    const heatmapData = generateHeatmapData(problems);
    
    return c.json({ success: true, data: heatmapData });
  } catch (error) {
    console.error('Get heatmap error:', error);
    return c.json({ success: false, error: 'Failed to fetch heatmap data' }, 500);
  }
});

Deno.serve(app.fetch);