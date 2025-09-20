import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MarkdownEditor } from "./markdown-editor";
import { 
  FileText, 
  Plus, 
  Edit, 
  Save, 
  Code, 
  Lightbulb, 
  BookOpen,
  Video,
  Link,
  Search,
  Filter,
  Star,
  Calendar,
  Tag,
  Eye,
  Copy,
  X,
  Trash2,
  Share,
  Download,
  Upload,
  Clock,
  TrendingUp,
  Grid,
  List as ListIcon,
  Maximize2,
  Archive,
  Pin,
  Users,
  Globe,
  Lock
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface EnhancedCustomContentProps {
  onAddProblem: () => void;
}

export interface CustomNote {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code' | 'explanation' | 'template' | 'cheatsheet' | 'journal' | 'analysis';
  category: string;
  tags: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  lastViewedAt?: string;
  estimatedReadTime: number; // in minutes
  linkedProblems: string[]; // problem IDs
  collaborators: string[];
}

const SAMPLE_NOTES: CustomNote[] = [
  {
    id: 'welcome-note',
    title: 'Welcome to Your Knowledge Base',
    content: `# Welcome to CodeTrac Knowledge Base! 🚀

This is your personal space to document insights, create templates, and build your competitive programming knowledge.

## What you can do here:

### 📝 **Note Types**
- **Notes**: Personal insights and observations
- **Code**: Reusable code snippets and templates
- **Templates**: Structured formats for problem analysis
- **Cheatsheets**: Quick reference materials
- **Analysis**: Deep dives into problem solutions
- **Journal**: Contest experiences and reflections

### 🔧 **Features**
- Rich markdown editor with live preview
- Syntax highlighting for code blocks
- Customizable templates
- Advanced search and filtering
- Problem linking and cross-references
- Public sharing capabilities

### 💡 **Pro Tips**
1. Use the template system to standardize your problem analysis
2. Tag your notes for easy discovery
3. Link notes to specific problems for context
4. Share your insights with the community

---

*Get started by creating your first note or exploring the templates!*`,
    type: 'note',
    category: 'Getting Started',
    tags: ['welcome', 'guide', 'tutorial'],
    isFavorite: false,
    isPinned: true,
    isArchived: false,
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    estimatedReadTime: 2,
    linkedProblems: [],
    collaborators: []
  },
  {
    id: 'dp-patterns-guide',
    title: 'Dynamic Programming Patterns Masterclass',
    content: `# Dynamic Programming Patterns 🧠

## 1. Linear DP
**Pattern**: \`dp[i] = f(dp[i-1], dp[i-2], ...)\`

### When to use:
- Single parameter varies (usually index or position)
- Subproblems have optimal substructure
- Examples: Fibonacci, House Robber, Climbing Stairs

### Template:
\`\`\`cpp
// Bottom-up approach
vector<int> dp(n + 1);
dp[0] = base_case;
for (int i = 1; i <= n; i++) {
    dp[i] = /* recurrence relation */;
}
return dp[n];
\`\`\`

## 2. 2D DP (Grid/Two Sequences)
**Pattern**: \`dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)\`

### Common variants:
- **Grid traversal**: Unique paths, minimum path sum
- **Two sequences**: LCS, Edit Distance, LIS variations

### Template:
\`\`\`cpp
vector<vector<int>> dp(m, vector<int>(n));
// Initialize base cases
for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
        dp[i][j] = /* recurrence */;
    }
}
\`\`\`

## 3. Knapsack Family
### 0/1 Knapsack:
\`\`\`cpp
for (int i = 1; i <= n; i++) {
    for (int w = W; w >= weight[i]; w--) {
        dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);
    }
}
\`\`\`

### Unbounded Knapsack:
\`\`\`cpp
for (int i = 1; i <= n; i++) {
    for (int w = weight[i]; w <= W; w++) {
        dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);
    }
}
\`\`\`

## 4. Interval DP
**Pattern**: \`dp[i][j] = min/max over k (dp[i][k] + dp[k+1][j] + cost)\`

### Examples:
- Matrix Chain Multiplication
- Palindrome Partitioning
- Burst Balloons

## Key Insights 💡
1. **State Definition**: What does dp[i] represent?
2. **Recurrence**: How to build solution from subproblems?
3. **Base Cases**: What are the trivial cases?
4. **Order**: Bottom-up vs top-down considerations
5. **Optimization**: Space optimization opportunities

---
*Practice these patterns consistently to build intuition!*`,
    type: 'cheatsheet',
    category: 'Dynamic Programming',
    tags: ['dp', 'patterns', 'algorithms', 'reference'],
    difficulty: 'Medium',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    viewCount: 45,
    estimatedReadTime: 8,
    linkedProblems: [],
    collaborators: []
  },
  {
    id: 'contest-reflection',
    title: 'Codeforces Round #912 - Reflection',
    content: `# CF Round #912 Performance Analysis 📊

**Date**: January 20, 2024  
**Rank**: 1247 / 15,432  
**Rating Change**: +23 (1534 → 1557)  
**Problems Solved**: 3/6 (A, B, C)

## Problem A: Simple Math (800)
**Time**: 8 minutes  
**Attempts**: 1  
**Status**: ✅ AC

### What went well:
- Quick pattern recognition
- Clean implementation on first try
- Good time management

### Approach:
Simple mathematical observation that the answer is always \`ceil(n/2)\`

## Problem B: Array Manipulation (1100)  
**Time**: 23 minutes  
**Attempts**: 2 (1 WA)  
**Status**: ✅ AC

### What went wrong:
- Missed edge case for n=1
- Overthought the solution initially

### Learning:
Always check edge cases before submitting, especially for small inputs.

## Problem C: Graph Connectivity (1400)
**Time**: 45 minutes  
**Attempts**: 3 (2 WA, 1 TLE)  
**Status**: ✅ AC

### Struggles:
1. **Wrong Algorithm**: Started with DFS, got TLE
2. **Implementation Bug**: Off-by-one error in Union-Find
3. **Final Solution**: Optimized Union-Find with path compression

### Code:
\`\`\`cpp
class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
    
    bool unite(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return false;
        if (rank[x] < rank[y]) swap(x, y);
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
        return true;
    }
};
\`\`\`

## Problems D-F: Didn't Attempt
**Reason**: Spent too much time on C, ran out of time

## Overall Reflection 🤔

### Positives:
- Good start with A and B
- Eventually solved C despite struggles
- Positive rating change

### Areas for Improvement:
1. **Time Management**: Don't spend 45 minutes on one problem
2. **Testing**: More thorough testing before submission
3. **Algorithm Selection**: Should have gone with Union-Find from the start

### Action Items:
- [ ] Practice more Union-Find problems
- [ ] Set time limits for each problem during contests
- [ ] Review graph connectivity patterns

**Next Contest Goal**: Solve 4 problems within time limit`,
    type: 'journal',
    category: 'Contest Analysis',
    tags: ['codeforces', 'contest', 'reflection', 'analysis'],
    difficulty: 'Medium',
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isPublic: false,
    createdAt: '2024-01-20T18:30:00Z',
    updatedAt: '2024-01-20T19:15:00Z',
    viewCount: 12,
    estimatedReadTime: 5,
    linkedProblems: ['cf-912-a', 'cf-912-b', 'cf-912-c'],
    collaborators: []
  }
];

export function EnhancedCustomContent({ onAddProblem }: EnhancedCustomContentProps) {
  const [notes, setNotes] = useState<CustomNote[]>(SAMPLE_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all"); // all, favorites, pinned, archived
  const [sortBy, setSortBy] = useState<string>("updated"); // updated, created, title, views
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CustomNote | null>(null);
  const [editingNote, setEditingNote] = useState<CustomNote | null>(null);
  const [fullscreenEditor, setFullscreenEditor] = useState(false);

  // New note creation state
  const [newNote, setNewNote] = useState<Partial<CustomNote>>({
    title: '',
    content: '',
    type: 'note',
    category: '',
    tags: [],
    difficulty: undefined,
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isPublic: false
  });
  const [newTag, setNewTag] = useState("");

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         note.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || note.type === filterType;
    const matchesCategory = filterCategory === "all" || note.category === filterCategory;
    
    let matchesStatus = true;
    if (filterStatus === "favorites") matchesStatus = note.isFavorite;
    else if (filterStatus === "pinned") matchesStatus = note.isPinned;
    else if (filterStatus === "archived") matchesStatus = note.isArchived;
    else if (filterStatus === "public") matchesStatus = note.isPublic;
    else if (filterStatus === "recent") matchesStatus = !note.isArchived && new Date(note.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Pinned notes always come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case "updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "views":
        return b.viewCount - a.viewCount;
      case "readTime":
        return a.estimatedReadTime - b.estimatedReadTime;
      default:
        return 0;
    }
  });

  const categories = [...new Set(notes.map(note => note.category))];
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const handleCreateNote = () => {
    const note: CustomNote = {
      id: `note-${Date.now()}`,
      title: newNote.title || 'Untitled Note',
      content: newNote.content || '',
      type: newNote.type || 'note',
      category: newNote.category || 'General',
      tags: newNote.tags || [],
      difficulty: newNote.difficulty,
      isFavorite: newNote.isFavorite || false,
      isPinned: newNote.isPinned || false,
      isArchived: false,
      isPublic: newNote.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      estimatedReadTime: Math.max(1, Math.ceil((newNote.content || '').split(' ').length / 200)),
      linkedProblems: [],
      collaborators: []
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({
      title: '',
      content: '',
      type: 'note',
      category: '',
      tags: [],
      difficulty: undefined,
      isFavorite: false,
      isPinned: false,
      isArchived: false,
      isPublic: false
    });
    setCreateNoteOpen(false);
    toast.success("Note created successfully!");
  };

  const handleUpdateNote = (noteId: string, updates: Partial<CustomNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            estimatedReadTime: updates.content ? Math.max(1, Math.ceil(updates.content.split(' ').length / 200)) : note.estimatedReadTime
          } 
        : note
    ));
    toast.success("Note updated successfully!");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success("Note deleted successfully!");
  };

  const handleViewNote = (note: CustomNote) => {
    // Increment view count
    handleUpdateNote(note.id, { 
      viewCount: note.viewCount + 1,
      lastViewedAt: new Date().toISOString()
    });
    setSelectedNote(note);
  };

  const toggleNoteProperty = (noteId: string, property: 'isFavorite' | 'isPinned' | 'isArchived' | 'isPublic') => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      handleUpdateNote(noteId, { [property]: !note[property] });
    }
  };

  const handleAddTag = () => {
    if (newTag && newNote.tags && !newNote.tags.includes(newTag)) {
      setNewNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="h-4 w-4" />;
      case 'explanation': return <Lightbulb className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      case 'cheatsheet': return <BookOpen className="h-4 w-4" />;
      case 'journal': return <Calendar className="h-4 w-4" />;
      case 'analysis': return <TrendingUp className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'code': return 'text-catppuccin-blue border-catppuccin-blue bg-catppuccin-blue/10';
      case 'explanation': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'template': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'cheatsheet': return 'text-catppuccin-purple border-catppuccin-purple bg-catppuccin-purple/10';
      case 'journal': return 'text-catppuccin-pink border-catppuccin-pink bg-catppuccin-pink/10';
      case 'analysis': return 'text-catppuccin-teal border-catppuccin-teal bg-catppuccin-teal/10';
      case 'note': return 'text-catppuccin-overlay1 border-catppuccin-surface2 bg-catppuccin-surface1/20';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const stats = useMemo(() => {
    const total = notes.length;
    const favorites = notes.filter(n => n.isFavorite).length;
    const pinned = notes.filter(n => n.isPinned).length;
    const archived = notes.filter(n => n.isArchived).length;
    const publicNotes = notes.filter(n => n.isPublic).length;
    const totalViews = notes.reduce((sum, n) => sum + n.viewCount, 0);
    const avgReadTime = notes.reduce((sum, n) => sum + n.estimatedReadTime, 0) / (total || 1);
    
    return { total, favorites, pinned, archived, publicNotes, totalViews, avgReadTime: Math.round(avgReadTime) };
  }, [notes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <FileText className="h-6 w-6 inline mr-2" />
            Knowledge Base
          </h1>
          <p className="text-catppuccin-overlay1">
            Your personal collection of notes, insights, and learning materials
          </p>
        </div>
        <Button 
          onClick={() => setCreateNoteOpen(true)}
          className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-blue">{stats.total}</div>
            <div className="text-xs text-catppuccin-overlay1">Total Notes</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-yellow">{stats.favorites}</div>
            <div className="text-xs text-catppuccin-overlay1">Favorites</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Pin className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-green">{stats.pinned}</div>
            <div className="text-xs text-catppuccin-overlay1">Pinned</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-purple">{stats.totalViews}</div>
            <div className="text-xs text-catppuccin-overlay1">Total Views</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Globe className="h-5 w-5 text-catppuccin-teal mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-teal">{stats.publicNotes}</div>
            <div className="text-xs text-catppuccin-overlay1">Public</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-catppuccin-pink mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-pink">{stats.avgReadTime}m</div>
            <div className="text-xs text-catppuccin-overlay1">Avg Read</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Archive className="h-5 w-5 text-catppuccin-overlay1 mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-overlay1">{stats.archived}</div>
            <div className="text-xs text-catppuccin-overlay1">Archived</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
          <Input
            placeholder="Search notes, content, tags, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="cheatsheet">Cheatsheets</SelectItem>
              <SelectItem value="journal">Journal</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="explanation">Explanations</SelectItem>
            </SelectContent>
          </Select>

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

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="pinned">Pinned</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="readTime">Read Time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
          >
            {viewMode === "grid" ? <ListIcon className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-catppuccin-overlay1">
            {notes.length === 0 ? (
              <>
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Start your knowledge base</h3>
                <p className="mb-4">Create your first note to begin documenting your learning journey</p>
                <Button 
                  onClick={() => setCreateNoteOpen(true)}
                  className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Note
                </Button>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p>Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          sortedNotes.map((note) => (
            <Card 
              key={note.id}
              className={`bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer ${
                note.isPinned ? 'ring-1 ring-catppuccin-yellow/30' : ''
              } ${note.isArchived ? 'opacity-75' : ''}`}
              onClick={() => handleViewNote(note)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(note.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="font-mono text-base truncate flex-1">{note.title}</CardTitle>
                        {note.isPinned && <Pin className="h-3 w-3 text-catppuccin-yellow flex-shrink-0" />}
                        {note.isPublic && <Globe className="h-3 w-3 text-catppuccin-teal flex-shrink-0" />}
                        {note.isArchived && <Archive className="h-3 w-3 text-catppuccin-overlay1 flex-shrink-0" />}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="outline" className={`text-xs ${getTypeColor(note.type)}`}>
                          {note.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2">
                          {note.category}
                        </Badge>
                        {note.difficulty && (
                          <Badge variant="outline" className="text-xs text-catppuccin-overlay1 border-catppuccin-surface2">
                            {note.difficulty}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs text-catppuccin-overlay1 border-catppuccin-surface2">
                          <Clock className="h-2 w-2 mr-1" />
                          {note.estimatedReadTime}m
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteProperty(note.id, 'isFavorite');
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Star className={`h-3 w-3 ${note.isFavorite ? 'text-catppuccin-yellow fill-current' : 'text-catppuccin-overlay1'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNote(note);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3 text-catppuccin-overlay1" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Content Preview */}
                <p className="text-sm text-catppuccin-overlay1 line-clamp-3">
                  {note.content.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{note.tags.length - 3}</Badge>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{note.viewCount}</span>
                    </div>
                  </div>
                  {note.linkedProblems.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {note.linkedProblems.length} linked
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={createNoteOpen} onOpenChange={setCreateNoteOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create New Note</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Add your insights, code snippets, or learning materials
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={newNote.type} 
                  onValueChange={(value: any) => setNewNote(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="note">Personal Note</SelectItem>
                    <SelectItem value="code">Code Snippet</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="cheatsheet">Cheatsheet</SelectItem>
                    <SelectItem value="journal">Contest Journal</SelectItem>
                    <SelectItem value="analysis">Problem Analysis</SelectItem>
                    <SelectItem value="explanation">Explanation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="e.g., Dynamic Programming, Contest Analysis"
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty (Optional)</Label>
                <Select 
                  value={newNote.difficulty || ""} 
                  onValueChange={(value: any) => setNewNote(prev => ({ ...prev, difficulty: value || undefined }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
                <Button
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(newNote.tags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-catppuccin-surface1 text-catppuccin-overlay2">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNote.isPinned || false}
                  onChange={(e) => setNewNote(prev => ({ ...prev, isPinned: e.target.checked }))}
                  className="rounded border-catppuccin-surface2"
                />
                <span className="text-sm text-catppuccin-overlay1">Pin this note</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNote.isPublic || false}
                  onChange={(e) => setNewNote(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-catppuccin-surface2"
                />
                <span className="text-sm text-catppuccin-overlay1">Make public</span>
              </label>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Content</Label>
              <MarkdownEditor
                value={newNote.content || ''}
                onChange={(content) => setNewNote(prev => ({ ...prev, content }))}
                placeholder="Start writing your note... (Supports Markdown)"
                showToolbar={true}
                showPreview={true}
                minHeight="300px"
                maxHeight="500px"
                isFullscreen={fullscreenEditor}
                onToggleFullscreen={() => setFullscreenEditor(!fullscreenEditor)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCreateNoteOpen(false)}
                className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNote}
                disabled={!newNote.title || !newNote.content}
                className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Note Dialog */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-catppuccin-blue text-xl flex items-center space-x-2">
                    {getTypeIcon(selectedNote.type)}
                    <span>{selectedNote.title}</span>
                    {selectedNote.isPinned && <Pin className="h-4 w-4 text-catppuccin-yellow" />}
                  </DialogTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTypeColor(selectedNote.type)}>
                      {selectedNote.type}
                    </Badge>
                    <Badge variant="outline" className="text-catppuccin-overlay1 border-catppuccin-surface2">
                      {selectedNote.category}
                    </Badge>
                    {selectedNote.difficulty && (
                      <Badge variant="outline">{selectedNote.difficulty}</Badge>
                    )}
                    <Badge variant="outline" className="text-catppuccin-overlay1">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedNote.estimatedReadTime}m read
                    </Badge>
                    {selectedNote.isPublic && (
                      <Badge variant="outline" className="text-catppuccin-teal border-catppuccin-teal">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNoteProperty(selectedNote.id, 'isFavorite')}
                  >
                    <Star className={`h-4 w-4 ${selectedNote.isFavorite ? 'text-catppuccin-yellow fill-current' : 'text-catppuccin-overlay1'}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingNote(selectedNote);
                      setSelectedNote(null);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Content */}
              <div className="bg-catppuccin-surface1 p-4 rounded border border-catppuccin-surface2">
                <div 
                  className="prose prose-invert max-w-none font-mono text-sm text-catppuccin-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedNote.content
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-2 text-catppuccin-blue">$1</h3>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-catppuccin-green">$1</h2>')
                      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-catppuccin-yellow">$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-catppuccin-blue">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic text-catppuccin-purple">$1</em>')
                      .replace(/`(.*?)`/g, '<code class="bg-catppuccin-surface0 px-1 py-0.5 rounded text-catppuccin-pink font-mono text-sm">$1</code>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-catppuccin-blue hover:text-catppuccin-purple underline">$1</a>')
                      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-catppuccin-blue pl-4 py-2 bg-catppuccin-surface0 rounded-r text-catppuccin-overlay2">$1</blockquote>')
                      .replace(/^- (.*$)/gm, '<li class="list-disc ml-4 mb-1 text-catppuccin-foreground">$1</li>')
                      .replace(/^\d+\. (.*$)/gm, '<li class="list-decimal ml-4 mb-1 text-catppuccin-foreground">$1</li>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-catppuccin-surface0 p-4 rounded mt-2 mb-2 overflow-x-auto"><code class="text-catppuccin-green font-mono text-sm">$2</code></pre>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </div>

              {/* Tags */}
              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-catppuccin-surface2 text-catppuccin-overlay2">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-catppuccin-overlay1 pt-4 border-t border-catppuccin-surface2">
                <div className="flex items-center space-x-4">
                  <span>Created: {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{selectedNote.viewCount} views</span>
                  {selectedNote.linkedProblems.length > 0 && (
                    <span>{selectedNote.linkedProblems.length} linked problems</span>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Note Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-catppuccin-blue">Edit Note</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                    className="bg-catppuccin-surface1 border-catppuccin-surface2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editingNote.category}
                    onChange={(e) => setEditingNote(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                    className="bg-catppuccin-surface1 border-catppuccin-surface2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor
                  value={editingNote.content}
                  onChange={(content) => setEditingNote(prev => prev ? ({ ...prev, content }) : null)}
                  showToolbar={true}
                  showPreview={true}
                  minHeight="400px"
                  maxHeight="600px"
                  isFullscreen={fullscreenEditor}
                  onToggleFullscreen={() => setFullscreenEditor(!fullscreenEditor)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteNote(editingNote.id);
                    setEditingNote(null);
                  }}
                  className="bg-catppuccin-red hover:bg-catppuccin-red/80"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingNote(null)}
                    className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleUpdateNote(editingNote.id, {
                        title: editingNote.title,
                        content: editingNote.content,
                        category: editingNote.category
                      });
                      setEditingNote(null);
                    }}
                    className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}