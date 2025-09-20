import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ProblemCard } from "./problem-card";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Star, 
  CheckCircle2, 
  AlertTriangle,
  Archive,
  Download,
  Upload,
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Problem as ApiProblem } from "../utils/api";

interface EnhancedProblemManagerProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
  onUpdateProblem: (id: string, updates: Partial<ApiProblem>) => Promise<void>;
  onDeleteProblem: (id: string) => Promise<void>;
  onBulkUpdate: (ids: string[], updates: Partial<ApiProblem>) => Promise<void>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onStatusChange: (id: string, status: ApiProblem['status']) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
  onAddReview: (id: string) => Promise<void>;
}

export function EnhancedProblemManager({
  problems,
  onAddProblem,
  onUpdateProblem,
  onDeleteProblem,
  onBulkUpdate,
  onBulkDelete,
  onStatusChange,
  onToggleFavorite,
  onAddReview
}: EnhancedProblemManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(new Set());
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || problem.status === filterStatus;
    const matchesDifficulty = filterDifficulty === "all" || problem.difficulty === filterDifficulty;
    const matchesPlatform = filterPlatform === "all" || problem.platform === filterPlatform;
    
    return matchesSearch && matchesStatus && matchesDifficulty && matchesPlatform;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        const dateA = a.solvedAt || a.reviewDate || a.updatedAt || "0";
        const dateB = b.solvedAt || b.reviewDate || b.updatedAt || "0";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      case "difficulty":
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "platform":
        return a.platform.localeCompare(b.platform);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const platforms = [...new Set(problems.map(p => p.platform))];

  const toggleSelectProblem = (problemId: string) => {
    const newSelected = new Set(selectedProblems);
    if (newSelected.has(problemId)) {
      newSelected.delete(problemId);
    } else {
      newSelected.add(problemId);
    }
    setSelectedProblems(newSelected);
  };

  const selectAllVisible = () => {
    const visibleIds = new Set(sortedProblems.map(p => p.id));
    setSelectedProblems(visibleIds);
  };

  const clearSelection = () => {
    setSelectedProblems(new Set());
  };

  const handleDeleteProblem = async (problemId: string) => {
    await onDeleteProblem(problemId);
    setDeleteConfirmOpen(false);
    setProblemToDelete(null);
  };

  const handleBulkDelete = async () => {
    await onBulkDelete(Array.from(selectedProblems));
    setSelectedProblems(new Set());
    setBulkDeleteConfirmOpen(false);
  };

  const handleBulkStatusUpdate = async (status: ApiProblem['status']) => {
    const updates: Partial<ApiProblem> = { status };
    
    if (status === 'Solved') {
      updates.solvedAt = new Date().toISOString();
    } else if (status === 'To Review') {
      updates.reviewDate = new Date().toISOString();
    }
    
    await onBulkUpdate(Array.from(selectedProblems), updates);
    setSelectedProblems(new Set());
    setBulkActionOpen(false);
  };

  const handleBulkFavorite = async (favorite: boolean) => {
    await onBulkUpdate(Array.from(selectedProblems), { isFavorite: favorite });
    setSelectedProblems(new Set());
    setBulkActionOpen(false);
  };

  const exportSelectedProblems = () => {
    const selectedData = problems.filter(p => selectedProblems.has(p.id));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `problems-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedProblems.size} problems`);
  };

  const stats = {
    total: filteredProblems.length,
    solved: filteredProblems.filter(p => p.status === 'Solved').length,
    attempted: filteredProblems.filter(p => p.status === 'Attempted').length,
    toReview: filteredProblems.filter(p => p.status === 'To Review').length,
    favorites: filteredProblems.filter(p => p.isFavorite).length,
    byDifficulty: {
      Easy: filteredProblems.filter(p => p.difficulty === 'Easy').length,
      Medium: filteredProblems.filter(p => p.difficulty === 'Medium').length,
      Hard: filteredProblems.filter(p => p.difficulty === 'Hard').length,
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <Grid className="h-6 w-6 inline mr-2" />
            Problem Manager
          </h1>
          <p className="text-catppuccin-overlay1">
            Comprehensive problem tracking with advanced management features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedProblems.size > 0 && (
            <Button
              variant="outline"
              onClick={() => setBulkActionOpen(true)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Bulk Actions ({selectedProblems.size})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
          >
            {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={onAddProblem}
            className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Problem
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <Grid className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
              <div className="text-lg font-bold text-catppuccin-blue">{stats.total}</div>
              <div className="text-xs text-catppuccin-overlay1">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
              <div className="text-lg font-bold text-catppuccin-green">{stats.solved}</div>
              <div className="text-xs text-catppuccin-overlay1">Solved</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
              <div className="text-lg font-bold text-catppuccin-yellow">{stats.attempted}</div>
              <div className="text-xs text-catppuccin-overlay1">Attempted</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <RefreshCw className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
              <div className="text-lg font-bold text-catppuccin-purple">{stats.toReview}</div>
              <div className="text-xs text-catppuccin-overlay1">To Review</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 text-catppuccin-pink mx-auto mb-2" />
              <div className="text-lg font-bold text-catppuccin-pink">{stats.favorites}</div>
              <div className="text-xs text-catppuccin-overlay1">Favorites</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-catppuccin-green">{stats.byDifficulty.Easy}</div>
              <div className="text-xs text-catppuccin-overlay1">Easy</div>
            </CardContent>
          </Card>
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-catppuccin-red">{stats.byDifficulty.Hard}</div>
              <div className="text-xs text-catppuccin-overlay1">Hard</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
            <Input
              placeholder="Search problems, platforms, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Attempted">Attempted</SelectItem>
                <SelectItem value="To Review">To Review</SelectItem>
                <SelectItem value="Unsolved">Unsolved</SelectItem>
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

            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Selection Controls */}
        {sortedProblems.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedProblems.size === sortedProblems.length && sortedProblems.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAllVisible();
                    } else {
                      clearSelection();
                    }
                  }}
                />
                <span className="text-sm text-catppuccin-overlay1">
                  Select All Visible ({sortedProblems.length})
                </span>
              </div>
              
              {selectedProblems.size > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-catppuccin-blue text-catppuccin-blue">
                    {selectedProblems.size} selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="hover:bg-catppuccin-surface1 text-catppuccin-overlay1"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-catppuccin-surface2">
                {sortedProblems.length} problems
              </Badge>
              {searchQuery && (
                <Badge variant="secondary" className="bg-catppuccin-surface1">
                  Searching: "{searchQuery}"
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Problems Grid */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {sortedProblems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-catppuccin-overlay1">
            {problems.length === 0 ? (
              <>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No problems yet</h3>
                <p className="mb-4">Start tracking your competitive programming journey!</p>
                <Button 
                  onClick={onAddProblem}
                  className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Problem
                </Button>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No problems found</h3>
                <p>Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          sortedProblems.map((problem) => (
            <div key={problem.id} className="relative">
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedProblems.has(problem.id)}
                  onCheckedChange={() => toggleSelectProblem(problem.id)}
                  className="bg-catppuccin-surface0 border-catppuccin-surface2"
                />
              </div>
              
              {/* Problem Card with Actions */}
              <div className="relative group">
                <ProblemCard
                  problem={problem}
                  onStatusChange={onStatusChange}
                  onToggleFavorite={onToggleFavorite}
                  onAddReview={onAddReview}
                />
                
                {/* Quick Actions Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-catppuccin-surface0/80 hover:bg-catppuccin-surface1"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
                      <DropdownMenuItem
                        onClick={() => window.open(problem.url, '_blank')}
                        className="hover:bg-catppuccin-surface1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Problem
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleFavorite(problem.id)}
                        className="hover:bg-catppuccin-surface1"
                      >
                        <Star className={`h-4 w-4 mr-2 ${problem.isFavorite ? 'text-catppuccin-yellow' : ''}`} />
                        {problem.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-catppuccin-surface1" />
                      <DropdownMenuItem
                        onClick={() => {
                          setProblemToDelete(problem.id);
                          setDeleteConfirmOpen(true);
                        }}
                        className="hover:bg-catppuccin-red/10 text-catppuccin-red"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Problem
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Actions Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Bulk Actions</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Perform actions on {selectedProblems.size} selected problems
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-catppuccin-foreground">Update Status</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('Solved')}
                  className="border-catppuccin-green hover:bg-catppuccin-green/10"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2 text-catppuccin-green" />
                  Mark Solved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('Attempted')}
                  className="border-catppuccin-yellow hover:bg-catppuccin-yellow/10"
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-catppuccin-yellow" />
                  Mark Attempted
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('To Review')}
                  className="border-catppuccin-purple hover:bg-catppuccin-purple/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2 text-catppuccin-purple" />
                  Add to Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('Unsolved')}
                  className="border-catppuccin-overlay1 hover:bg-catppuccin-surface1"
                >
                  <X className="h-4 w-4 mr-2 text-catppuccin-overlay1" />
                  Mark Unsolved
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-catppuccin-foreground">Favorites</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkFavorite(true)}
                  className="border-catppuccin-pink hover:bg-catppuccin-pink/10"
                >
                  <Star className="h-4 w-4 mr-2 text-catppuccin-pink" />
                  Add to Favorites
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkFavorite(false)}
                  className="border-catppuccin-overlay1 hover:bg-catppuccin-surface1"
                >
                  <Star className="h-4 w-4 mr-2 text-catppuccin-overlay1" />
                  Remove from Favorites
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-catppuccin-foreground">Export & Delete</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={exportSelectedProblems}
                  className="border-catppuccin-teal hover:bg-catppuccin-teal/10"
                >
                  <Download className="h-4 w-4 mr-2 text-catppuccin-teal" />
                  Export Selected
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkActionOpen(false);
                    setBulkDeleteConfirmOpen(true);
                  }}
                  className="border-catppuccin-red hover:bg-catppuccin-red/10 text-catppuccin-red"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-red">Delete Problem</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Are you sure you want to delete this problem? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => problemToDelete && handleDeleteProblem(problemToDelete)}
              className="bg-catppuccin-red hover:bg-catppuccin-red/80 text-catppuccin-surface0"
            >
              Delete Problem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-red">Delete Multiple Problems</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Are you sure you want to delete {selectedProblems.size} problems? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteConfirmOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkDelete}
              className="bg-catppuccin-red hover:bg-catppuccin-red/80 text-catppuccin-surface0"
            >
              Delete {selectedProblems.size} Problems
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}