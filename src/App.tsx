import { useState, useEffect } from "react";
import { AuthProvider } from "./components/auth/auth-wrapper";
import { OnboardingFlow } from "./components/onboarding-flow";
import { WelcomeDashboard } from "./components/welcome-dashboard";
import { Header } from "./components/header";
import { Dashboard } from "./components/dashboard";
import { ConceptsHub } from "./components/concepts-hub";
import { EnhancedLearningPaths } from "./components/enhanced-learning-paths";
import { EnhancedPatternTracker } from "./components/enhanced-pattern-tracker";
import { EnhancedCustomContent } from "./components/enhanced-custom-content";
import { EnhancedProblemManager } from "./components/enhanced-problem-manager";
import { OrganizationManager } from "./components/organization-manager";
import { CommunityHub } from "./components/community-hub";
import { AdvancedAnalytics } from "./components/advanced-analytics";
import { AddProblemDialog } from "./components/add-problem-dialog";
import { ReviewSystem } from "./components/review-system";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Flame, Loader2, AlertCircle, Plus, Brain, BookOpen, Target, FileText, Home, Users, Globe, Building2, BarChart3, Grid, Filter } from "lucide-react";
import { Toaster, toast } from "sonner@2.0.3";
import { 
  getProblems, 
  createProblem, 
  updateProblem, 
  deleteProblem,
  getHeatmapData, 
  getDashboardStats,
  Problem as ApiProblem,
  HeatmapData,
  DashboardStats
} from "./utils/api";

interface UserPreferences {
  name: string;
  experience: string;
  platforms: string[];
  goals: string[];
  studySchedule: string;
  preferredTopics: string[];
  motivations: string[];
  customGoal?: string;
}

function AppContent() {
  const [problems, setProblems] = useState<ApiProblem[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [addProblemOpen, setAddProblemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Onboarding and user preferences
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const savedPreferences = localStorage.getItem('codeTracPreferences');
    const onboardingCompleted = localStorage.getItem('codeTracOnboardingComplete');
    
    if (savedPreferences && onboardingCompleted === 'true') {
      setUserPreferences(JSON.parse(savedPreferences));
      setIsOnboardingComplete(true);
      loadData();
    } else {
      setShowOnboarding(true);
      setLoading(false);
    }
  }, []);

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setIsOnboardingComplete(true);
    setShowOnboarding(false);
    
    // Save to localStorage
    localStorage.setItem('codeTracPreferences', JSON.stringify(preferences));
    localStorage.setItem('codeTracOnboardingComplete', 'true');
    
    // Load app data
    loadData();
    
    toast.success(`Welcome to CodeTrac, ${preferences.name}! 🎉`);
  };

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

  const handleDeleteProblem = async (id: string) => {
    try {
      const response = await deleteProblem(id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete problem');
      }
      
      setProblems(prev => prev.filter(problem => problem.id !== id));
      toast.success("Problem deleted successfully!");
      
      // Refresh dashboard stats
      const statsResponse = await getDashboardStats();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data!);
      }
      
      // Refresh heatmap data
      const heatmapResponse = await getHeatmapData();
      if (heatmapResponse.success) {
        setHeatmapData(heatmapResponse.data!);
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete problem');
    }
  };

  const handleBulkDelete = async (problemIds: string[]) => {
    try {
      const deletePromises = problemIds.map(id => deleteProblem(id));
      const responses = await Promise.all(deletePromises);
      
      const failed = responses.filter(r => !r.success);
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} problems`);
      }
      
      setProblems(prev => prev.filter(problem => !problemIds.includes(problem.id)));
      toast.success(`${problemIds.length} problems deleted successfully!`);
      
      // Refresh stats and heatmap
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
    } catch (error) {
      console.error('Error bulk deleting problems:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete problems');
    }
  };

  const handleBulkUpdate = async (problemIds: string[], updates: Partial<ApiProblem>) => {
    try {
      const updatePromises = problemIds.map(id => updateProblem(id, updates));
      const responses = await Promise.all(updatePromises);
      
      const failed = responses.filter(r => !r.success);
      if (failed.length > 0) {
        throw new Error(`Failed to update ${failed.length} problems`);
      }
      
      setProblems(prev => prev.map(problem => 
        problemIds.includes(problem.id) 
          ? { ...problem, ...updates, updatedAt: new Date().toISOString() }
          : problem
      ));
      
      toast.success(`${problemIds.length} problems updated successfully!`);
      
      // Refresh stats if status was changed
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
      console.error('Error bulk updating problems:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update problems');
    }
  };

  const handleStartAction = (action: string) => {
    switch (action) {
      case 'add-problem':
        setAddProblemOpen(true);
        break;
      case 'create-note':
        setActiveTab('notes');
        break;
      case 'explore-patterns':
        setActiveTab('patterns');
        break;
      case 'browse-learning':
        setActiveTab('learning');
        break;
      default:
        break;
    }
  };

  const handleResetApp = () => {
    setIsOnboardingComplete(false);
    setUserPreferences(null);
    setShowOnboarding(true);
    setActiveTab("home");
    setProblems([]);
    setHeatmapData([]);
    setDashboardStats(null);
  };



  // Show onboarding flow for new users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-catppuccin-blue mx-auto" />
          <p className="text-catppuccin-overlay1">Loading your CodeTrac workspace...</p>
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

  const appStats = {
    totalProblems: problems.length,
    solvedProblems: problems.filter(p => p.status === 'Solved').length,
    currentStreak: dashboardStats?.currentStreak || 0,
    notesCount: 3 // This would come from notes data in real implementation
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header 
        onAddProblem={() => setAddProblemOpen(true)}
        onShowReview={() => setActiveTab("review")}
        onResetApp={handleResetApp}
        stats={{
          totalSolved: dashboardStats?.solvedProblems || 0,
          currentStreak: dashboardStats?.currentStreak || 0,
        }}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1 w-full overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              <TabsTrigger 
                value="home" 
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Home className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="concepts" 
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Brain className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Concepts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="learning" 
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Learning</span>
              </TabsTrigger>
              <TabsTrigger 
                value="patterns" 
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Target className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Flame className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="problems"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Grid className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Problems</span>
              </TabsTrigger>
              <TabsTrigger 
                value="review"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
              <TabsTrigger 
                value="organizations"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <Building2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-shrink-0"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <WelcomeDashboard
              userName={userPreferences?.name || 'User'}
              userPreferences={userPreferences}
              onStartAction={handleStartAction}
              onAddProblem={() => setAddProblemOpen(true)}
              stats={appStats}
            />
          </TabsContent>

          <TabsContent value="concepts" className="space-y-6">
            <ConceptsHub 
              problems={problems}
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <EnhancedLearningPaths 
              problems={problems}
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <EnhancedPatternTracker 
              problems={problems}
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <EnhancedCustomContent 
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              problems={problems} 
              heatmapData={heatmapData}
              dashboardStats={dashboardStats}
              onAddProblem={() => setAddProblemOpen(true)}
            />
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            <EnhancedProblemManager
              problems={problems}
              onAddProblem={() => setAddProblemOpen(true)}
              onUpdateProblem={handleUpdateProblem}
              onDeleteProblem={handleDeleteProblem}
              onBulkUpdate={handleBulkUpdate}
              onBulkDelete={handleBulkDelete}
              onStatusChange={handleStatusChange}
              onToggleFavorite={handleToggleFavorite}
              onAddReview={handleAddReview}
            />
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <ReviewSystem 
              problems={problems}
              onUpdateProblem={handleUpdateProblem}
            />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityHub 
              problems={problems}
              currentUserId="current-user-id"
            />
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <OrganizationManager 
              problems={problems}
              currentUserId="current-user-id"
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics 
              problems={problems}
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