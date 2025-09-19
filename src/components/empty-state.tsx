import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus, Code, Target, Trophy } from "lucide-react";

interface EmptyStateProps {
  onAddProblem: () => void;
}

export function EmptyState({ onAddProblem }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-catppuccin-blue select-none">
            <pre className="text-xs leading-tight">
{`    ╭─────────────────╮
    │  Welcome to     │
    │                 │
    │   ██████╗       │
    │  ██╔════╝       │
    │  ██║            │
    │  ██║            │
    │  ╚██████╗       │
    │   ╚═════╝       │
    │                 │
    │     ████████╗   │
    │     ╚══██╔══╝   │
    │        ██║      │
    │        ██║      │
    │        ██║      │
    │        ╚═╝      │
    ╰─────────────────╯`}
            </pre>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-catppuccin-blue">Start Your Coding Journey</h2>
            <p className="text-catppuccin-overlay1">
              Track problems from Codeforces, LeetCode, and more competitive programming platforms.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center py-4">
            <div className="space-y-2">
              <Code className="h-6 w-6 text-catppuccin-green mx-auto" />
              <p className="text-xs text-catppuccin-overlay1">Auto-fetch problem details</p>
            </div>
            <div className="space-y-2">
              <Target className="h-6 w-6 text-catppuccin-yellow mx-auto" />
              <p className="text-xs text-catppuccin-overlay1">Spaced repetition review</p>
            </div>
            <div className="space-y-2">
              <Trophy className="h-6 w-6 text-catppuccin-blue mx-auto" />
              <p className="text-xs text-catppuccin-overlay1">Track your progress</p>
            </div>
          </div>

          <Button 
            onClick={onAddProblem}
            className="w-full bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Problem
          </Button>

          <div className="text-xs text-catppuccin-overlay1 space-y-1">
            <p>💡 Tip: Just paste a problem URL and we'll fetch the details automatically!</p>
            <p>🔥 Build your coding streak and track your improvement over time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}