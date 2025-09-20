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
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Star,
  MoreHorizontal,
  Search,
  Filter,
  Brain,
  Code,
  TrendingUp,
  Award,
  Lightbulb,
  Bookmark,
  Eye,
  EyeOff,
  BookOpen,
  Zap,
  Layers,
  GitBranch
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Problem as ApiProblem } from "../utils/api";

interface Pattern {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  problemCount: number;
  solvedCount: number;
  masterLevel: number; // 0-100
  keyInsights: string[];
  implementation: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonMistakes: string[];
  relatedPatterns: string[];
  problemIds: string[];
  examples: PatternExample[];
  isCustom: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  lastPracticed?: string;
}

interface PatternExample {
  problemName: string;
  problemUrl: string;
  difficulty: string;
  explanation: string;
}

interface EnhancedPatternTrackerProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
}

const SAMPLE_PATTERNS: Pattern[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    description: 'Use two pointers moving towards each other or in the same direction to solve array/string problems efficiently',
    category: 'Array/String',
    difficulty: 'Easy',
    tags: ['arrays', 'strings', 'optimization'],
    problemCount: 45,
    solvedCount: 32,
    masterLevel: 71,
    keyInsights: [
      'Reduces O(n²) brute force to O(n) in many cases',
      'Works well with sorted arrays or when you need to find pairs',
      'Can be used for palindrome checking, target sum problems',
      'One pointer at start, one at end, or both moving forward'
    ],
    implementation: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    commonMistakes: [
      'Not handling edge cases (empty array, single element)',
      'Infinite loops when pointers don\'t move correctly',
      'Off-by-one errors with array bounds'
    ],
    relatedPatterns: ['sliding-window', 'binary-search'],
    problemIds: ['two-sum-ii', 'container-water', 'valid-palindrome'],
    examples: [
      {
        problemName: 'Two Sum II - Input array is sorted',
        problemUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        difficulty: 'Medium',
        explanation: 'Classic two pointers: start from both ends, move based on sum comparison'
      },
      {
        problemName: 'Container With Most Water',
        problemUrl: 'https://leetcode.com/problems/container-with-most-water/',
        difficulty: 'Medium',
        explanation: 'Two pointers to find maximum area, always move the pointer with smaller height'
      }
    ],
    isCustom: false,
    isFavorite: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastPracticed: '2024-01-18T09:00:00Z'
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    description: 'Maintain a window of elements and slide it through the array to find optimal subarray/substring',
    category: 'Array/String',
    difficulty: 'Medium',
    tags: ['arrays', 'strings', 'optimization', 'subarray'],
    problemCount: 38,
    solvedCount: 24,
    masterLevel: 63,
    keyInsights: [
      'Converts O(n²) or O(n³) brute force to O(n)',
      'Fixed size window vs variable size window',
      'Track window state with hash map or counters',
      'Expand window to include new elements, shrink to maintain validity'
    ],
    implementation: `def max_subarray_sum_k(arr, k):
    if len(arr) < k:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i-k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) to O(k)',
    commonMistakes: [
      'Not properly maintaining window invariants',
      'Forgetting to update window state when sliding',
      'Incorrect shrinking logic for variable windows'
    ],
    relatedPatterns: ['two-pointers', 'hash-table'],
    problemIds: ['min-window-substring', 'longest-substring-k-distinct'],
    examples: [
      {
        problemName: 'Minimum Window Substring',
        problemUrl: 'https://leetcode.com/problems/minimum-window-substring/',
        difficulty: 'Hard',
        explanation: 'Variable sliding window: expand to include all characters, shrink to find minimum'
      }
    ],
    isCustom: false,
    isFavorite: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
    lastPracticed: '2024-01-17T11:00:00Z'
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'Divide and conquer approach to search in sorted space or find optimal value',
    category: 'Search',
    difficulty: 'Medium',
    tags: ['search', 'divide-conquer', 'optimization'],
    problemCount: 52,
    solvedCount: 41,
    masterLevel: 79,
    keyInsights: [
      'Works on any monotonic function, not just sorted arrays',
      'Template: left ≤ right vs left < right affects loop termination',
      'Can be applied to optimization problems (binary search on answer)',
      'Always check if search space is properly defined'
    ],
    implementation: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    commonMistakes: [
      'Integer overflow in mid calculation (use left + (right - left) // 2)',
      'Infinite loops due to incorrect boundary updates',
      'Wrong loop condition (≤ vs <)'
    ],
    relatedPatterns: ['two-pointers', 'divide-conquer'],
    problemIds: ['search-insert-position', 'find-peak-element'],
    examples: [
      {
        problemName: 'Search in Rotated Sorted Array',
        problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        difficulty: 'Medium',
        explanation: 'Modified binary search: determine which half is sorted, then search accordingly'
      }
    ],
    isCustom: false,
    isFavorite: false,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    lastPracticed: '2024-01-16T15:00:00Z'
  },
  {
    id: 'custom-pattern',
    name: 'My Custom DP Pattern',
    description: 'A custom pattern I developed for handling specific DP optimization problems',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    tags: ['dp', 'optimization', 'custom'],
    problemCount: 8,
    solvedCount: 6,
    masterLevel: 75,
    keyInsights: [
      'Combines state compression with memoization',
      'Works well for problems with overlapping subproblems'
    ],
    implementation: `// My custom implementation
def solve_custom_dp(arr):
    # Custom logic here
    pass`,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    commonMistakes: ['State space too large'],
    relatedPatterns: ['standard-dp'],
    problemIds: ['my-custom-problem'],
    examples: [],
    isCustom: true,
    isFavorite: true,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

export function EnhancedPatternTracker({ problems, onAddProblem }: EnhancedPatternTrackerProps) {
  const [patterns, setPatterns] = useState<Pattern[]>(SAMPLE_PATTERNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterMastery, setFilterMastery] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("mastery");
  const [showDetails, setShowDetails] = useState(true);
  
  // Dialog states
  const [createPatternOpen, setCreatePatternOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [patternToDelete, setPatternToDelete] = useState<string | null>(null);

  // New pattern form
  const [newPattern, setNewPattern] = useState<Partial<Pattern>>({
    name: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    tags: [],
    keyInsights: [],
    implementation: '',
    timeComplexity: '',
    spaceComplexity: '',
    commonMistakes: [],
    relatedPatterns: [],
    examples: []
  });

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || pattern.category === filterCategory;
    const matchesDifficulty = filterDifficulty === "all" || pattern.difficulty === filterDifficulty;
    
    let matchesMastery = true;
    if (filterMastery === "mastered") matchesMastery = pattern.masterLevel >= 80;
    else if (filterMastery === "learning") matchesMastery = pattern.masterLevel >= 40 && pattern.masterLevel < 80;
    else if (filterMastery === "beginner") matchesMastery = pattern.masterLevel < 40;
    else if (filterMastery === "favorites") matchesMastery = pattern.isFavorite;
    else if (filterMastery === "custom") matchesMastery = pattern.isCustom;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesMastery;
  });

  const sortedPatterns = [...filteredPatterns].sort((a, b) => {
    switch (sortBy) {
      case "mastery":
        return b.masterLevel - a.masterLevel;
      case "problems":
        return b.problemCount - a.problemCount;
      case "difficulty":
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "recent":
        return new Date(b.lastPracticed || b.updatedAt).getTime() - new Date(a.lastPracticed || a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  const categories = [...new Set(patterns.map(p => p.category))];

  const handleCreatePattern = () => {
    const pattern: Pattern = {
      id: `pattern-${Date.now()}`,
      name: newPattern.name || 'Untitled Pattern',
      description: newPattern.description || '',
      category: newPattern.category || 'Custom',
      difficulty: newPattern.difficulty || 'Medium',
      tags: newPattern.tags || [],
      problemCount: 0,
      solvedCount: 0,
      masterLevel: 0,
      keyInsights: newPattern.keyInsights || [],
      implementation: newPattern.implementation || '',
      timeComplexity: newPattern.timeComplexity || '',
      spaceComplexity: newPattern.spaceComplexity || '',
      commonMistakes: newPattern.commonMistakes || [],
      relatedPatterns: newPattern.relatedPatterns || [],
      problemIds: [],
      examples: newPattern.examples || [],
      isCustom: true,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatterns(prev => [pattern, ...prev]);
    setNewPattern({
      name: '',
      description: '',
      category: '',
      difficulty: 'Medium',
      tags: [],
      keyInsights: [],
      implementation: '',
      timeComplexity: '',
      spaceComplexity: '',
      commonMistakes: [],
      relatedPatterns: [],
      examples: []
    });
    setCreatePatternOpen(false);
    toast.success("Pattern created successfully!");
  };

  const handleUpdatePattern = (patternId: string, updates: Partial<Pattern>) => {
    setPatterns(prev => prev.map(pattern => 
      pattern.id === patternId 
        ? { ...pattern, ...updates, updatedAt: new Date().toISOString() } 
        : pattern
    ));
    toast.success("Pattern updated successfully!");
  };

  const handleDeletePattern = (patternId: string) => {
    setPatterns(prev => prev.filter(pattern => pattern.id !== patternId));
    setDeleteConfirmOpen(false);
    setPatternToDelete(null);
    toast.success("Pattern deleted successfully!");
  };

  const handleToggleFavorite = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    handleUpdatePattern(patternId, { isFavorite: !pattern?.isFavorite });
  };

  const handlePracticePattern = (patternId: string) => {
    handleUpdatePattern(patternId, { lastPracticed: new Date().toISOString() });
    toast.success("Pattern practice recorded!");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'Medium': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'Hard': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-catppuccin-green';
    if (level >= 60) return 'text-catppuccin-yellow';
    if (level >= 40) return 'text-catppuccin-purple';
    return 'text-catppuccin-red';
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return 'Mastered';
    if (level >= 60) return 'Proficient';
    if (level >= 40) return 'Learning';
    return 'Beginner';
  };

  const stats = {
    total: patterns.length,
    mastered: patterns.filter(p => p.masterLevel >= 80).length,
    learning: patterns.filter(p => p.masterLevel >= 40 && p.masterLevel < 80).length,
    beginner: patterns.filter(p => p.masterLevel < 40).length,
    custom: patterns.filter(p => p.isCustom).length,
    favorites: patterns.filter(p => p.isFavorite).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <Target className="h-6 w-6 inline mr-2" />
            Pattern Mastery Tracker
          </h1>
          <p className="text-catppuccin-overlay1">
            Track and master algorithmic patterns for competitive programming
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={() => setCreatePatternOpen(true)}
            className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pattern
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-blue">{stats.total}</div>
            <div className="text-xs text-catppuccin-overlay1">Total Patterns</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Award className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-green">{stats.mastered}</div>
            <div className="text-xs text-catppuccin-overlay1">Mastered</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-yellow">{stats.learning}</div>
            <div className="text-xs text-catppuccin-overlay1">Learning</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-purple">{stats.beginner}</div>
            <div className="text-xs text-catppuccin-overlay1">Beginner</div>
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
            <Brain className="h-5 w-5 text-catppuccin-teal mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-teal">{stats.custom}</div>
            <div className="text-xs text-catppuccin-overlay1">Custom</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
          <Input
            placeholder="Search patterns, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
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

          <Select value={filterMastery} onValueChange={setFilterMastery}>
            <SelectTrigger className="w-36 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Mastery</SelectItem>
              <SelectItem value="mastered">Mastered</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="mastery">Mastery</SelectItem>
              <SelectItem value="problems">Problems</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Patterns Grid */}
      <div className={
        showDetails 
          ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
          : "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      }>
        {sortedPatterns.length === 0 ? (
          <div className="col-span-full text-center py-12 text-catppuccin-overlay1">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No patterns found</h3>
            <p className="mb-4">Try adjusting your search or filters</p>
            <Button 
              onClick={() => setCreatePatternOpen(true)}
              className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Pattern
            </Button>
          </div>
        ) : (
          sortedPatterns.map((pattern) => (
            <Card 
              key={pattern.id}
              className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="font-mono text-base truncate">{pattern.name}</CardTitle>
                      {pattern.isFavorite && <Star className="h-4 w-4 text-catppuccin-yellow flex-shrink-0" />}
                      {pattern.isCustom && <Brain className="h-4 w-4 text-catppuccin-purple flex-shrink-0" />}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge className={getDifficultyColor(pattern.difficulty)}>
                        {pattern.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-catppuccin-overlay1 border-catppuccin-surface2">
                        {pattern.category}
                      </Badge>
                      <Badge className={`${getMasteryColor(pattern.masterLevel)} border-current bg-current/10`}>
                        {getMasteryLabel(pattern.masterLevel)}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
                      <DropdownMenuItem onClick={() => setSelectedPattern(pattern)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(pattern.id)}>
                        <Star className={`h-4 w-4 mr-2 ${pattern.isFavorite ? 'text-catppuccin-yellow' : ''}`} />
                        {pattern.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePracticePattern(pattern.id)}>
                        <Zap className="h-4 w-4 mr-2" />
                        Mark as Practiced
                      </DropdownMenuItem>
                      {pattern.isCustom && (
                        <>
                          <DropdownMenuItem onClick={() => setEditingPattern(pattern)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Pattern
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setPatternToDelete(pattern.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-catppuccin-red hover:bg-catppuccin-red/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Pattern
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-catppuccin-overlay1 line-clamp-2">
                  {pattern.description}
                </p>

                {/* Mastery Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-catppuccin-overlay1">Mastery Level</span>
                    <span className={getMasteryColor(pattern.masterLevel)}>{pattern.masterLevel}%</span>
                  </div>
                  <Progress value={pattern.masterLevel} className="h-2" />
                </div>

                {/* Problem Stats */}
                <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Code className="h-3 w-3" />
                      <span>{pattern.solvedCount}/{pattern.problemCount}</span>
                    </div>
                    {pattern.lastPracticed && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>{new Date(pattern.lastPracticed).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => setSelectedPattern(pattern)}
                    className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0 h-6 px-2 text-xs"
                  >
                    Study
                  </Button>
                </div>

                {showDetails && (
                  <>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {pattern.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-catppuccin-surface2">
                          {tag}
                        </Badge>
                      ))}
                      {pattern.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{pattern.tags.length - 3}</Badge>
                      )}
                    </div>

                    {/* Complexity */}
                    {(pattern.timeComplexity || pattern.spaceComplexity) && (
                      <div className="text-xs space-y-1">
                        {pattern.timeComplexity && (
                          <div className="text-catppuccin-overlay1">
                            Time: <code className="bg-catppuccin-surface1 px-1 rounded">{pattern.timeComplexity}</code>
                          </div>
                        )}
                        {pattern.spaceComplexity && (
                          <div className="text-catppuccin-overlay1">
                            Space: <code className="bg-catppuccin-surface1 px-1 rounded">{pattern.spaceComplexity}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Pattern Dialog */}
      <Dialog open={createPatternOpen} onOpenChange={setCreatePatternOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create Custom Pattern</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Add your own algorithmic pattern to track and master
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Pattern Name</label>
                <Input
                  placeholder="Enter pattern name..."
                  value={newPattern.name}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Difficulty</label>
                <Select 
                  value={newPattern.difficulty} 
                  onValueChange={(value: any) => setNewPattern(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-catppuccin-overlay1">Description</label>
              <Textarea
                placeholder="Describe the pattern and when to use it..."
                value={newPattern.description}
                onChange={(e) => setNewPattern(prev => ({ ...prev, description: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Category</label>
                <Input
                  placeholder="e.g., Array/String, Graph Theory"
                  value={newPattern.category}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-catppuccin-overlay1">Time Complexity</label>
                <Input
                  placeholder="e.g., O(n), O(log n)"
                  value={newPattern.timeComplexity}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, timeComplexity: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-catppuccin-overlay1">Implementation</label>
              <Textarea
                placeholder="Add your implementation code here..."
                value={newPattern.implementation}
                onChange={(e) => setNewPattern(prev => ({ ...prev, implementation: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 font-mono"
                rows={6}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCreatePatternOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePattern}
              disabled={!newPattern.name || !newPattern.description}
              className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
            >
              Create Pattern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-red">Delete Pattern</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Are you sure you want to delete this pattern? This action cannot be undone.
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
              onClick={() => patternToDelete && handleDeletePattern(patternToDelete)}
              className="bg-catppuccin-red hover:bg-catppuccin-red/80 text-catppuccin-surface0"
            >
              Delete Pattern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pattern Detail Dialog */}
      {selectedPattern && (
        <Dialog open={!!selectedPattern} onOpenChange={() => setSelectedPattern(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-catppuccin-blue text-xl flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>{selectedPattern.name}</span>
                {selectedPattern.isFavorite && <Star className="h-4 w-4 text-catppuccin-yellow" />}
              </DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getDifficultyColor(selectedPattern.difficulty)}>
                  {selectedPattern.difficulty}
                </Badge>
                <Badge variant="outline">{selectedPattern.category}</Badge>
                <Badge className={`${getMasteryColor(selectedPattern.masterLevel)} border-current bg-current/10`}>
                  {getMasteryLabel(selectedPattern.masterLevel)} ({selectedPattern.masterLevel}%)
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-catppuccin-foreground mb-2">Description</h3>
                <p className="text-catppuccin-overlay1">{selectedPattern.description}</p>
              </div>

              {selectedPattern.keyInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-catppuccin-foreground mb-2">Key Insights</h3>
                  <ul className="space-y-1">
                    {selectedPattern.keyInsights.map((insight, index) => (
                      <li key={index} className="text-catppuccin-overlay1 flex items-start space-x-2">
                        <span className="text-catppuccin-blue mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPattern.implementation && (
                <div>
                  <h3 className="font-semibold text-catppuccin-foreground mb-2">Implementation</h3>
                  <pre className="bg-catppuccin-surface1 p-4 rounded overflow-x-auto text-sm">
                    <code className="text-catppuccin-green">{selectedPattern.implementation}</code>
                  </pre>
                </div>
              )}

              {(selectedPattern.timeComplexity || selectedPattern.spaceComplexity) && (
                <div>
                  <h3 className="font-semibold text-catppuccin-foreground mb-2">Complexity</h3>
                  <div className="space-y-1">
                    {selectedPattern.timeComplexity && (
                      <div className="text-catppuccin-overlay1">
                        <strong>Time:</strong> <code className="bg-catppuccin-surface1 px-2 py-1 rounded">{selectedPattern.timeComplexity}</code>
                      </div>
                    )}
                    {selectedPattern.spaceComplexity && (
                      <div className="text-catppuccin-overlay1">
                        <strong>Space:</strong> <code className="bg-catppuccin-surface1 px-2 py-1 rounded">{selectedPattern.spaceComplexity}</code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedPattern.examples.length > 0 && (
                <div>
                  <h3 className="font-semibold text-catppuccin-foreground mb-2">Example Problems</h3>
                  <div className="space-y-2">
                    {selectedPattern.examples.map((example, index) => (
                      <div key={index} className="p-3 rounded border border-catppuccin-surface2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-catppuccin-foreground">{example.problemName}</h4>
                          <Badge className={getDifficultyColor(example.difficulty)}>
                            {example.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-catppuccin-overlay1 mb-2">{example.explanation}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(example.problemUrl, '_blank')}
                          className="border-catppuccin-surface2 hover:bg-catppuccin-surface1 text-xs"
                        >
                          View Problem
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleToggleFavorite(selectedPattern.id)}
                  className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                >
                  <Star className={`h-4 w-4 mr-2 ${selectedPattern.isFavorite ? 'text-catppuccin-yellow' : ''}`} />
                  {selectedPattern.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                </Button>
                <Button
                  onClick={() => {
                    handlePracticePattern(selectedPattern.id);
                    setSelectedPattern(null);
                  }}
                  className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Mark as Practiced
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}