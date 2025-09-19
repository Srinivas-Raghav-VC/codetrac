import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Trophy, Target, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "./auth/auth-wrapper";

interface HeaderProps {
  onAddProblem: () => void;
  onShowReview: () => void;
  stats?: {
    totalSolved: number;
    currentStreak: number;
    userRating?: number;
  };
}

export function Header({ onAddProblem, onShowReview, stats }: HeaderProps) {
  const { user, signOut } = useAuth();
  return (
    <div className="border-b border-catppuccin-surface1 bg-catppuccin-surface0 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-catppuccin-blue select-none">
              <pre className="text-sm leading-tight">
{`╭──────────────────────────────────────────────╮
│  ██████╗ ██████╗ ██████╗ ███████╗██████╗     │
│ ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗    │
│ ██║     ██║   ██║██║  ██║█████╗  ██████╔╝    │
│ ██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗    │
│ ╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║    │
│  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    │
│                                              │
│         ████████╗██████╗  █████╗  ██████╗    │
│         ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝    │
│            ██║   ██████╔╝███████║██║         │
│            ██║   ██╔══██╗██╔══██║██║         │
│            ██║   ██║  ██║██║  ██║╚██████╗    │
│            ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    │
╰──────────────────────────────────────────────╯`}
              </pre>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-catppuccin-blue">CodeTrac</h1>
              <p className="text-sm text-catppuccin-overlay1">Competitive Programming Progress Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onShowReview}
              variant="outline"
              size="sm"
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Review System
            </Button>
            <Button
              onClick={onAddProblem}
              className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-catppuccin-surface2 hover:bg-catppuccin-surface1">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-catppuccin-surface0 border-catppuccin-surface1">
                <DropdownMenuItem disabled className="text-catppuccin-overlay1">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-catppuccin-surface1" />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="text-catppuccin-red hover:bg-catppuccin-red/10 hover:text-catppuccin-red cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-catppuccin-yellow" />
            <span className="text-catppuccin-overlay2">Problems Solved:</span>
            <Badge variant="secondary" className="bg-catppuccin-surface1">
              {stats?.totalSolved || 0}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-catppuccin-green" />
            <span className="text-catppuccin-overlay2">Current Streak:</span>
            <Badge variant="secondary" className="bg-catppuccin-surface1">
              {stats?.currentStreak || 0} days
            </Badge>
          </div>
          {stats?.userRating && (
            <div className="flex items-center space-x-2">
              <span className="text-catppuccin-overlay2">Rating:</span>
              <Badge className="bg-catppuccin-purple text-catppuccin-surface0">
                {stats.userRating}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}