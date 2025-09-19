import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy, 
  Target, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Zap,
  Award,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { Heatmap } from "./heatmap";
import { Problem } from "./problem-card";
import { EmptyState } from "./empty-state";

interface DashboardProps {
  problems: Problem[];
  heatmapData: { date: string; count: number; level: number }[];
  dashboardStats?: {
    totalProblems: number;
    solvedProblems: number;
    attemptedProblems: number;
    reviewProblems: number;
    difficultyStats: {
      Easy: number;
      Medium: number;
      Hard: number;
    };
    platformStats: Record<string, number>;
    tagStats: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
  };
  onAddProblem?: () => void;
}

export function Dashboard({ problems, heatmapData, dashboardStats, onAddProblem }: DashboardProps) {
  // Show empty state for new users
  if (problems.length === 0) {
    return <EmptyState onAddProblem={onAddProblem || (() => {})} />;
  }
  // Use provided stats or calculate from problems as fallback
  const stats = dashboardStats || {
    totalProblems: problems.length,
    solvedProblems: problems.filter(p => p.status === 'Solved').length,
    attemptedProblems: problems.filter(p => p.status === 'Attempted').length,
    reviewProblems: problems.filter(p => p.status === 'To Review').length,
    difficultyStats: {
      Easy: problems.filter(p => p.status === 'Solved' && p.difficulty === 'Easy').length,
      Medium: problems.filter(p => p.status === 'Solved' && p.difficulty === 'Medium').length,
      Hard: problems.filter(p => p.status === 'Solved' && p.difficulty === 'Hard').length,
    },
    platformStats: {},
    tagStats: {},
    currentStreak: 0,
    longestStreak: 0
  };

  const topPlatforms = Object.entries(stats.platformStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topTags = Object.entries(stats.tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const averageTime = 45; // This would be calculated from timeSpent data
  const monthlyGoal = 50;
  const monthlyProgress = stats.solvedProblems % 50; // Mock calculation

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-catppuccin-yellow" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Total Solved</p>
                <p className="text-2xl font-bold text-catppuccin-yellow">{stats.solvedProblems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-catppuccin-blue" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Current Streak</p>
                <p className="text-2xl font-bold text-catppuccin-blue">{stats.currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-catppuccin-green" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">Avg. Time</p>
                <p className="text-2xl font-bold text-catppuccin-green">{averageTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-catppuccin-purple" />
              <div>
                <p className="text-sm text-catppuccin-overlay1">To Review</p>
                <p className="text-2xl font-bold text-catppuccin-purple">{stats.reviewProblems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Goal */}
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader>
            <CardTitle className="text-catppuccin-blue flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Monthly Goal</span>
            </CardTitle>
            <CardDescription className="text-catppuccin-overlay1">
              Track your progress towards solving {monthlyGoal} problems this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-catppuccin-overlay1">Progress</span>
              <span className="text-catppuccin-blue font-semibold">
                {monthlyProgress} / {monthlyGoal}
              </span>
            </div>
            <Progress 
              value={(monthlyProgress / monthlyGoal) * 100} 
              className="h-2 bg-catppuccin-surface1"
            />
            <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
              <span>{((monthlyProgress / monthlyGoal) * 100).toFixed(1)}% complete</span>
              <span>{monthlyGoal - monthlyProgress} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader>
            <CardTitle className="text-catppuccin-blue flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-catppuccin-yellow" />
                <div>
                  <p className="text-xs text-catppuccin-overlay1">Longest Streak</p>
                  <p className="text-sm font-semibold text-catppuccin-yellow">{stats.longestStreak} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-catppuccin-purple" />
                <div>
                  <p className="text-xs text-catppuccin-overlay1">Attempted</p>
                  <p className="text-sm font-semibold text-catppuccin-purple">{stats.attemptedProblems}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-catppuccin-pink" />
                <div>
                  <p className="text-xs text-catppuccin-overlay1">Platforms</p>
                  <p className="text-sm font-semibold text-catppuccin-pink">{Object.keys(stats.platformStats).length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-catppuccin-green" />
                <div>
                  <p className="text-xs text-catppuccin-overlay1">Success Rate</p>
                  <p className="text-sm font-semibold text-catppuccin-green">
                    {problems.length > 0 ? Math.round((stats.solvedProblems / problems.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Heatmap data={heatmapData} />

      {/* Difficulty and Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader>
            <CardTitle className="text-catppuccin-blue">Difficulty Distribution</CardTitle>
            <CardDescription className="text-catppuccin-overlay1">
              Breakdown of solved problems by difficulty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-catppuccin-green text-catppuccin-surface0">Easy</Badge>
                  <span className="text-sm text-catppuccin-overlay1">{stats.difficultyStats.Easy} problems</span>
                </div>
                <div className="flex-1 mx-4">
                  <Progress 
                    value={stats.solvedProblems > 0 ? (stats.difficultyStats.Easy / stats.solvedProblems) * 100 : 0} 
                    className="h-2 bg-catppuccin-surface1"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-catppuccin-yellow text-catppuccin-surface0">Medium</Badge>
                  <span className="text-sm text-catppuccin-overlay1">{stats.difficultyStats.Medium} problems</span>
                </div>
                <div className="flex-1 mx-4">
                  <Progress 
                    value={stats.solvedProblems > 0 ? (stats.difficultyStats.Medium / stats.solvedProblems) * 100 : 0} 
                    className="h-2 bg-catppuccin-surface1"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-catppuccin-red text-catppuccin-surface0">Hard</Badge>
                  <span className="text-sm text-catppuccin-overlay1">{stats.difficultyStats.Hard} problems</span>
                </div>
                <div className="flex-1 mx-4">
                  <Progress 
                    value={stats.solvedProblems > 0 ? (stats.difficultyStats.Hard / stats.solvedProblems) * 100 : 0} 
                    className="h-2 bg-catppuccin-surface1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Platforms */}
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader>
            <CardTitle className="text-catppuccin-blue">Platform Activity</CardTitle>
            <CardDescription className="text-catppuccin-overlay1">
              Your most active competitive programming platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPlatforms.length === 0 ? (
              <p className="text-catppuccin-overlay1 text-center py-4">
                No platforms tracked yet. Start solving problems!
              </p>
            ) : (
              topPlatforms.map(([platform, count], index) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-catppuccin-surface2">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm text-catppuccin-overlay2">{platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-catppuccin-blue">{count}</span>
                    <div className="w-16 h-2 bg-catppuccin-surface1 rounded">
                      <div 
                        className="h-full bg-catppuccin-blue rounded"
                        style={{ 
                          width: `${Math.max((count / Math.max(...topPlatforms.map(([,c]) => c))) * 100, 10)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Tags */}
      <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
        <CardHeader>
          <CardTitle className="text-catppuccin-blue">Frequently Solved Topics</CardTitle>
          <CardDescription className="text-catppuccin-overlay1">
            Algorithm and data structure topics you've been practicing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topTags.length === 0 ? (
            <p className="text-catppuccin-overlay1 text-center py-4">
              No topics tracked yet. Add tags to your solved problems!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count], index) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-catppuccin-surface1 text-catppuccin-overlay2 hover:bg-catppuccin-surface2 transition-colors"
                >
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}