import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Rocket,
  Target,
  BookOpen,
  Code,
  TrendingUp,
  Calendar,
  Trophy,
  Zap,
  CheckCircle2,
  Plus,
  ArrowRight,
  Lightbulb,
  Users,
  Star,
  Brain,
  Activity,
  Timer,
  FileText,
  Play
} from "lucide-react";

interface WelcomeDashboardProps {
  userName: string;
  userPreferences: any;
  onStartAction: (action: string) => void;
  onAddProblem: () => void;
  stats: {
    totalProblems: number;
    solvedProblems: number;
    currentStreak: number;
    notesCount: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  action: string;
  estimatedTime: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'add-problem',
    title: 'Add Your First Problem',
    description: 'Start tracking problems from your favorite platforms',
    icon: <Plus className="h-5 w-5" />,
    color: 'bg-catppuccin-green',
    action: 'add-problem',
    estimatedTime: '2 min'
  },
  {
    id: 'create-note',
    title: 'Create a Note',
    description: 'Document insights, templates, or learning materials',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-catppuccin-blue',
    action: 'create-note',
    estimatedTime: '5 min'
  },
  {
    id: 'explore-patterns',
    title: 'Explore Patterns',
    description: 'Learn about algorithmic patterns and track your mastery',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-catppuccin-purple',
    action: 'explore-patterns',
    estimatedTime: '10 min'
  },
  {
    id: 'browse-learning',
    title: 'Browse Learning Paths',
    description: 'Discover structured courses and tutorials',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-catppuccin-yellow',
    action: 'browse-learning',
    estimatedTime: '15 min'
  }
];

const DAILY_GOALS = [
  { id: 'solve-problem', title: 'Solve 1 Problem', completed: false, points: 10 },
  { id: 'review-notes', title: 'Review Notes', completed: false, points: 5 },
  { id: 'learn-pattern', title: 'Learn New Pattern', completed: false, points: 15 },
  { id: 'practice-weak', title: 'Practice Weak Area', completed: false, points: 20 }
];

const GETTING_STARTED_TIPS = [
  {
    icon: <Target className="h-4 w-4" />,
    title: "Set Your Goals",
    description: "Define what you want to achieve - rating improvement, interview prep, or daily practice habits"
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    title: "Build a Routine",
    description: "Consistency is key. Even 30 minutes daily can lead to significant improvement over time"
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "Track Everything",
    description: "Log problems, insights, and mistakes. This data becomes invaluable for identifying patterns"
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Review Regularly",
    description: "Use spaced repetition to revisit solved problems and reinforce learning"
  }
];

export function WelcomeDashboard({ userName, userPreferences, onStartAction, onAddProblem, stats }: WelcomeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyGoals, setDailyGoals] = useState(DAILY_GOALS);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "The expert in anything was once a beginner.",
      "Progress, not perfection, is the goal.",
      "Every problem you solve makes you stronger.",
      "Consistency beats intensity every time.",
      "Your only competition is who you were yesterday."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const totalPoints = dailyGoals.filter(goal => goal.completed).reduce((sum, goal) => sum + goal.points, 0);
  const progressPercentage = (completedGoals / dailyGoals.length) * 100;

  const toggleGoal = (goalId: string) => {
    setDailyGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const isNewUser = stats.totalProblems === 0 && stats.notesCount === 0;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-catppuccin-blue/20 via-catppuccin-purple/20 to-catppuccin-pink/20 border border-catppuccin-surface1">
        <div className="absolute inset-0 bg-catppuccin-surface0/50" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-catppuccin-blue">
                  {getGreeting()}, {userName}! 👋
                </h1>
                <p className="text-lg text-catppuccin-overlay1 max-w-2xl">
                  {isNewUser 
                    ? "Welcome to CodeTrac! Let's start building your competitive programming journey."
                    : "Ready to continue your competitive programming journey?"
                  }
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {getMotivationalQuote()}
                </Badge>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="text-right space-y-2">
                <div className="text-sm text-catppuccin-overlay1">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-2xl font-mono text-catppuccin-foreground">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardContent className="p-4 text-center">
                <Code className="h-6 w-6 text-catppuccin-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-catppuccin-blue">{stats.totalProblems}</div>
                <div className="text-xs text-catppuccin-overlay1">Total Problems</div>
              </CardContent>
            </Card>
            
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-catppuccin-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-catppuccin-green">{stats.solvedProblems}</div>
                <div className="text-xs text-catppuccin-overlay1">Solved</div>
              </CardContent>
            </Card>
            
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 text-catppuccin-yellow mx-auto mb-2" />
                <div className="text-2xl font-bold text-catppuccin-yellow">{stats.currentStreak}</div>
                <div className="text-xs text-catppuccin-overlay1">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-catppuccin-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-catppuccin-purple">{stats.notesCount}</div>
                <div className="text-xs text-catppuccin-overlay1">Notes</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="text-catppuccin-blue font-mono flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <Card 
                    key={action.id}
                    className="cursor-pointer transition-all hover:scale-105 border-catppuccin-surface2 hover:border-catppuccin-blue/50"
                    onClick={() => action.action === 'add-problem' ? onAddProblem() : onStartAction(action.action)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded ${action.color} text-catppuccin-surface0`}>
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-catppuccin-foreground">{action.title}</h3>
                          <p className="text-sm text-catppuccin-overlay1 mt-1">{action.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs border-catppuccin-surface2">
                              <Timer className="h-3 w-3 mr-1" />
                              {action.estimatedTime}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-catppuccin-overlay1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Tips (for new users) */}
          {isNewUser && (
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="text-catppuccin-green font-mono flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Getting Started Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {GETTING_STARTED_TIPS.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded border border-catppuccin-surface2">
                      <div className="text-catppuccin-green mt-0.5">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-catppuccin-foreground">{tip.title}</h4>
                        <p className="text-sm text-catppuccin-overlay1 mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Goals */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="text-catppuccin-yellow font-mono flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Daily Goals</span>
                </div>
                <Badge variant="outline" className="text-catppuccin-yellow border-catppuccin-yellow">
                  {totalPoints} pts
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-catppuccin-overlay1">Progress</span>
                  <span className="text-catppuccin-foreground">{completedGoals}/{dailyGoals.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                {dailyGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
                      goal.completed ? 'bg-catppuccin-green/10 border border-catppuccin-green/30' : 'border border-catppuccin-surface2 hover:border-catppuccin-blue/50'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      goal.completed ? 'bg-catppuccin-green border-catppuccin-green' : 'border-catppuccin-surface2'
                    }`}>
                      {goal.completed && <CheckCircle2 className="h-3 w-3 text-catppuccin-surface0" />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${goal.completed ? 'text-catppuccin-green line-through' : 'text-catppuccin-foreground'}`}>
                        {goal.title}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{goal.points}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {progressPercentage === 100 && (
                <div className="text-center p-3 bg-catppuccin-green/10 rounded border border-catppuccin-green/30">
                  <Trophy className="h-6 w-6 text-catppuccin-yellow mx-auto mb-1" />
                  <p className="text-sm font-semibold text-catppuccin-green">Daily goals completed! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Preview */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="text-catppuccin-purple font-mono flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalProblems === 0 ? (
                <div className="text-center py-6 text-catppuccin-overlay1">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs mt-1">Start by adding your first problem!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-catppuccin-green rounded-full" />
                    <span className="text-catppuccin-overlay1">Problem solved</span>
                    <span className="text-catppuccin-overlay2 text-xs">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-catppuccin-blue rounded-full" />
                    <span className="text-catppuccin-overlay1">Note created</span>
                    <span className="text-catppuccin-overlay2 text-xs">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-catppuccin-yellow rounded-full" />
                    <span className="text-catppuccin-overlay1">Pattern learned</span>
                    <span className="text-catppuccin-overlay2 text-xs">2d ago</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Spotlight */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="text-catppuccin-teal font-mono flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-catppuccin-teal">1,247</div>
                <div className="text-xs text-catppuccin-overlay1">Active Users</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-catppuccin-overlay1">Problems solved today</span>
                  <span className="text-catppuccin-foreground font-mono">892</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-catppuccin-overlay1">Notes shared</span>
                  <span className="text-catppuccin-foreground font-mono">156</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-catppuccin-overlay1">Learning paths</span>
                  <span className="text-catppuccin-foreground font-mono">23</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}