import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Filter, 
  Search, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lightbulb,
  Code,
  GitBranch
} from "lucide-react";
import { Problem as ApiProblem } from "../utils/api";

interface PatternTrackerProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
}

interface PatternData {
  id: string;
  name: string;
  concept: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problems: ApiProblem[];
  totalProblems: number;
  solvedProblems: number;
  masteryLevel: number; // 0-100
  recentActivity: string;
  keyInsights: string[];
  commonMistakes: string[];
  nextSteps: string[];
}

// Comprehensive pattern definitions organized by concept
const PATTERN_DEFINITIONS: Omit<PatternData, 'problems' | 'totalProblems' | 'solvedProblems' | 'masteryLevel' | 'recentActivity' | 'keyInsights' | 'commonMistakes' | 'nextSteps'>[] = [
  // Binary Search Patterns
  {
    id: 'basic-binary-search',
    name: 'Basic Binary Search',
    concept: 'Binary Search',
    description: 'Finding exact elements in sorted arrays',
    difficulty: 'Easy'
  },
  {
    id: 'binary-search-bounds',
    name: 'Lower/Upper Bounds',
    concept: 'Binary Search',
    description: 'Finding first/last occurrence of elements',
    difficulty: 'Easy'
  },
  {
    id: 'binary-search-on-answer',
    name: 'Binary Search on Answer',
    concept: 'Binary Search',
    description: 'Binary search to find optimal solutions',
    difficulty: 'Medium'
  },
  {
    id: 'predicate-binary-search',
    name: 'Predicate Functions',
    concept: 'Binary Search',
    description: 'Using boolean predicates for complex searches',
    difficulty: 'Medium'
  },
  {
    id: 'floating-point-bs',
    name: 'Floating Point BS',
    concept: 'Binary Search',
    description: 'Binary search with real number precision',
    difficulty: 'Hard'
  },

  // Graph Patterns
  {
    id: 'dfs-basic',
    name: 'Basic DFS',
    concept: 'Graphs',
    description: 'Depth-first traversal and connectivity',
    difficulty: 'Easy'
  },
  {
    id: 'bfs-basic',
    name: 'Basic BFS',
    concept: 'Graphs',
    description: 'Breadth-first traversal and shortest paths',
    difficulty: 'Easy'
  },
  {
    id: 'cycle-detection',
    name: 'Cycle Detection',
    concept: 'Graphs',
    description: 'Finding cycles in directed/undirected graphs',
    difficulty: 'Medium'
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    concept: 'Graphs',
    description: 'Ordering vertices in DAGs',
    difficulty: 'Medium'
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    concept: 'Graphs',
    description: 'Single-source shortest paths',
    difficulty: 'Medium'
  },
  {
    id: 'union-find',
    name: 'Union-Find/DSU',
    concept: 'Graphs',
    description: 'Disjoint set operations',
    difficulty: 'Medium'
  },

  // Dynamic Programming Patterns
  {
    id: 'dp-1d',
    name: '1D Dynamic Programming',
    concept: 'Dynamic Programming',
    description: 'Linear DP problems (Fibonacci, climbing stairs)',
    difficulty: 'Easy'
  },
  {
    id: 'dp-2d',
    name: '2D Dynamic Programming',
    concept: 'Dynamic Programming',
    description: 'Grid DP, longest common subsequence',
    difficulty: 'Medium'
  },
  {
    id: 'knapsack',
    name: 'Knapsack Problems',
    concept: 'Dynamic Programming',
    description: '0/1 knapsack and variations',
    difficulty: 'Medium'
  },
  {
    id: 'dp-on-trees',
    name: 'DP on Trees',
    concept: 'Dynamic Programming',
    description: 'Tree DP, rerooting technique',
    difficulty: 'Hard'
  },
  {
    id: 'digit-dp',
    name: 'Digit DP',
    concept: 'Dynamic Programming',
    description: 'Counting numbers with digit constraints',
    difficulty: 'Hard'
  },

  // Greedy Patterns
  {
    id: 'interval-scheduling',
    name: 'Interval Scheduling',
    concept: 'Greedy',
    description: 'Activity selection, meeting rooms',
    difficulty: 'Medium'
  },
  {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    concept: 'Greedy',
    description: 'Optimal prefix codes',
    difficulty: 'Medium'
  },
  {
    id: 'minimum-spanning-tree',
    name: 'Minimum Spanning Tree',
    concept: 'Greedy',
    description: 'Kruskal\'s and Prim\'s algorithms',
    difficulty: 'Hard'
  },

  // Number Theory Patterns
  {
    id: 'gcd-lcm',
    name: 'GCD & LCM',
    concept: 'Number Theory',
    description: 'Euclidean algorithm and applications',
    difficulty: 'Easy'
  },
  {
    id: 'prime-sieve',
    name: 'Sieve of Eratosthenes',
    concept: 'Number Theory',
    description: 'Finding all primes up to N',
    difficulty: 'Medium'
  },
  {
    id: 'modular-arithmetic',
    name: 'Modular Arithmetic',
    concept: 'Number Theory',
    description: 'Modular operations and properties',
    difficulty: 'Medium'
  },
  {
    id: 'chinese-remainder',
    name: 'Chinese Remainder Theorem',
    concept: 'Number Theory',
    description: 'Solving system of congruences',
    difficulty: 'Hard'
  },

  // Segment Tree Patterns
  {
    id: 'basic-segment-tree',
    name: 'Basic Segment Tree',
    concept: 'Segment Trees',
    description: 'Range sum/min/max queries',
    difficulty: 'Medium'
  },
  {
    id: 'lazy-propagation',
    name: 'Lazy Propagation',
    concept: 'Segment Trees',
    description: 'Range updates with lazy propagation',
    difficulty: 'Hard'
  },
  {
    id: 'persistent-segment-tree',
    name: 'Persistent Segment Tree',
    concept: 'Segment Trees',
    description: 'Version control for data structures',
    difficulty: 'Hard'
  }
];

export function PatternTracker({ problems, onAddProblem }: PatternTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterConcept, setFilterConcept] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterMastery, setFilterMastery] = useState<string>("all");
  const [activeView, setActiveView] = useState<"overview" | "detailed">("overview");

  // Calculate pattern data based on problems
  const patternData: PatternData[] = useMemo(() => {
    return PATTERN_DEFINITIONS.map(pattern => {
      // Find problems that match this pattern based on tags
      const relatedProblems = problems.filter(problem =>
        problem.tags.some(tag =>
          tag.toLowerCase().includes(pattern.name.toLowerCase()) ||
          pattern.name.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(pattern.id.replace('-', ' ')) ||
          // Also check for concept matches
          tag.toLowerCase().includes(pattern.concept.toLowerCase())
        )
      );

      const solvedProblems = relatedProblems.filter(p => p.status === 'Solved');
      const totalProblems = relatedProblems.length;
      const solvedCount = solvedProblems.length;

      // Calculate mastery level (0-100)
      let masteryLevel = 0;
      if (totalProblems > 0) {
        const solveRate = solvedCount / totalProblems;
        const difficultyBonus = solvedProblems.reduce((acc, p) => {
          switch (p.difficulty) {
            case 'Easy': return acc + 1;
            case 'Medium': return acc + 2;
            case 'Hard': return acc + 3;
            default: return acc;
          }
        }, 0);
        
        masteryLevel = Math.min(100, (solveRate * 60) + (difficultyBonus * 5));
      }

      // Mock insights and mistakes based on pattern difficulty
      const keyInsights = masteryLevel > 50 ? [
        `Understanding the core ${pattern.name} technique`,
        `Recognizing when to apply this pattern`,
        `Common optimizations and edge cases`
      ] : [
        `Still learning the fundamentals of ${pattern.name}`,
        `Need more practice with basic applications`
      ];

      const commonMistakes = masteryLevel > 30 ? [
        'Off-by-one errors in implementation',
        'Missing edge cases',
        'Incorrect complexity analysis'
      ] : [
        'Misunderstanding the pattern concept',
        'Incorrect problem identification'
      ];

      const nextSteps = masteryLevel < 70 ? [
        `Practice more ${pattern.difficulty} problems`,
        `Study optimal implementations`,
        `Focus on pattern recognition`
      ] : [
        'Move to advanced variations',
        'Teach others this pattern',
        'Optimize implementation speed'
      ];

      return {
        ...pattern,
        problems: relatedProblems,
        totalProblems,
        solvedProblems: solvedCount,
        masteryLevel: Math.round(masteryLevel),
        recentActivity: solvedProblems.length > 0 ? 
          new Date(solvedProblems[solvedProblems.length - 1].solvedAt || Date.now()).toLocaleDateString() : 
          'No activity',
        keyInsights,
        commonMistakes,
        nextSteps
      };
    });
  }, [problems]);

  // Filter patterns
  const filteredPatterns = patternData.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesConcept = filterConcept === "all" || pattern.concept === filterConcept;
    const matchesDifficulty = filterDifficulty === "all" || pattern.difficulty === filterDifficulty;
    
    let matchesMastery = true;
    if (filterMastery === "mastered") matchesMastery = pattern.masteryLevel >= 80;
    else if (filterMastery === "learning") matchesMastery = pattern.masteryLevel >= 30 && pattern.masteryLevel < 80;
    else if (filterMastery === "beginner") matchesMastery = pattern.masteryLevel < 30;
    
    return matchesSearch && matchesConcept && matchesDifficulty && matchesMastery;
  });

  // Get unique concepts for filter
  const concepts = [...new Set(PATTERN_DEFINITIONS.map(p => p.concept))];

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10";
    if (level >= 60) return "text-catppuccin-blue border-catppuccin-blue bg-catppuccin-blue/10";
    if (level >= 30) return "text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10";
    return "text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10";
  };

  const getMasteryText = (level: number) => {
    if (level >= 80) return "Mastered";
    if (level >= 60) return "Proficient";
    if (level >= 30) return "Learning";
    return "Beginner";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'Medium': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'Hard': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const overallStats = useMemo(() => {
    const totalPatterns = patternData.length;
    const masteredPatterns = patternData.filter(p => p.masteryLevel >= 80).length;
    const inProgressPatterns = patternData.filter(p => p.masteryLevel >= 30 && p.masteryLevel < 80).length;
    const avgMastery = patternData.reduce((sum, p) => sum + p.masteryLevel, 0) / totalPatterns;
    
    return {
      totalPatterns,
      masteredPatterns,
      inProgressPatterns,
      avgMastery: Math.round(avgMastery)
    };
  }, [patternData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-catppuccin-blue font-mono">
            <Target className="h-6 w-6 inline mr-2" />
            Pattern Mastery Tracker
          </h1>
          <p className="text-catppuccin-overlay1">
            Track your mastery of algorithmic patterns and problem-solving techniques
          </p>
        </div>
        <Button 
          onClick={onAddProblem}
          className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Add Problem
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-catppuccin-blue" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Total Patterns</p>
                <p className="font-bold text-catppuccin-blue">{overallStats.totalPatterns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-catppuccin-green" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Mastered</p>
                <p className="font-bold text-catppuccin-green">{overallStats.masteredPatterns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-catppuccin-yellow" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">In Progress</p>
                <p className="font-bold text-catppuccin-yellow">{overallStats.inProgressPatterns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-catppuccin-purple" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Avg. Mastery</p>
                <p className="font-bold text-catppuccin-purple">{overallStats.avgMastery}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
          <Input
            placeholder="Search patterns, concepts, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterConcept} onValueChange={setFilterConcept}>
            <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Concepts</SelectItem>
              {concepts.map(concept => (
                <SelectItem key={concept} value={concept}>{concept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterMastery} onValueChange={setFilterMastery}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Mastery</SelectItem>
              <SelectItem value="mastered">Mastered</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pattern Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern) => (
          <Card 
            key={pattern.id}
            className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-mono text-base">{pattern.name}</CardTitle>
                    <Badge variant="outline" className={getMasteryColor(pattern.masteryLevel)}>
                      {getMasteryText(pattern.masteryLevel)}
                    </Badge>
                  </div>
                  <p className="text-xs text-catppuccin-overlay1 font-mono">{pattern.description}</p>
                  
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2">
                      {pattern.concept}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(pattern.difficulty)}`}>
                      {pattern.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Mastery Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-catppuccin-overlay1">Mastery Level</span>
                  <span className="text-catppuccin-foreground font-mono">{pattern.masteryLevel}%</span>
                </div>
                <Progress value={pattern.masteryLevel} className="h-2" />
              </div>

              {/* Problem Stats */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-catppuccin-overlay1">Solved:</span>
                  <span className="text-catppuccin-foreground ml-2">{pattern.solvedProblems}</span>
                </div>
                <div>
                  <span className="text-catppuccin-overlay1">Total:</span>
                  <span className="text-catppuccin-foreground ml-2">{pattern.totalProblems}</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex items-center space-x-2 text-xs">
                <Clock className="h-3 w-3 text-catppuccin-overlay1" />
                <span className="text-catppuccin-overlay1">Last activity: {pattern.recentActivity}</span>
              </div>

              {/* Key Insights Preview */}
              {pattern.keyInsights.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <Lightbulb className="h-3 w-3 text-catppuccin-yellow" />
                    <span className="text-catppuccin-overlay1">Key Insight:</span>
                  </div>
                  <p className="text-xs text-catppuccin-foreground italic">
                    "{pattern.keyInsights[0]}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12 text-catppuccin-overlay1">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">No patterns found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}