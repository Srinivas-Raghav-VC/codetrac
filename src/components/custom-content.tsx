import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  X
} from "lucide-react";

interface CustomContentProps {
  onAddProblem: () => void;
}

export interface CustomNote {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code' | 'explanation' | 'template' | 'cheatsheet';
  category: string; // e.g., "Binary Search", "Dynamic Programming"
  tags: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

const SAMPLE_NOTES: CustomNote[] = [
  {
    id: 'bs-template',
    title: 'Binary Search Template',
    content: `# Binary Search Template

## Standard Template
\`\`\`cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}
\`\`\`

## Predicate-based Template
\`\`\`cpp
// Find first position where predicate is true
int binarySearchPredicate(int left, int right, function<bool(int)> predicate) {
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (predicate(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
\`\`\`

## Key Points
- Always check for integer overflow: use \`left + (right - left) / 2\`
- Be careful with boundary conditions
- Predicate function should be monotonic`,
    type: 'template',
    category: 'Binary Search',
    tags: ['binary-search', 'template', 'cpp'],
    difficulty: 'Medium',
    isFavorite: true,
    isPublic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    viewCount: 45
  },
  {
    id: 'dp-patterns',
    title: 'Common DP Patterns',
    content: `# Dynamic Programming Patterns

## 1. Linear DP
- **Use case**: Problems with 1D decision space
- **Template**: \`dp[i] = f(dp[i-1], dp[i-2], ...)\`
- **Examples**: Fibonacci, Climbing Stairs, House Robber

## 2. 2D DP
- **Use case**: Grid problems, two sequences
- **Template**: \`dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)\`
- **Examples**: Unique Paths, Edit Distance, LCS

## 3. Knapsack DP
- **0/1 Knapsack**: \`dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])\`
- **Unbounded Knapsack**: \`dp[i][w] = max(dp[i-1][w], dp[i][w-weight[i]] + value[i])\`

## Common Optimizations
1. **Space optimization**: Use 1D array when only previous row is needed
2. **Bottom-up vs Top-down**: Choose based on problem constraints
3. **Memoization**: Add caching to recursive solutions`,
    type: 'cheatsheet',
    category: 'Dynamic Programming',
    tags: ['dp', 'patterns', 'optimization'],
    difficulty: 'Hard',
    isFavorite: true,
    isPublic: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
    viewCount: 23
  },
  {
    id: 'graph-traversal-notes',
    title: 'Graph Traversal Insights',
    content: `# My Notes on Graph Traversal

## When I learned DFS vs BFS
- **DFS**: Good for path finding, cycle detection, topological sort
- **BFS**: Best for shortest path in unweighted graphs, level-order processing

## Common Mistakes I Made
1. Forgetting to mark nodes as visited
2. Not handling disconnected components
3. Stack overflow with recursive DFS on large graphs

## My Template for Graph Problems
1. Identify the graph representation needed
2. Choose DFS vs BFS based on the problem
3. Handle edge cases: empty graph, single node, cycles
4. Consider space complexity: recursive vs iterative

## Problems Where I Applied This
- Connected Components: DFS worked great
- Shortest Path: BFS was perfect
- Cycle Detection: DFS with color coding`,
    type: 'note',
    category: 'Graphs',
    tags: ['graphs', 'dfs', 'bfs', 'personal-notes'],
    isFavorite: false,
    isPublic: false,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    viewCount: 12
  }
];

export function CustomContent({ onAddProblem }: CustomContentProps) {
  const [notes, setNotes] = useState<CustomNote[]>(SAMPLE_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CustomNote | null>(null);
  const [editingNote, setEditingNote] = useState<CustomNote | null>(null);

  // New note creation state
  const [newNote, setNewNote] = useState<Partial<CustomNote>>({
    title: '',
    content: '',
    type: 'note',
    category: '',
    tags: [],
    difficulty: undefined,
    isFavorite: false,
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
    const matchesFavorites = !showFavoritesOnly || note.isFavorite;
    
    return matchesSearch && matchesType && matchesCategory && matchesFavorites;
  });

  const categories = [...new Set(notes.map(note => note.category))];

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
      isPublic: newNote.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0
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
      isPublic: false
    });
    setCreateNoteOpen(false);
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

  const toggleFavorite = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="h-4 w-4" />;
      case 'explanation': return <Lightbulb className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      case 'cheatsheet': return <BookOpen className="h-4 w-4" />;
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
      case 'note': return 'text-catppuccin-pink border-catppuccin-pink bg-catppuccin-pink/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-catppuccin-blue font-mono">
            <FileText className="h-6 w-6 inline mr-2" />
            My Knowledge Base
          </h1>
          <p className="text-catppuccin-overlay1">
            Create and organize your own notes, templates, and learning materials
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
            <div className="font-mono text-sm">{notes.length}</div>
            <div className="text-xs text-catppuccin-overlay1">Total Notes</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
            <div className="font-mono text-sm">{notes.filter(n => n.isFavorite).length}</div>
            <div className="text-xs text-catppuccin-overlay1">Favorites</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
            <div className="font-mono text-sm">{categories.length}</div>
            <div className="text-xs text-catppuccin-overlay1">Categories</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
            <div className="font-mono text-sm">{notes.reduce((sum, n) => sum + n.viewCount, 0)}</div>
            <div className="text-xs text-catppuccin-overlay1">Total Views</div>
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

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={showFavoritesOnly ? 
              "bg-catppuccin-yellow text-catppuccin-surface0" : 
              "border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            }
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card 
            key={note.id}
            className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  {getTypeIcon(note.type)}
                  <CardTitle className="font-mono text-base truncate">{note.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.id);
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
              
              <div className="flex flex-wrap gap-2">
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
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Content Preview */}
              <p className="text-sm text-catppuccin-overlay1 line-clamp-3">
                {note.content.substring(0, 150)}...
              </p>

              {/* Tags */}
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

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-catppuccin-overlay1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{note.viewCount} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-catppuccin-overlay1">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">No notes found</h3>
          <p className="mb-4">
            {notes.length === 0 ? 
              "Start building your knowledge base with your first note" : 
              "Try adjusting your search or filters"
            }
          </p>
          {notes.length === 0 && (
            <Button 
              onClick={() => setCreateNoteOpen(true)}
              className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Note
            </Button>
          )}
        </div>
      )}

      {/* Create Note Dialog */}
      <Dialog open={createNoteOpen} onOpenChange={setCreateNoteOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create New Note</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Add your own learning materials, code templates, or insights
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Binary Search Template"
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
                    <SelectItem value="explanation">Explanation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="e.g., Binary Search, Graphs"
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

            {/* Content */}
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your note content here... (Supports Markdown)"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-catppuccin-overlay1">
                Tip: Use Markdown for formatting. Code blocks with ```cpp or ```python for syntax highlighting.
              </p>
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
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-catppuccin-blue text-xl flex items-center space-x-2">
                    {getTypeIcon(selectedNote.type)}
                    <span>{selectedNote.title}</span>
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Content */}
              <div className="bg-catppuccin-surface1 p-4 rounded border border-catppuccin-surface2">
                <pre className="whitespace-pre-wrap font-mono text-sm text-catppuccin-foreground">
                  {selectedNote.content}
                </pre>
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
                <span>Created: {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
                <span>{selectedNote.viewCount} views</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}