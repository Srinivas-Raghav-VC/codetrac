import { useState, useEffect } from "react";
import { AuthProvider } from "./components/auth/auth-wrapper";
import { Header } from "./components/header";
import { Dashboard } from "./components/dashboard";
import { ProblemCard, Problem } from "./components/problem-card";
import { AddProblemDialog } from "./components/add-problem-dialog";
import { ReviewSystem } from "./components/review-system";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Search, Filter, Grid, List, Flame, Loader2, AlertCircle, Plus } from "lucide-react";
import { Toaster, toast } from "sonner@2.0.3";
import { 
  getProblems, 
  createProblem, 
  updateProblem, 
  getHeatmapData, 
  getDashboardStats,
  Problem as ApiProblem,
  HeatmapData,
  DashboardStats
} from "./utils/api";

function AppContent() {
  const [problems, setProblems] = useState<ApiProblem[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [addProblemOpen, setAddProblemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [problemsResponse, heatmapResponse, statsResponse] = await Promise.all([
        getProblems(),
        getHeatmapData(),
        getDashboardStats()
      ]);

      if (!problemsResponse.success) {
        throw new Error(problemsResponse.error || 'Failed to load problems');
      }
      if (!heatmapResponse.success) {
        throw new Error(heatmapResponse.error || 'Failed to load heatmap data');
      }
      if (!statsResponse.success) {
        throw new Error(statsResponse.error || 'Failed to load dashboard stats');
      }

      setProblems(problemsResponse.data || []);
      setHeatmapData(heatmapResponse.data || []);
      setDashboardStats(statsResponse.data || null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (newProblem: Omit<ApiProblem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await createProblem(newProblem);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add problem');
      }
      
      setProblems(prev => [response.data!, ...prev]);
      toast.success("Problem added successfully!");
      
      // Refresh dashboard stats
      const statsResponse = await getDashboardStats();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data!);
      }
    } catch (error) {
      console.error('Error adding problem:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add problem');
    }
  };

  const handleUpdateProblem = async (id: string, updates: Partial<ApiProblem>) => {
    try {
      const response = await updateProblem(id, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update problem');
      }
      
      setProblems(prev => 
        prev.map(problem => 
          problem.id === id ? response.data! : problem
        )
      );
      
      // Refresh dashboard stats and heatmap if status changed
      if (updates.status) {
        const [statsResponse, heatmapResponse] = await Promise.all([
          getDashboardStats(),
          getHeatmapData()
        ]);
        
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data!);
        }
        if (heatmapResponse.success) {
          setHeatmapData(heatmapResponse.data!);
        }
      }
    } catch (error) {
      console.error('Error updating problem:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update problem');
    }
  };

  const handleStatusChange = async (id: string, status: ApiProblem['status']) => {
    const updates: Partial<ApiProblem> = { status };
    
    if (status === 'Solved' && !problems.find(p => p.id === id)?.solvedAt) {
      updates.solvedAt = new Date().toISOString();
    }
    
    if (status === 'To Review') {
      updates.reviewDate = new Date().toISOString();
    }
    
    await handleUpdateProblem(id, updates);
    toast.success(`Problem marked as ${status.toLowerCase()}`);
  };

  const handleToggleFavorite = async (id: string) => {
    const problem = problems.find(p => p.id === id);
    await handleUpdateProblem(id, { isFavorite: !problem?.isFavorite });
  };

  const handleAddReview = async (id: string) => {
    await handleUpdateProblem(id, { 
      status: 'To Review',
      reviewDate: new Date().toISOString()
    });
    toast.success("Problem added to review queue");
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || problem.status === filterStatus;
    const matchesDifficulty = filterDifficulty === "all" || problem.difficulty === filterDifficulty;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        const dateA = a.solvedAt || a.reviewDate || "0";
        const dateB = b.solvedAt || b.reviewDate || "0";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      case "difficulty":
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-catppuccin-blue mx-auto" />
          <p className="text-catppuccin-overlay1">Loading your CodeTrac data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-6">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-catppuccin-red mx-auto" />
            <h2 className="text-lg font-semibold text-catppuccin-red">Error Loading Data</h2>
            <p className="text-catppuccin-overlay1">{error}</p>
            <Button 
              onClick={loadData} 
              className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header 
        onAddProblem={() => setAddProblemOpen(true)}
        onShowReview={() => setActiveTab("review")}
        stats={{
          totalSolved: dashboardStats?.solvedProblems || 0,
          currentStreak: dashboardStats?.currentStreak || 0,
        }}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
            >
              <Flame className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="problems"
              className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
            >
              <Grid className="h-4 w-4 mr-2" />
              Problems
            </TabsTrigger>
            <TabsTrigger 
              value="review"
              className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Review System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              problems={problems} 
              heatmapData={heatmapData}
              dashboardStats={dashboardStats}
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            {/* Filters and Search */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
                  <Input
                    placeholder="Search problems, platforms, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
                  />
                </div>
                
                <div className="flex space-x-2">
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

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
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

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-catppuccin-surface2">
                    {sortedProblems.length} problems
                  </Badge>
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-catppuccin-surface1">
                      Searching: "{searchQuery}"
                    </Badge>
                  )}
                  {filterStatus !== "all" && (
                    <Badge variant="secondary" className="bg-catppuccin-surface1">
                      Status: {filterStatus}
                    </Badge>
                  )}
                  {filterDifficulty !== "all" && (
                    <Badge variant="secondary" className="bg-catppuccin-surface1">
                      Difficulty: {filterDifficulty}
                    </Badge>
                  )}
                </div>
              </div>
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
                        onClick={() => setAddProblemOpen(true)}
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
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onStatusChange={handleStatusChange}
                    onToggleFavorite={handleToggleFavorite}
                    onAddReview={handleAddReview}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <ReviewSystem 
              problems={problems}
              onUpdateProblem={handleUpdateProblem}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddProblemDialog
        open={addProblemOpen}
        onOpenChange={setAddProblemOpen}
        onAddProblem={handleAddProblem}
      />

      <Toaster 
        theme="dark" 
        toastOptions={{
          style: {
            background: 'var(--catppuccin-surface0)',
            border: '1px solid var(--catppuccin-surface1)',
            color: 'var(--catppuccin-foreground)',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}