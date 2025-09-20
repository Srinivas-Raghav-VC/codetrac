import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Brain, 
  GitBranch, 
  Layers, 
  Search, 
  TrendingUp, 
  Target, 
  BookOpen,
  Network,
  TreePine,
  Grid3X3,
  Activity
} from "lucide-react";
import { Problem as ApiProblem } from "../utils/api";

interface ConceptsHubProps {
  problems: ApiProblem[];
  onAddProblem: () => void;
}

interface ConceptNode {
  id: string;
  name: string;
  category: 'fundamental' | 'intermediate' | 'advanced';
  description: string;
  relatedTopics: string[];
  problems: ApiProblem[];
  masteryLevel: number; // 0-100
  averageConfidence: number; // 0-100
  totalSolved: number;
  difficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

const ALGORITHMIC_CONCEPTS: Omit<ConceptNode, 'problems' | 'masteryLevel' | 'averageConfidence' | 'totalSolved' | 'difficulty'>[] = [
  // Fundamental Concepts
  {
    id: 'arrays',
    name: 'Arrays & Strings',
    category: 'fundamental',
    description: 'Basic data structures and manipulation techniques',
    relatedTopics: ['two-pointers', 'sliding-window', 'sorting']
  },
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    category: 'fundamental', 
    description: 'Comparison and non-comparison based sorting',
    relatedTopics: ['arrays', 'divide-conquer', 'heap']
  },
  {
    id: 'searching',
    name: 'Binary Search',
    category: 'fundamental',
    description: 'Divide and conquer searching technique',
    relatedTopics: ['arrays', 'divide-conquer', 'optimization']
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'fundamental',
    description: 'Efficient array traversal technique',
    relatedTopics: ['arrays', 'sliding-window', 'sorting']
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'fundamental',
    description: 'Subarray processing optimization',
    relatedTopics: ['arrays', 'two-pointers', 'hashing']
  },
  {
    id: 'hashing',
    name: 'Hash Tables',
    category: 'fundamental',
    description: 'Fast lookup and counting data structure',
    relatedTopics: ['arrays', 'strings', 'frequency']
  },
  
  // Intermediate Concepts
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    category: 'intermediate',
    description: 'Dynamic linear data structures',
    relatedTopics: ['pointers', 'recursion', 'merging']
  },
  {
    id: 'stacks-queues',
    name: 'Stacks & Queues',
    category: 'intermediate',
    description: 'LIFO and FIFO data structures',
    relatedTopics: ['parsing', 'bfs', 'dfs', 'monotonic']
  },
  {
    id: 'trees',
    name: 'Binary Trees',
    category: 'intermediate',
    description: 'Hierarchical data structures and traversals',
    relatedTopics: ['recursion', 'dfs', 'bfs', 'divide-conquer']
  },
  {
    id: 'heap',
    name: 'Heaps & Priority Queues',
    category: 'intermediate',
    description: 'Complete binary tree with heap property',
    relatedTopics: ['trees', 'sorting', 'greedy', 'dijkstra']
  },
  {
    id: 'graphs',
    name: 'Graph Algorithms',
    category: 'intermediate',
    description: 'Graph representation and traversal',
    relatedTopics: ['bfs', 'dfs', 'shortest-path', 'connectivity']
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'intermediate',
    description: 'Exhaustive search with pruning',
    relatedTopics: ['recursion', 'dfs', 'permutations', 'combinations']
  },
  
  // Advanced Concepts
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'advanced',
    description: 'Optimization using overlapping subproblems',
    relatedTopics: ['recursion', 'memoization', 'optimization', 'sequences']
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    category: 'advanced',
    description: 'Local optimization for global solutions',
    relatedTopics: ['optimization', 'sorting', 'heap', 'intervals']
  },
  {
    id: 'divide-conquer',
    name: 'Divide & Conquer',
    category: 'advanced',
    description: 'Breaking problems into smaller subproblems',
    relatedTopics: ['recursion', 'sorting', 'trees', 'optimization']
  },
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    category: 'advanced',
    description: 'String storage and retrieval optimization',
    relatedTopics: ['strings', 'trees', 'prefix', 'autocomplete']
  },
  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    category: 'advanced',
    description: 'Disjoint set operations and connectivity',
    relatedTopics: ['graphs', 'connectivity', 'kruskal', 'optimization']
  },
  {
    id: 'advanced-graphs',
    name: 'Advanced Graph Theory',
    category: 'advanced',
    description: 'MST, shortest paths, network flows',
    relatedTopics: ['graphs', 'dijkstra', 'kruskal', 'flows']
  }
];

export function ConceptsHub({ problems, onAddProblem }: ConceptsHubProps) {
  const [activeView, setActiveView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  // Calculate concept statistics based on problems
  const conceptNodes: ConceptNode[] = useMemo(() => {
    return ALGORITHMIC_CONCEPTS.map(concept => {
      // Find problems related to this concept based on tags
      const relatedProblems = problems.filter(problem => 
        problem.tags.some(tag => 
          concept.relatedTopics.some(topic => 
            tag.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(tag.toLowerCase())
          ) ||
          tag.toLowerCase().includes(concept.name.toLowerCase()) ||
          concept.name.toLowerCase().includes(tag.toLowerCase())
        )
      );

      const solvedProblems = relatedProblems.filter(p => p.status === 'Solved');
      const totalSolved = solvedProblems.length;
      
      // Calculate difficulty distribution
      const difficulty = {
        Easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
        Medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
        Hard: solvedProblems.filter(p => p.difficulty === 'Hard').length
      };

      // Calculate mastery level (0-100) based on solved problems and difficulty
      let masteryScore = 0;
      if (totalSolved > 0) {
        const difficultyWeight = (difficulty.Easy * 1) + (difficulty.Medium * 2) + (difficulty.Hard * 3);
        const maxPossibleScore = totalSolved * 3; // If all were Hard
        masteryScore = Math.min(100, (difficultyWeight / Math.max(maxPossibleScore, 1)) * 100);
        
        // Bonus for having problems across multiple difficulties
        const diversityBonus = (Object.values(difficulty).filter(count => count > 0).length - 1) * 10;
        masteryScore = Math.min(100, masteryScore + diversityBonus);
      }

      // Calculate average confidence (mock for now, could be enhanced with real confidence tracking)
      const averageConfidence = totalSolved > 0 ? Math.min(100, masteryScore + Math.random() * 20) : 0;

      return {
        ...concept,
        problems: relatedProblems,
        masteryLevel: Math.round(masteryScore),
        averageConfidence: Math.round(averageConfidence),
        totalSolved,
        difficulty
      };
    });
  }, [problems]);

  const filteredConcepts = conceptNodes.filter(concept => {
    const matchesSearch = concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         concept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         concept.relatedTopics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || concept.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const overallStats = useMemo(() => {
    const totalConcepts = conceptNodes.length;
    const masteredConcepts = conceptNodes.filter(c => c.masteryLevel >= 70).length;
    const inProgressConcepts = conceptNodes.filter(c => c.masteryLevel > 0 && c.masteryLevel < 70).length;
    const averageMastery = conceptNodes.reduce((sum, c) => sum + c.masteryLevel, 0) / totalConcepts;

    return {
      totalConcepts,
      masteredConcepts,
      inProgressConcepts,
      averageMastery: Math.round(averageMastery)
    };
  }, [conceptNodes]);

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "bg-catppuccin-green";
    if (level >= 60) return "bg-catppuccin-yellow";
    if (level >= 40) return "bg-catppuccin-blue";
    if (level > 0) return "bg-catppuccin-red";
    return "bg-catppuccin-surface2";
  };

  const getMasteryText = (level: number) => {
    if (level >= 80) return "Mastered";
    if (level >= 60) return "Proficient";
    if (level >= 40) return "Learning";
    if (level > 0) return "Beginner";
    return "Not Started";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fundamental': return <Layers className="h-4 w-4" />;
      case 'intermediate': return <GitBranch className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-bold text-catppuccin-blue font-mono">
              <Brain className="h-6 w-6 inline mr-2" />
              Concepts Hub
            </h1>
            <p className="text-catppuccin-overlay1">
              Your algorithmic knowledge map and mastery tracking
            </p>
          </div>
          <Button 
            onClick={onAddProblem}
            className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
          >
            <Target className="h-4 w-4 mr-2" />
            Add Problem
          </Button>
        </div>

        {/* Overall Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-catppuccin-blue" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Total Concepts</p>
                  <p className="font-bold text-catppuccin-blue">{overallStats.totalConcepts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-catppuccin-green" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Mastered</p>
                  <p className="font-bold text-catppuccin-green">{overallStats.masteredConcepts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-catppuccin-yellow" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">In Progress</p>
                  <p className="font-bold text-catppuccin-yellow">{overallStats.inProgressConcepts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-catppuccin-purple" />
                <div>
                  <p className="text-sm text-catppuccin-overlay1">Avg. Mastery</p>
                  <p className="font-bold text-catppuccin-purple">{overallStats.averageMastery}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
          <Input
            placeholder="Search concepts, topics, or descriptions..."
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
              <SelectItem value="fundamental">Fundamental</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-catppuccin-surface2 rounded-md bg-catppuccin-surface1">
            <Button
              variant={activeView === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("map")}
              className={activeView === "map" 
                ? "bg-catppuccin-blue text-catppuccin-surface0" 
                : "text-catppuccin-overlay1 hover:text-catppuccin-foreground hover:bg-catppuccin-surface2"
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={activeView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("list")}
              className={activeView === "list" 
                ? "bg-catppuccin-blue text-catppuccin-surface0" 
                : "text-catppuccin-overlay1 hover:text-catppuccin-foreground hover:bg-catppuccin-surface2"
              }
            >
              <TreePine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Knowledge Map */}
      {activeView === "map" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredConcepts.map((concept) => (
            <Card 
              key={concept.id}
              className={`bg-catppuccin-surface0 border-catppuccin-surface1 cursor-pointer transition-all hover:border-catppuccin-blue/50 hover:shadow-lg ${
                selectedConcept === concept.id ? 'border-catppuccin-blue ring-1 ring-catppuccin-blue/20' : ''
              }`}
              onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(concept.category)}
                    <CardTitle className="font-mono text-base">{concept.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getMasteryColor(concept.masteryLevel)} text-catppuccin-surface0 border-none text-xs`}
                  >
                    {getMasteryText(concept.masteryLevel)}
                  </Badge>
                </div>
                <p className="text-xs text-catppuccin-overlay1 font-mono">{concept.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Mastery Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-catppuccin-overlay1">Mastery</span>
                    <span className="text-catppuccin-foreground font-mono">{concept.masteryLevel}%</span>
                  </div>
                  <Progress 
                    value={concept.masteryLevel} 
                    className="h-2"
                  />
                </div>

                {/* Problem Stats */}
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-catppuccin-overlay1">Problems:</span>
                  <span className="text-catppuccin-foreground">{concept.totalSolved}</span>
                </div>

                {/* Difficulty Breakdown */}
                {concept.totalSolved > 0 && (
                  <div className="flex space-x-1">
                    {concept.difficulty.Easy > 0 && (
                      <Badge variant="outline" className="text-xs bg-catppuccin-green/20 text-catppuccin-green border-catppuccin-green/30">
                        E:{concept.difficulty.Easy}
                      </Badge>
                    )}
                    {concept.difficulty.Medium > 0 && (
                      <Badge variant="outline" className="text-xs bg-catppuccin-yellow/20 text-catppuccin-yellow border-catppuccin-yellow/30">
                        M:{concept.difficulty.Medium}
                      </Badge>
                    )}
                    {concept.difficulty.Hard > 0 && (
                      <Badge variant="outline" className="text-xs bg-catppuccin-red/20 text-catppuccin-red border-catppuccin-red/30">
                        H:{concept.difficulty.Hard}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Related Topics */}
                <div className="flex flex-wrap gap-1">
                  {concept.relatedTopics.slice(0, 3).map((topic) => (
                    <Badge 
                      key={topic} 
                      variant="secondary" 
                      className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2 hover:bg-catppuccin-surface2/80"
                    >
                      {topic}
                    </Badge>
                  ))}
                  {concept.relatedTopics.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-catppuccin-surface2 text-catppuccin-overlay2">
                      +{concept.relatedTopics.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredConcepts.map((concept) => (
            <Card 
              key={concept.id}
              className="bg-catppuccin-surface0 border-catppuccin-surface1 cursor-pointer hover:border-catppuccin-blue/50"
              onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(concept.category)}
                      <h3 className="font-semibold font-mono">{concept.name}</h3>
                    </div>
                    
                    <div className="hidden sm:block flex-1 max-w-sm">
                      <Progress value={concept.masteryLevel} className="h-2" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm font-mono">
                      <span className="text-catppuccin-overlay1">
                        {concept.masteryLevel}% mastery
                      </span>
                      <span className="text-catppuccin-overlay1">
                        {concept.totalSolved} problems
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`${getMasteryColor(concept.masteryLevel)} text-catppuccin-surface0 border-none`}
                      >
                        {getMasteryText(concept.masteryLevel)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredConcepts.length === 0 && (
        <div className="text-center py-12 text-catppuccin-overlay1">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">No concepts found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}