import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Users,
  Star,
  FileText,
  Video,
  Code,
  Lightbulb,
  TrendingUp,
  Filter,
  Search,
  Edit,
  Save,
  X
} from "lucide-react";
import { Problem as ApiProblem } from "../utils/api";

interface LearningPathsProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'official' | 'community' | 'personal';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  tags: string[];
  author: string;
  lectures: Lecture[];
  createdAt: string;
  isPublic: boolean;
  enrolledCount?: number;
  rating?: number;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'practice' | 'notes';
  duration: string; // e.g., "45 min", "2 hours"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patterns: string[]; // specific patterns within the concept
  resources: Resource[];
  problems: string[]; // problem IDs
  completed: boolean;
  notes?: string;
  order: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'tutorial' | 'code' | 'notes';
  url?: string;
  content?: string;
  author?: string;
}

const SAMPLE_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'binary-search-fundamentals',
    title: 'Binary Search Mastery',
    description: 'Complete guide from basic binary search to advanced applications including predicate functions and optimization.',
    category: 'official',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    tags: ['binary-search', 'algorithms', 'optimization'],
    author: 'CodeTrac',
    createdAt: '2024-01-15',
    isPublic: true,
    enrolledCount: 156,
    rating: 4.8,
    lectures: [
      {
        id: 'bs-intro',
        title: 'Binary Search Fundamentals',
        description: 'Understanding the basic binary search algorithm and when to use it',
        type: 'reading',
        duration: '30 min',
        difficulty: 'Easy',
        patterns: ['basic-binary-search', 'array-search'],
        resources: [
          {
            id: 'bs-intro-1',
            title: 'Binary Search Tutorial',
            type: 'article',
            url: 'https://example.com/binary-search',
            author: 'CF Tutorial'
          }
        ],
        problems: [],
        completed: false,
        order: 1
      },
      {
        id: 'bs-predicate',
        title: 'Predicate Functions & Binary Search',
        description: 'Using binary search to find optimal solutions with boolean predicates',
        type: 'practice',
        duration: '90 min',
        difficulty: 'Medium',
        patterns: ['predicate-search', 'optimization', 'ternary-search'],
        resources: [],
        problems: [],
        completed: false,
        order: 2
      },
      {
        id: 'bs-advanced',
        title: 'Advanced Applications',
        description: 'Binary search on answers, floating point binary search, and complex applications',
        type: 'practice',
        duration: '2 hours',
        difficulty: 'Hard',
        patterns: ['binary-search-on-answer', 'floating-point-bs', 'complex-predicates'],
        resources: [],
        problems: [],
        completed: false,
        order: 3
      }
    ]
  },
  {
    id: 'graph-algorithms',
    title: 'Graph Theory Deep Dive',
    description: 'From basic DFS/BFS to advanced algorithms like network flows and matching.',
    category: 'community',
    difficulty: 'Advanced',
    estimatedHours: 20,
    tags: ['graphs', 'dfs', 'bfs', 'shortest-path', 'flows'],
    author: 'Tourist',
    createdAt: '2024-01-10',
    isPublic: true,
    enrolledCount: 89,
    rating: 4.9,
    lectures: [
      {
        id: 'graph-basics',
        title: 'Graph Representation & Traversal',
        description: 'Basic graph concepts, adjacency lists, DFS, BFS',
        type: 'video',
        duration: '45 min',
        difficulty: 'Easy',
        patterns: ['graph-representation', 'dfs', 'bfs', 'connected-components'],
        resources: [],
        problems: [],
        completed: false,
        order: 1
      }
    ]
  }
];

export function LearningPaths({ problems, onAddProblem }: LearningPathsProps) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(SAMPLE_LEARNING_PATHS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [activeView, setActiveView] = useState<"browse" | "my-paths" | "create">("browse");
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [createPathOpen, setCreatePathOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // New path creation state
  const [newPath, setNewPath] = useState<Partial<LearningPath>>({
    title: '',
    description: '',
    category: 'personal',
    difficulty: 'Beginner',
    estimatedHours: 1,
    tags: [],
    lectures: []
  });

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || path.category === filterCategory;
    const matchesDifficulty = filterDifficulty === "all" || path.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const myPaths = learningPaths.filter(path => path.category === 'personal');

  const getProgressForPath = (path: LearningPath) => {
    const totalLectures = path.lectures.length;
    const completedLectures = path.lectures.filter(lecture => lecture.completed).length;
    return totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
  };

  const handleCreatePath = () => {
    const newLearningPath: LearningPath = {
      id: `path-${Date.now()}`,
      title: newPath.title || 'Untitled Path',
      description: newPath.description || '',
      category: 'personal',
      difficulty: newPath.difficulty || 'Beginner',
      estimatedHours: newPath.estimatedHours || 1,
      tags: newPath.tags || [],
      author: 'You',
      lectures: [],
      createdAt: new Date().toISOString(),
      isPublic: false
    };

    setLearningPaths(prev => [...prev, newLearningPath]);
    setNewPath({
      title: '',
      description: '',
      category: 'personal',
      difficulty: 'Beginner',
      estimatedHours: 1,
      tags: [],
      lectures: []
    });
    setCreatePathOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'official': return 'bg-catppuccin-blue/20 text-catppuccin-blue border-catppuccin-blue/30';
      case 'community': return 'bg-catppuccin-green/20 text-catppuccin-green border-catppuccin-green/30';
      case 'personal': return 'bg-catppuccin-purple/20 text-catppuccin-purple border-catppuccin-purple/30';
      default: return 'bg-catppuccin-overlay1/20 text-catppuccin-overlay1';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-catppuccin-green/20 text-catppuccin-green border-catppuccin-green/30';
      case 'Intermediate': return 'bg-catppuccin-yellow/20 text-catppuccin-yellow border-catppuccin-yellow/30';
      case 'Advanced': return 'bg-catppuccin-red/20 text-catppuccin-red border-catppuccin-red/30';
      default: return 'bg-catppuccin-overlay1/20 text-catppuccin-overlay1';
    }
  };

  const getLectureTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'practice': return <Code className="h-4 w-4" />;
      case 'notes': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-catppuccin-blue font-mono">
            <BookOpen className="h-6 w-6 inline mr-2" />
            Learning Paths
          </h1>
          <p className="text-catppuccin-overlay1">
            Structured learning from CF lectures, tutorials, and your own study plans
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

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1">
          <TabsTrigger 
            value="browse" 
            className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Paths
          </TabsTrigger>
          <TabsTrigger 
            value="my-paths"
            className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
          >
            <Users className="h-4 w-4 mr-2" />
            My Paths ({myPaths.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
              <Input
                placeholder="Search learning paths, topics, or patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>
            
            <div className="flex space-x-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <Card 
                key={path.id}
                className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer"
                onClick={() => setSelectedPath(path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="font-mono">{path.title}</CardTitle>
                        {path.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-catppuccin-yellow fill-current" />
                            <span className="text-sm text-catppuccin-overlay1">{path.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-catppuccin-overlay1 font-mono">{path.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getCategoryColor(path.category)}>
                          {path.category}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-catppuccin-overlay1 border-catppuccin-surface2">
                          <Clock className="h-3 w-3 mr-1" />
                          {path.estimatedHours}h
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-catppuccin-overlay1">Progress</span>
                      <span className="text-catppuccin-foreground font-mono">
                        {path.lectures.filter(l => l.completed).length}/{path.lectures.length} lectures
                      </span>
                    </div>
                    <Progress value={getProgressForPath(path)} className="h-2" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {path.tags.slice(0, 4).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {path.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">+{path.tags.length - 4}</Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                    <span>by {path.author}</span>
                    {path.enrolledCount && (
                      <span>{path.enrolledCount} enrolled</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-paths" className="space-y-6">
          {myPaths.length === 0 ? (
            <div className="text-center py-12 text-catppuccin-overlay1">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No personal learning paths yet</h3>
              <p className="mb-4">Create your own structured learning paths</p>
              <Button 
                onClick={() => setCreatePathOpen(true)}
                className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Path
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myPaths.map((path) => (
                <Card 
                  key={path.id}
                  className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-purple/50 transition-all cursor-pointer"
                  onClick={() => setSelectedPath(path)}
                >
                  {/* Similar card content as browse tab but with edit options */}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-mono">{path.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-catppuccin-overlay1 font-mono">{path.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getProgressForPath(path)} className="h-2" />
                    <div className="mt-2 text-sm text-catppuccin-overlay1">
                      {path.lectures.filter(l => l.completed).length}/{path.lectures.length} lectures completed
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Path Dialog */}
      <Dialog open={createPathOpen} onOpenChange={setCreatePathOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create Learning Path</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Create a structured learning path for yourself or others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Path Title</Label>
                <Input
                  placeholder="e.g., Advanced Binary Search"
                  value={newPath.title}
                  onChange={(e) => setNewPath(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty</Label>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what this learning path covers..."
                value={newPath.description}
                onChange={(e) => setNewPath(prev => ({ ...prev, description: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 min-h-[80px]"
              />
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
                disabled={!newPath.title}
                className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
              >
                Create Path
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Path Detail Modal */}
      {selectedPath && (
        <Dialog open={!!selectedPath} onOpenChange={() => setSelectedPath(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-catppuccin-blue text-xl">{selectedPath.title}</DialogTitle>
                  <DialogDescription className="text-catppuccin-overlay1 mt-2">
                    {selectedPath.description}
                  </DialogDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedPath.category === 'personal' && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Path Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
                    <div className="font-mono text-sm">{Math.round(getProgressForPath(selectedPath))}%</div>
                    <div className="text-xs text-catppuccin-overlay1">Complete</div>
                  </CardContent>
                </Card>
                <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
                    <div className="font-mono text-sm">{selectedPath.estimatedHours}h</div>
                    <div className="text-xs text-catppuccin-overlay1">Duration</div>
                  </CardContent>
                </Card>
                <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
                    <div className="font-mono text-sm">{selectedPath.lectures.length}</div>
                    <div className="text-xs text-catppuccin-overlay1">Lectures</div>
                  </CardContent>
                </Card>
                <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <CardContent className="p-4 text-center">
                    <Target className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
                    <div className="font-mono text-sm">{selectedPath.difficulty}</div>
                    <div className="text-xs text-catppuccin-overlay1">Level</div>
                  </CardContent>
                </Card>
              </div>

              {/* Lectures List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-catppuccin-blue">Lectures & Content</h3>
                {selectedPath.lectures.map((lecture, index) => (
                  <Card 
                    key={lecture.id}
                    className={`bg-catppuccin-surface1 border-catppuccin-surface2 cursor-pointer transition-all ${
                      lecture.completed ? 'border-catppuccin-green/50' : 'hover:border-catppuccin-blue/50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded ${lecture.completed ? 'bg-catppuccin-green/20' : 'bg-catppuccin-surface2'}`}>
                            {lecture.completed ? 
                              <CheckCircle className="h-4 w-4 text-catppuccin-green" /> :
                              getLectureTypeIcon(lecture.type)
                            }
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{lecture.title}</h4>
                              <Badge variant="outline" className={getDifficultyColor(lecture.difficulty)}>
                                {lecture.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-catppuccin-overlay1 border-catppuccin-surface2">
                                {lecture.duration}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-catppuccin-overlay1 mb-2">{lecture.description}</p>
                            
                            {lecture.patterns.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lecture.patterns.map((pattern) => (
                                  <Badge 
                                    key={pattern} 
                                    variant="secondary" 
                                    className="text-xs bg-catppuccin-blue/20 text-catppuccin-blue border-catppuccin-blue/30"
                                  >
                                    {pattern}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {selectedPath.category === 'personal' && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant={lecture.completed ? "outline" : "default"}
                            size="sm"
                            className={lecture.completed ? 
                              "border-catppuccin-green text-catppuccin-green" :
                              "bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                            }
                          >
                            {lecture.completed ? <CheckCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}