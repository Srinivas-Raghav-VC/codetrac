import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star,
  MoreHorizontal,
  Search,
  Filter,
  Share,
  Download,
  Upload,
  Target,
  Brain,
  Code,
  Video,
  FileText,
  Link,
  Globe,
  Lock,
  Eye,
  Copy
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Problem as ApiProblem } from "../utils/api";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedHours: number;
  category: string;
  tags: string[];
  isPublic: boolean;
  author: string;
  enrolledCount: number;
  rating: number;
  lectures: Lecture[];
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
  progress?: number;
  isEnrolled?: boolean;
  isFavorite?: boolean;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'assignment';
  duration: number; // in minutes
  url?: string;
  content?: string;
  problems?: string[]; // problem IDs
  completed?: boolean;
  order: number;
}

interface EnhancedLearningPathsProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
}

const SAMPLE_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'dp-mastery',
    title: 'Dynamic Programming Mastery',
    description: 'Complete guide to dynamic programming from basic concepts to advanced optimization techniques',
    difficulty: 'Intermediate',
    estimatedHours: 40,
    category: 'Algorithms',
    tags: ['dynamic-programming', 'optimization', 'recursion'],
    isPublic: true,
    author: 'CodeTrac Community',
    enrolledCount: 1247,
    rating: 4.8,
    prerequisites: ['Basic recursion', 'Time complexity analysis'],
    learningObjectives: [
      'Understand DP fundamentals and when to apply them',
      'Master common DP patterns (Linear, 2D, Tree, etc.)',
      'Solve complex optimization problems efficiently',
      'Implement space-optimized DP solutions'
    ],
    lectures: [
      {
        id: 'dp-intro',
        title: 'Introduction to Dynamic Programming',
        description: 'Understanding the core concepts and when to use DP',
        type: 'video',
        duration: 45,
        url: 'https://example.com/dp-intro',
        completed: true,
        order: 1
      },
      {
        id: 'dp-fibonacci',
        title: 'Classic DP: Fibonacci and Climbing Stairs',
        description: 'Starting with the most basic DP problems',
        type: 'practice',
        duration: 60,
        problems: ['fibonacci', 'climbing-stairs'],
        completed: true,
        order: 2
      },
      {
        id: 'dp-linear',
        title: 'Linear DP Patterns',
        description: 'House robber, maximum subarray, and similar problems',
        type: 'video',
        duration: 55,
        completed: false,
        order: 3
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    progress: 67,
    isEnrolled: true,
    isFavorite: true
  },
  {
    id: 'graph-algorithms',
    title: 'Graph Algorithms Deep Dive',
    description: 'Comprehensive exploration of graph theory and algorithms',
    difficulty: 'Advanced',
    estimatedHours: 35,
    category: 'Graph Theory',
    tags: ['graphs', 'bfs', 'dfs', 'shortest-path'],
    isPublic: true,
    author: 'Prof. Algorithm',
    enrolledCount: 892,
    rating: 4.9,
    prerequisites: ['Basic data structures', 'BFS/DFS understanding'],
    learningObjectives: [
      'Master graph traversal algorithms',
      'Understand shortest path algorithms',
      'Solve complex graph problems',
      'Implement efficient graph data structures'
    ],
    lectures: [
      {
        id: 'graph-intro',
        title: 'Graph Representations and Basic Traversals',
        description: 'Adjacency lists, matrices, BFS, and DFS',
        type: 'video',
        duration: 50,
        completed: false,
        order: 1
      }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    progress: 0,
    isEnrolled: false,
    isFavorite: false
  },
  {
    id: 'binary-search-mastery',
    title: 'Binary Search Mastery',
    description: 'Master all variations of binary search from basic to advanced applications',
    difficulty: 'Beginner',
    estimatedHours: 15,
    category: 'Search Algorithms',
    tags: ['binary-search', 'sorted-arrays', 'optimization'],
    isPublic: true,
    author: 'Search Expert',
    enrolledCount: 2156,
    rating: 4.7,
    prerequisites: ['Basic programming', 'Array understanding'],
    learningObjectives: [
      'Understand binary search fundamentals',
      'Master different binary search patterns',
      'Apply binary search to optimization problems',
      'Avoid common binary search mistakes'
    ],
    lectures: [
      {
        id: 'bs-basic',
        title: 'Basic Binary Search',
        description: 'Classic binary search implementation',
        type: 'video',
        duration: 30,
        completed: false,
        order: 1
      },
      {
        id: 'bs-variations',
        title: 'Binary Search Variations',
        description: 'Lower bound, upper bound, and search in rotated arrays',
        type: 'practice',
        duration: 90,
        completed: false,
        order: 2
      }
    ],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-15T12:10:00Z',
    progress: 0,
    isEnrolled: false,
    isFavorite: true
  }
];

export function EnhancedLearningPaths({ problems, onAddProblem }: EnhancedLearningPathsProps) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(SAMPLE_LEARNING_PATHS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterEnrollment, setFilterEnrollment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [activeTab, setActiveTab] = useState("browse");
  
  // Dialog states
  const [createPathOpen, setCreatePathOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<string | null>(null);

  // New path form
  const [newPath, setNewPath] = useState<Partial<LearningPath>>({
    title: '',
    description: '',
    difficulty: 'Beginner',
    estimatedHours: 10,
    category: '',
    tags: [],
    isPublic: false,
    prerequisites: [],
    learningObjectives: [],
    lectures: []
  });

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = filterDifficulty === "all" || path.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === "all" || path.category === filterCategory;
    
    let matchesEnrollment = true;
    if (filterEnrollment === "enrolled") matchesEnrollment = path.isEnrolled || false;
    else if (filterEnrollment === "favorites") matchesEnrollment = path.isFavorite || false;
    else if (filterEnrollment === "completed") matchesEnrollment = (path.progress || 0) >= 100;
    else if (filterEnrollment === "in-progress") matchesEnrollment = (path.progress || 0) > 0 && (path.progress || 0) < 100;
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesEnrollment;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "popularity":
        return b.enrolledCount - a.enrolledCount;
      case "difficulty":
        const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "duration":
        return a.estimatedHours - b.estimatedHours;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  const categories = [...new Set(learningPaths.map(path => path.category))];

  const handleCreatePath = () => {
    const path: LearningPath = {
      id: `path-${Date.now()}`,
      title: newPath.title || 'Untitled Path',
      description: newPath.description || '',
      difficulty: newPath.difficulty || 'Beginner',
      estimatedHours: newPath.estimatedHours || 10,
      category: newPath.category || 'General',
      tags: newPath.tags || [],
      isPublic: newPath.isPublic || false,
      author: 'You',
      enrolledCount: 0,
      rating: 0,
      prerequisites: newPath.prerequisites || [],
      learningObjectives: newPath.learningObjectives || [],
      lectures: newPath.lectures || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      isEnrolled: true,
      isFavorite: false
    };

    setLearningPaths(prev => [path, ...prev]);
    setNewPath({
      title: '',
      description: '',
      difficulty: 'Beginner',
      estimatedHours: 10,
      category: '',
      tags: [],
      isPublic: false,
      prerequisites: [],
      learningObjectives: [],
      lectures: []
    });
    setCreatePathOpen(false);
    toast.success("Learning path created successfully!");
  };

  const handleUpdatePath = (pathId: string, updates: Partial<LearningPath>) => {
    setLearningPaths(prev => prev.map(path => 
      path.id === pathId 
        ? { ...path, ...updates, updatedAt: new Date().toISOString() } 
        : path
    ));
    toast.success("Learning path updated successfully!");
  };

  const handleDeletePath = (pathId: string) => {
    setLearningPaths(prev => prev.filter(path => path.id !== pathId));
    setDeleteConfirmOpen(false);
    setPathToDelete(null);
    toast.success("Learning path deleted successfully!");
  };

  const handleEnrollPath = (pathId: string) => {
    handleUpdatePath(pathId, { isEnrolled: true });
    toast.success("Enrolled in learning path!");
  };

  const handleUnenrollPath = (pathId: string) => {
    handleUpdatePath(pathId, { isEnrolled: false, progress: 0 });
    toast.success("Unenrolled from learning path!");
  };

  const handleToggleFavorite = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    handleUpdatePath(pathId, { isFavorite: !path?.isFavorite });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'Intermediate': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'Advanced': return 'text-catppuccin-purple border-catppuccin-purple bg-catppuccin-purple/10';
      case 'Expert': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const getLectureIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'practice': return <Code className="h-4 w-4" />;
      case 'quiz': return <Brain className="h-4 w-4" />;
      case 'assignment': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <BookOpen className="h-6 w-6 inline mr-2" />
            Learning Paths
          </h1>
          <p className="text-catppuccin-overlay1">
            Structured learning paths for mastering competitive programming concepts
          </p>
        </div>
        <Button 
          onClick={() => setCreatePathOpen(true)}
          className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Path
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1">
          <TabsTrigger 
            value="browse" 
            className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
          >
            <Search className="h-4 w-4 mr-1" />
            Browse Paths
          </TabsTrigger>
          <TabsTrigger 
            value="enrolled" 
            className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            My Learning
          </TabsTrigger>
          <TabsTrigger 
            value="created" 
            className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
          >
            <Edit className="h-4 w-4 mr-1" />
            Created by Me
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
              <Input
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedPaths.map((path) => (
              <Card 
                key={path.id}
                className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer group"
                onClick={() => setSelectedPath(path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-mono text-base truncate mb-2">{path.title}</CardTitle>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-catppuccin-overlay1 border-catppuccin-surface2">
                          {path.category}
                        </Badge>
                        {path.isEnrolled && (
                          <Badge className="bg-catppuccin-blue text-catppuccin-surface0">
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(path.id);
                          }}
                        >
                          <Star className={`h-4 w-4 mr-2 ${path.isFavorite ? 'text-catppuccin-yellow' : ''}`} />
                          {path.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </DropdownMenuItem>
                        {path.author === 'You' && (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPath(path);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Path
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setPathToDelete(path.id);
                                setDeleteConfirmOpen(true);
                              }}
                              className="text-catppuccin-red hover:bg-catppuccin-red/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Path
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-catppuccin-overlay1 line-clamp-2">
                    {path.description}
                  </p>

                  {/* Progress Bar (if enrolled) */}
                  {path.isEnrolled && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-catppuccin-overlay1">Progress</span>
                        <span className="text-catppuccin-foreground">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {path.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-catppuccin-surface2">
                        {tag}
                      </Badge>
                    ))}
                    {path.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{path.tags.length - 3}</Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{path.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{path.enrolledCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-catppuccin-yellow" />
                        <span>{path.rating}</span>
                      </div>
                    </div>
                    
                    {!path.isEnrolled ? (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollPath(path.id);
                        }}
                        className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0 h-6 px-2 text-xs"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Enroll
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPath(path);
                        }}
                        className="border-catppuccin-surface2 hover:bg-catppuccin-surface1 h-6 px-2 text-xs"
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningPaths.filter(path => path.isEnrolled).map((path) => (
              <Card key={path.id} className="bg-catppuccin-surface0 border-catppuccin-surface1">
                <CardHeader>
                  <CardTitle className="font-mono">{path.title}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-catppuccin-overlay1">Progress</span>
                      <span className="text-catppuccin-foreground">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-catppuccin-overlay1">{path.description}</p>
                    <div className="flex justify-between">
                      <Button
                        size="sm"
                        onClick={() => setSelectedPath(path)}
                        className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                      >
                        Continue Learning
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnenrollPath(path.id)}
                        className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                      >
                        Unenroll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="created" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningPaths.filter(path => path.author === 'You').map((path) => (
              <Card key={path.id} className="bg-catppuccin-surface0 border-catppuccin-surface1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-mono">{path.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
                        <DropdownMenuItem onClick={() => setEditingPath(path)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPathToDelete(path.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="text-catppuccin-red hover:bg-catppuccin-red/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                    {path.isPublic ? (
                      <Badge className="bg-catppuccin-teal text-catppuccin-surface0">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-catppuccin-surface2">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-catppuccin-overlay1">{path.description}</p>
                    <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{path.enrolledCount} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-catppuccin-yellow" />
                        <span>{path.rating || 'No ratings'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Learning Path Dialog */}
      <Dialog open={createPathOpen} onOpenChange={setCreatePathOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create Learning Path</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Create a structured learning path for yourself or the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Title</label>
                <Input
                  placeholder="Enter path title..."
                  value={newPath.title}
                  onChange={(e) => setNewPath(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Difficulty</label>
                <Select 
                  value={newPath.difficulty} 
                  onValueChange={(value: any) => setNewPath(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-catppuccin-overlay1">Description</label>
              <Textarea
                placeholder="Describe what this learning path covers..."
                value={newPath.description}
                onChange={(e) => setNewPath(prev => ({ ...prev, description: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Category</label>
                <Input
                  placeholder="e.g., Algorithms, Data Structures"
                  value={newPath.category}
                  onChange={(e) => setNewPath(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Estimated Hours</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={newPath.estimatedHours}
                  onChange={(e) => setNewPath(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 10 }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newPath.isPublic || false}
                onChange={(e) => setNewPath(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-catppuccin-surface2"
              />
              <label htmlFor="isPublic" className="text-sm text-catppuccin-overlay1">
                Make this path public for the community
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCreatePathOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePath}
              disabled={!newPath.title || !newPath.description}
              className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
            >
              Create Path
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-red">Delete Learning Path</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Are you sure you want to delete this learning path? This action cannot be undone.
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
              onClick={() => pathToDelete && handleDeletePath(pathToDelete)}
              className="bg-catppuccin-red hover:bg-catppuccin-red/80 text-catppuccin-surface0"
            >
              Delete Path
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Learning Path Detail Dialog */}
      {selectedPath && (
        <Dialog open={!!selectedPath} onOpenChange={() => setSelectedPath(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-catppuccin-blue text-xl">{selectedPath.title}</DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getDifficultyColor(selectedPath.difficulty)}>
                  {selectedPath.difficulty}
                </Badge>
                <Badge variant="outline">{selectedPath.category}</Badge>
                <div className="flex items-center space-x-1 text-sm text-catppuccin-overlay1">
                  <Clock className="h-3 w-3" />
                  <span>{selectedPath.estimatedHours}h</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-catppuccin-overlay1">
                  <Star className="h-3 w-3 text-catppuccin-yellow" />
                  <span>{selectedPath.rating}</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <p className="text-catppuccin-overlay1">{selectedPath.description}</p>
              </div>

              {selectedPath.isEnrolled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-catppuccin-overlay1">Your Progress</span>
                    <span className="text-catppuccin-foreground">{selectedPath.progress}%</span>
                  </div>
                  <Progress value={selectedPath.progress} className="h-2" />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-catppuccin-foreground">Lectures</h3>
                <div className="space-y-2">
                  {selectedPath.lectures.map((lecture) => (
                    <div 
                      key={lecture.id}
                      className="flex items-center justify-between p-3 rounded border border-catppuccin-surface2 hover:border-catppuccin-blue/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-catppuccin-blue">
                          {getLectureIcon(lecture.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-catppuccin-foreground">{lecture.title}</h4>
                          <p className="text-sm text-catppuccin-overlay1">{lecture.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {lecture.duration}m
                        </Badge>
                        {lecture.completed && (
                          <CheckCircle2 className="h-4 w-4 text-catppuccin-green" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {!selectedPath.isEnrolled ? (
                  <Button
                    onClick={() => {
                      handleEnrollPath(selectedPath.id);
                      setSelectedPath(null);
                    }}
                    className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Enroll in Path
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedPath(null)}
                    className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                  >
                    Continue Learning
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}