import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { 
  ExternalLink, 
  Clock, 
  Calendar, 
  Target, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Star,
  Zap
} from "lucide-react";

export interface Problem {
  id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  url: string;
  status: 'Solved' | 'Attempted' | 'To Review' | 'Unsolved';
  tags: string[];
  solvedAt?: string;
  timeSpent?: number;
  notes?: string;
  reviewDate?: string;
  isFavorite?: boolean;
}

interface ProblemCardProps {
  problem: Problem;
  onStatusChange: (id: string, status: Problem['status']) => void;
  onToggleFavorite: (id: string) => void;
  onAddReview: (id: string) => void;
}

export function ProblemCard({ problem, onStatusChange, onToggleFavorite, onAddReview }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-catppuccin-green text-catppuccin-surface0';
      case 'Medium': return 'bg-catppuccin-yellow text-catppuccin-surface0';
      case 'Hard': return 'bg-catppuccin-red text-catppuccin-surface0';
      default: return 'bg-catppuccin-surface1';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Solved': return <CheckCircle className="h-4 w-4 text-catppuccin-green" />;
      case 'Attempted': return <Clock className="h-4 w-4 text-catppuccin-yellow" />;
      case 'To Review': return <RotateCcw className="h-4 w-4 text-catppuccin-purple" />;
      default: return <XCircle className="h-4 w-4 text-catppuccin-red" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved': return 'bg-catppuccin-green/20 text-catppuccin-green border-catppuccin-green/30';
      case 'Attempted': return 'bg-catppuccin-yellow/20 text-catppuccin-yellow border-catppuccin-yellow/30';
      case 'To Review': return 'bg-catppuccin-purple/20 text-catppuccin-purple border-catppuccin-purple/30';
      default: return 'bg-catppuccin-red/20 text-catppuccin-red border-catppuccin-red/30';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return <Target className="h-4 w-4" />;
  };

  return (
    <Card className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:bg-catppuccin-surface1/50 transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-catppuccin-blue hover:text-catppuccin-blue/80 cursor-pointer">
                {problem.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(problem.id)}
                className={`h-6 w-6 p-0 ${problem.isFavorite ? 'text-catppuccin-yellow' : 'text-catppuccin-overlay1 hover:text-catppuccin-yellow'}`}
              >
                <Star className={`h-4 w-4 ${problem.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-catppuccin-overlay1">
                {getPlatformIcon(problem.platform)}
                <span>{problem.platform}</span>
              </div>
              {problem.rating && (
                <>
                  <span className="text-catppuccin-overlay1">•</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-catppuccin-yellow" />
                    <span className="text-xs text-catppuccin-overlay1">{problem.rating}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className={getStatusColor(problem.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(problem.status)}
                <span>{problem.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {problem.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Details */}
        {(problem.solvedAt || problem.timeSpent || problem.reviewDate) && (
          <div className="space-y-2">
            <Separator className="bg-catppuccin-surface1" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-catppuccin-overlay1">
              {problem.solvedAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Solved: {new Date(problem.solvedAt).toLocaleDateString()}</span>
                </div>
              )}
              {problem.timeSpent && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Time: {problem.timeSpent}m</span>
                </div>
              )}
              {problem.reviewDate && (
                <div className="flex items-center space-x-1">
                  <RotateCcw className="h-3 w-3" />
                  <span>Review: {new Date(problem.reviewDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {problem.notes && (
          <div className="space-y-1">
            <Separator className="bg-catppuccin-surface1" />
            <CardDescription className="text-xs bg-catppuccin-surface1 p-2 rounded text-catppuccin-overlay1">
              {problem.notes}
            </CardDescription>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(problem.id, 'Solved')}
              className="h-8 px-2 text-xs hover:bg-catppuccin-green/20 hover:text-catppuccin-green"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Solved
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddReview(problem.id)}
              className="h-8 px-2 text-xs hover:bg-catppuccin-purple/20 hover:text-catppuccin-purple"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Review
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(problem.url, '_blank')}
            className="h-8 px-2 text-xs hover:bg-catppuccin-blue/20 hover:text-catppuccin-blue"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}