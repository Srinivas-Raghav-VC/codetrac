import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Filter
} from "lucide-react";
import { Problem } from "./problem-card";

interface ReviewSystemProps {
  problems: Problem[];
  onUpdateProblem: (id: string, updates: Partial<Problem>) => void;
}

interface ReviewItem extends Problem {
  reviewPriority: 'High' | 'Medium' | 'Low';
  daysSinceLastReview: number;
  difficultyScore: number;
}

export function ReviewSystem({ problems, onUpdateProblem }: ReviewSystemProps) {
  const [filter, setFilter] = useState<'all' | 'due' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'difficulty'>('priority');

  const calculateReviewPriority = (problem: Problem): 'High' | 'Medium' | 'Low' => {
    const daysSinceSolved = problem.solvedAt 
      ? Math.floor((Date.now() - new Date(problem.solvedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    if (problem.status === 'Attempted' || problem.status === 'To Review') return 'High';
    if (daysSinceSolved > 7 && problem.difficulty === 'Hard') return 'High';
    if (daysSinceSolved > 14) return 'Medium';
    return 'Low';
  };

  const getNextReviewDate = (problem: Problem): Date => {
    const baseDate = problem.reviewDate 
      ? new Date(problem.reviewDate)
      : problem.solvedAt 
        ? new Date(problem.solvedAt) 
        : new Date();
    
    // Spaced repetition intervals based on difficulty
    const intervals = {
      'Easy': [1, 3, 7, 14, 30],
      'Medium': [1, 2, 5, 10, 21],
      'Hard': [1, 2, 4, 8, 16]
    };
    
    const reviewCount = 0; // This would be tracked in real implementation
    const daysToAdd = intervals[problem.difficulty][Math.min(reviewCount, intervals[problem.difficulty].length - 1)];
    
    const nextDate = new Date(baseDate);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
  };

  const reviewItems: ReviewItem[] = problems
    .filter(p => p.status === 'Solved' || p.status === 'To Review' || p.status === 'Attempted')
    .map(problem => {
      const nextReview = getNextReviewDate(problem);
      const daysSinceLastReview = problem.reviewDate 
        ? Math.floor((Date.now() - new Date(problem.reviewDate).getTime()) / (1000 * 60 * 60 * 24))
        : problem.solvedAt 
          ? Math.floor((Date.now() - new Date(problem.solvedAt).getTime()) / (1000 * 60 * 60 * 24))
          : 0;

      return {
        ...problem,
        reviewPriority: calculateReviewPriority(problem),
        daysSinceLastReview,
        difficultyScore: problem.difficulty === 'Hard' ? 3 : problem.difficulty === 'Medium' ? 2 : 1,
        reviewDate: nextReview.toISOString()
      };
    });

  const filteredItems = reviewItems.filter(item => {
    const now = new Date();
    const reviewDate = new Date(item.reviewDate);
    
    switch (filter) {
      case 'due':
        return reviewDate <= now;
      case 'overdue':
        return reviewDate < new Date(now.getTime() - 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const sortedItems = filteredItems.sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.reviewPriority] - priorityOrder[a.reviewPriority];
      case 'date':
        return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
      case 'difficulty':
        return b.difficultyScore - a.difficultyScore;
      default:
        return 0;
    }
  });

  const handleMarkAsReviewed = (problemId: string) => {
    onUpdateProblem(problemId, {
      reviewDate: new Date().toISOString(),
      status: 'Solved'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-catppuccin-red text-catppuccin-surface0';
      case 'Medium': return 'bg-catppuccin-yellow text-catppuccin-surface0';
      default: return 'bg-catppuccin-green text-catppuccin-surface0';
    }
  };

  const getReviewStatus = (reviewDate: string) => {
    const now = new Date();
    const review = new Date(reviewDate);
    const daysDiff = Math.floor((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { text: 'Overdue', color: 'text-catppuccin-red', icon: AlertCircle };
    if (daysDiff === 0) return { text: 'Due Today', color: 'text-catppuccin-yellow', icon: Clock };
    return { text: `Due in ${daysDiff}d`, color: 'text-catppuccin-green', icon: Calendar };
  };

  const stats = {
    total: reviewItems.length,
    due: reviewItems.filter(item => new Date(item.reviewDate) <= new Date()).length,
    overdue: reviewItems.filter(item => new Date(item.reviewDate) < new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    highPriority: reviewItems.filter(item => item.reviewPriority === 'High').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-catppuccin-blue">Review System</h2>
          <p className="text-catppuccin-overlay1 mt-1">
            Systematic spaced repetition for competitive programming problems
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-catppuccin-blue" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Total Reviews</p>
                  <p className="text-xl font-bold text-catppuccin-blue">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-catppuccin-yellow" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Due Today</p>
                  <p className="text-xl font-bold text-catppuccin-yellow">{stats.due}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-catppuccin-red" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Overdue</p>
                  <p className="text-xl font-bold text-catppuccin-red">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-catppuccin-purple" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">High Priority</p>
                  <p className="text-xl font-bold text-catppuccin-purple">{stats.highPriority}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-catppuccin-overlay1" />
            <Select value={filter} onValueChange={(value: 'all' | 'due' | 'overdue') => setFilter(value)}>
              <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={(value: 'priority' | 'date' | 'difficulty') => setSortBy(value)}>
            <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Review Items */}
      <div className="space-y-4">
        {sortedItems.length === 0 ? (
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-catppuccin-overlay1 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-catppuccin-overlay2 mb-2">No problems to review</h3>
              <p className="text-catppuccin-overlay1">
                {filter === 'all' ? 'Add some solved problems to start reviewing!' : 'No problems match the current filter.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedItems.map((item) => {
            const status = getReviewStatus(item.reviewDate);
            const StatusIcon = status.icon;
            
            return (
              <Card key={item.id} className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:bg-catppuccin-surface1/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-catppuccin-blue">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-catppuccin-surface2">
                          {item.platform}
                        </Badge>
                        <Badge className={getPriorityColor(item.reviewPriority)}>
                          {item.reviewPriority} Priority
                        </Badge>
                        <div className={`flex items-center space-x-1 text-sm ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{status.text}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => window.open(item.url, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                      >
                        Review
                      </Button>
                      <Button
                        onClick={() => handleMarkAsReviewed(item.id)}
                        size="sm"
                        className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Done
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-catppuccin-overlay1">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Difficulty: {item.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last Reviewed: {item.daysSinceLastReview}d ago</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Next Review: {new Date(item.reviewDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {item.tags.length > 0 && (
                    <>
                      <Separator className="bg-catppuccin-surface1 my-3" />
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-catppuccin-surface2">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}