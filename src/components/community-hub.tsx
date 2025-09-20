import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Star, 
  ThumbsUp, 
  Share, 
  Plus, 
  Search,
  Filter,
  Globe,
  BookOpen,
  Code,
  HelpCircle,
  Lightbulb,
  Flame,
  Trophy,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  Pin,
  Flag,
  Edit,
  Send
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Problem as ApiProblem } from "../utils/api";

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'solution' | 'tip' | 'announcement';
  author: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    badges: string[];
  };
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  isLiked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  problemUrl?: string;
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
  };
  likes: number;
  isLiked: boolean;
  isAccepted: boolean;
  createdAt: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Optimal approach for Segment Tree with Lazy Propagation?',
    content: 'I\'ve been struggling with implementing lazy propagation in segment trees. The range update queries are taking too much time. Has anyone found an efficient implementation?',
    type: 'question',
    author: {
      id: 'user-1',
      name: 'Alice Chen',
      reputation: 1247,
      badges: ['Expert', 'Top Contributor']
    },
    tags: ['segment-trees', 'lazy-propagation', 'data-structures'],
    likes: 23,
    replies: 8,
    views: 156,
    isLiked: false,
    isPinned: false,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
    difficulty: 'Hard'
  },
  {
    id: 'post-2',
    title: 'Weekly Contest #42 - Dynamic Programming Solutions Discussion',
    content: 'Let\'s discuss the DP problems from this week\'s contest. I found problem C particularly challenging with the state transitions.',
    type: 'discussion',
    author: {
      id: 'user-2',
      name: 'Bob Smith',
      reputation: 856,
      badges: ['Rising Star']
    },
    tags: ['dynamic-programming', 'contest', 'codeforces'],
    likes: 45,
    replies: 12,
    views: 289,
    isLiked: true,
    isPinned: true,
    createdAt: '2024-01-19T18:00:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
    difficulty: 'Medium'
  },
  {
    id: 'post-3',
    title: 'Efficient Binary Search Template - Never get TLE again!',
    content: 'After years of competitive programming, I\'ve refined my binary search template. This handles all edge cases and prevents infinite loops.',
    type: 'tip',
    author: {
      id: 'user-3',
      name: 'Charlie Wilson',
      reputation: 2103,
      badges: ['Algorithm Master', 'Top Contributor', 'Mentor']
    },
    tags: ['binary-search', 'templates', 'tips'],
    likes: 78,
    replies: 15,
    views: 567,
    isLiked: false,
    isPinned: false,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-19T11:15:00Z',
    difficulty: 'Easy'
  }
];

const SAMPLE_REPLIES: Reply[] = [
  {
    id: 'reply-1',
    content: 'Great question! For lazy propagation, make sure you\'re pushing updates only when necessary. Here\'s my template that handles range updates efficiently...',
    author: {
      id: 'user-3',
      name: 'Charlie Wilson',
      reputation: 2103
    },
    likes: 12,
    isLiked: false,
    isAccepted: true,
    createdAt: '2024-01-20T11:15:00Z'
  }
];

interface CommunityHubProps {
  problems: ApiProblem[];
  currentUserId: string;
}

export function CommunityHub({ problems, currentUserId }: CommunityHubProps) {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("trending");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  
  // Create post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion' as Post['type'],
    tags: '',
    difficulty: 'Medium' as Post['difficulty'],
    problemUrl: ''
  });

  const [newReply, setNewReply] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || post.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return (b.likes + b.replies * 2) - (a.likes + a.replies * 2);
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "popular":
        return b.likes - a.likes;
      case "unanswered":
        return a.replies - b.replies;
      default:
        return 0;
    }
  });

  const handleCreatePost = () => {
    const post: Post = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      type: newPost.type,
      author: {
        id: currentUserId,
        name: 'You',
        reputation: 0,
        badges: []
      },
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      likes: 0,
      replies: 0,
      views: 0,
      isLiked: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      difficulty: newPost.difficulty,
      problemUrl: newPost.problemUrl || undefined
    };

    setPosts(prev => [post, ...prev]);
    setCreatePostOpen(false);
    setNewPost({
      title: '',
      content: '',
      type: 'discussion',
      tags: '',
      difficulty: 'Medium',
      problemUrl: ''
    });
    toast.success("Post created successfully!");
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleReply = () => {
    if (!selectedPost || !newReply.trim()) return;

    // In real implementation, this would save to backend
    toast.success("Reply posted successfully!");
    setNewReply('');
    
    // Update replies count
    setPosts(prev => prev.map(post => 
      post.id === selectedPost.id 
        ? { ...post, replies: post.replies + 1 }
        : post
    ));
  };

  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'question': return <HelpCircle className="h-4 w-4" />;
      case 'discussion': return <MessageSquare className="h-4 w-4" />;
      case 'solution': return <Code className="h-4 w-4" />;
      case 'tip': return <Lightbulb className="h-4 w-4" />;
      case 'announcement': return <Pin className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'question': return 'text-catppuccin-blue border-catppuccin-blue bg-catppuccin-blue/10';
      case 'discussion': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'solution': return 'text-catppuccin-purple border-catppuccin-purple bg-catppuccin-purple/10';
      case 'tip': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'announcement': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'Medium': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'Hard': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <Globe className="h-6 w-6 inline mr-2" />
            Community Hub
          </h1>
          <p className="text-catppuccin-overlay1">
            Connect with fellow competitive programmers, share knowledge, and get help
          </p>
        </div>
        <Button 
          onClick={() => setCreatePostOpen(true)}
          className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-blue">12.5K</div>
            <div className="text-xs text-catppuccin-overlay1">Active Members</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-green">{posts.length}</div>
            <div className="text-xs text-catppuccin-overlay1">Discussions</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-yellow">847</div>
            <div className="text-xs text-catppuccin-overlay1">Today's Posts</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 text-catppuccin-red mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-red">98%</div>
            <div className="text-xs text-catppuccin-overlay1">Response Rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          <TabsTrigger value="contests">Contests</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-catppuccin-overlay1" />
              <Input
                placeholder="Search discussions, questions, tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-catppuccin-surface1 border border-catppuccin-surface2 rounded text-sm"
              >
                <option value="all">All Types</option>
                <option value="question">Questions</option>
                <option value="discussion">Discussions</option>
                <option value="solution">Solutions</option>
                <option value="tip">Tips</option>
                <option value="announcement">Announcements</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-catppuccin-surface1 border border-catppuccin-surface2 rounded text-sm"
              >
                <option value="trending">Trending</option>
                <option value="recent">Recent</option>
                <option value="popular">Most Liked</option>
                <option value="unanswered">Unanswered</option>
              </select>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <Card 
                key={post.id}
                className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-catppuccin-surface1">
                        {post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getPostTypeColor(post.type)}>
                          {getPostTypeIcon(post.type)}
                          <span className="ml-1 capitalize">{post.type}</span>
                        </Badge>
                        {post.difficulty && (
                          <Badge className={getDifficultyColor(post.difficulty)}>
                            {post.difficulty}
                          </Badge>
                        )}
                        {post.isPinned && (
                          <Badge className="bg-catppuccin-yellow text-catppuccin-surface0">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-catppuccin-foreground mb-2 line-clamp-1">
                        {post.title}
                      </h3>

                      <p className="text-catppuccin-overlay1 text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-catppuccin-surface2">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">+{post.tags.length - 4}</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-catppuccin-overlay1">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{post.author.name}</span>
                            <span>•</span>
                            <span>{post.author.reputation} rep</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{timeAgo(post.updatedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post.id);
                            }}
                            className={`flex items-center space-x-1 hover:text-catppuccin-red transition-colors ${
                              post.isLiked ? 'text-catppuccin-red' : 'text-catppuccin-overlay1'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          
                          <div className="flex items-center space-x-1 text-catppuccin-overlay1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-catppuccin-overlay1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs would have filtered content */}
        <TabsContent value="trending">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Trending Posts</h3>
            <p>Most popular posts from the community this week</p>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <p>Get help from the community with your programming challenges</p>
          </div>
        </TabsContent>

        <TabsContent value="tips">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Tips & Tricks</h3>
            <p>Learn from experienced competitive programmers</p>
          </div>
        </TabsContent>

        <TabsContent value="contests">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Contest Discussion</h3>
            <p>Discuss contest problems and strategies</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getPostTypeColor(selectedPost.type)}>
                  {getPostTypeIcon(selectedPost.type)}
                  <span className="ml-1 capitalize">{selectedPost.type}</span>
                </Badge>
                {selectedPost.difficulty && (
                  <Badge className={getDifficultyColor(selectedPost.difficulty)}>
                    {selectedPost.difficulty}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-catppuccin-blue text-xl">
                {selectedPost.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={selectedPost.author.avatar} />
                  <AvatarFallback className="bg-catppuccin-surface1">
                    {selectedPost.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-catppuccin-foreground">
                    {selectedPost.author.name}
                  </div>
                  <div className="text-sm text-catppuccin-overlay1">
                    {selectedPost.author.reputation} reputation • {timeAgo(selectedPost.createdAt)}
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-catppuccin-overlay1 whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-catppuccin-surface2">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 py-4 border-y border-catppuccin-surface1">
                <button
                  onClick={() => handleLikePost(selectedPost.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded hover:bg-catppuccin-surface1 transition-colors ${
                    selectedPost.isLiked ? 'text-catppuccin-red' : 'text-catppuccin-overlay1'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                  <span>{selectedPost.likes} Likes</span>
                </button>
                
                <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-catppuccin-surface1 transition-colors text-catppuccin-overlay1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Replies Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-catppuccin-foreground">
                  Replies ({selectedPost.replies})
                </h3>

                {SAMPLE_REPLIES.map((reply) => (
                  <div key={reply.id} className="border border-catppuccin-surface1 rounded p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-catppuccin-surface1 text-xs">
                          {reply.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-catppuccin-foreground text-sm">
                          {reply.author.name}
                        </div>
                        <div className="text-xs text-catppuccin-overlay1">
                          {reply.author.reputation} rep • {timeAgo(reply.createdAt)}
                        </div>
                      </div>
                      {reply.isAccepted && (
                        <Badge className="bg-catppuccin-green text-catppuccin-surface0 text-xs">
                          ✓ Accepted
                        </Badge>
                      )}
                    </div>
                    <p className="text-catppuccin-overlay1 text-sm mb-3">{reply.content}</p>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-xs text-catppuccin-overlay1 hover:text-catppuccin-red transition-colors">
                        <Heart className="h-3 w-3" />
                        <span>{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Reply Form */}
                <div className="border border-catppuccin-surface1 rounded p-4">
                  <h4 className="font-medium text-catppuccin-foreground mb-3">Add Reply</h4>
                  <Textarea
                    placeholder="Share your thoughts or help solve this problem..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="bg-catppuccin-surface1 border-catppuccin-surface2 mb-3"
                    rows={4}
                  />
                  <Button
                    onClick={handleReply}
                    disabled={!newReply.trim()}
                    className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Post Dialog */}
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create New Post</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Share knowledge, ask questions, or start discussions with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Type</label>
              <select
                value={newPost.type}
                onChange={(e) => setNewPost(prev => ({ ...prev, type: e.target.value as Post['type'] }))}
                className="w-full px-3 py-2 bg-catppuccin-surface1 border border-catppuccin-surface2 rounded"
              >
                <option value="discussion">Discussion</option>
                <option value="question">Question</option>
                <option value="solution">Solution</option>
                <option value="tip">Tip</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter post title..."
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your post content here..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  placeholder="e.g., dynamic-programming, graphs"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty (if applicable)</label>
                <select
                  value={newPost.difficulty}
                  onChange={(e) => setNewPost(prev => ({ ...prev, difficulty: e.target.value as Post['difficulty'] }))}
                  className="w-full px-3 py-2 bg-catppuccin-surface1 border border-catppuccin-surface2 rounded"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Problem URL (optional)</label>
              <Input
                placeholder="https://codeforces.com/problem/..."
                value={newPost.problemUrl}
                onChange={(e) => setNewPost(prev => ({ ...prev, problemUrl: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCreatePostOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPost.title || !newPost.content}
              className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
            >
              Create Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}