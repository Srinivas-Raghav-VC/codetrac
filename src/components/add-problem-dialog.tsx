import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { X, Plus, ExternalLink, Download, BookOpen } from "lucide-react";
import { Problem } from "./problem-card";
import { StructuredJournal } from "./structured-journal";

interface AddProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProblem: (problem: Omit<Problem, 'id'>) => void;
}

interface JournalMetadata {
  mistakeType: string;
  confidenceLevel: string;
  timeSpent: string;
  difficultyPerception: string;
  keyInsights: string;
  nextSteps: string;
}

interface FetchedProblem {
  title: string;
  difficulty: string;
  tags: string[];
  rating?: number;
  statement?: string;
}

export function AddProblemDialog({ open, onOpenChange, onAddProblem }: AddProblemDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [rating, setRating] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [notes, setNotes] = useState("");
  const [journalMetadata, setJournalMetadata] = useState<JournalMetadata>({
    mistakeType: '',
    confidenceLevel: '',
    timeSpent: '',
    difficultyPerception: '',
    keyInsights: '',
    nextSteps: ''
  });
  const [fetchedProblem, setFetchedProblem] = useState<FetchedProblem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const fetchProblemFromAPI = async (url: string): Promise<FetchedProblem | null> => {
    try {
      const { fetchProblemDetails } = await import('../utils/api');
      const response = await fetchProblemDetails(url);
      
      if (!response.success) {
        console.error('Failed to fetch problem:', response.error);
        return null;
      }

      return {
        title: response.data!.title,
        difficulty: response.data!.difficulty,
        tags: response.data!.tags,
        rating: response.data!.rating,
        statement: response.data!.statement
      };
    } catch (error) {
      console.error('Error fetching problem:', error);
      return null;
    }
  };

  const handleFetchProblem = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const problem = await fetchProblemFromAPI(url);
      if (problem) {
        setFetchedProblem(problem);
        setTitle(problem.title);
        setDifficulty(problem.difficulty as 'Easy' | 'Medium' | 'Hard');
        setTags(problem.tags);
        if (problem.rating) setRating(problem.rating.toString());
        
        // Detect platform from URL
        if (url.includes('codeforces')) setPlatform('Codeforces');
        else if (url.includes('leetcode')) setPlatform('LeetCode');
        else if (url.includes('atcoder')) setPlatform('AtCoder');
        else if (url.includes('codechef')) setPlatform('CodeChef');
        else setPlatform('Other');
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
    }
    setIsLoading(false);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleNotesChange = (newNotes: string, metadata: JournalMetadata) => {
    setNotes(newNotes);
    setJournalMetadata(metadata);
  };

  const handleSubmit = () => {
    if (!title || !platform || !url) return;

    // Combine notes with journal metadata for structured storage
    let combinedNotes = notes;
    if (journalMetadata.mistakeType || journalMetadata.confidenceLevel || journalMetadata.keyInsights) {
      combinedNotes += "\n\n--- Structured Reflection ---\n";
      if (journalMetadata.mistakeType) combinedNotes += `Mistake Type: ${journalMetadata.mistakeType}\n`;
      if (journalMetadata.confidenceLevel) combinedNotes += `Confidence: ${journalMetadata.confidenceLevel}\n`;
      if (journalMetadata.timeSpent) combinedNotes += `Time Spent: ${journalMetadata.timeSpent}\n`;
      if (journalMetadata.difficultyPerception) combinedNotes += `Difficulty Perception: ${journalMetadata.difficultyPerception}\n`;
      if (journalMetadata.keyInsights) combinedNotes += `Key Insights: ${journalMetadata.keyInsights}\n`;
      if (journalMetadata.nextSteps) combinedNotes += `Next Steps: ${journalMetadata.nextSteps}\n`;
    }

    const problem: Omit<Problem, 'id'> = {
      title,
      platform,
      difficulty,
      rating: rating ? parseInt(rating) : undefined,
      url,
      status: 'Unsolved',
      tags,
      notes: combinedNotes || undefined,
    };

    onAddProblem(problem);
    
    // Reset form
    setUrl("");
    setTitle("");
    setPlatform("");
    setDifficulty('Easy');
    setRating("");
    setTags([]);
    setNewTag("");
    setNotes("");
    setJournalMetadata({
      mistakeType: '',
      confidenceLevel: '',
      timeSpent: '',
      difficultyPerception: '',
      keyInsights: '',
      nextSteps: ''
    });
    setFetchedProblem(null);
    setActiveTab("basic");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-catppuccin-blue">Add New Problem</DialogTitle>
          <DialogDescription className="text-catppuccin-overlay1">
            Enter a problem URL to auto-fetch details or manually add problem information.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-catppuccin-surface1 border border-catppuccin-surface2 w-full">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-1"
            >
              Problem Details
            </TabsTrigger>
            <TabsTrigger 
              value="journal"
              className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0 flex-1"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Structured Reflection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* URL Input and Fetch */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-catppuccin-overlay2">Problem URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="https://codeforces.com/problem/1234/A"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
                />
                <Button
                  onClick={handleFetchProblem}
                  disabled={!url || isLoading}
                  className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-catppuccin-surface0 border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

          {/* Fetched Problem Preview */}
          {fetchedProblem && (
            <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-catppuccin-green">Problem Fetched Successfully!</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="text-catppuccin-blue hover:text-catppuccin-blue/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-catppuccin-blue">{fetchedProblem.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-catppuccin-yellow text-catppuccin-surface0">
                        {fetchedProblem.difficulty}
                      </Badge>
                      {fetchedProblem.rating && (
                        <Badge variant="outline" className="border-catppuccin-surface2">
                          {fetchedProblem.rating}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {fetchedProblem.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-catppuccin-surface2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {fetchedProblem.statement && (
                    <CardDescription className="text-xs bg-catppuccin-surface0 p-3 rounded text-catppuccin-overlay1">
                      {fetchedProblem.statement.substring(0, 200)}...
                    </CardDescription>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="bg-catppuccin-surface1" />

          {/* Manual Input Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-catppuccin-overlay2">Problem Title</Label>
              <Input
                id="title"
                placeholder="Enter problem title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-catppuccin-overlay2">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="Codeforces">Codeforces</SelectItem>
                  <SelectItem value="LeetCode">LeetCode</SelectItem>
                  <SelectItem value="AtCoder">AtCoder</SelectItem>
                  <SelectItem value="CodeChef">CodeChef</SelectItem>
                  <SelectItem value="HackerRank">HackerRank</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-catppuccin-overlay2">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}>
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

            <div className="space-y-2">
              <Label htmlFor="rating" className="text-catppuccin-overlay2">Rating (Optional)</Label>
              <Input
                id="rating"
                placeholder="e.g., 1200"
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-catppuccin-overlay2">Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
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
              {tags.map((tag, index) => (
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

            {/* Basic Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-catppuccin-overlay2">Quick Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any quick notes about this problem..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground min-h-[60px]"
              />
              <p className="text-xs text-catppuccin-overlay1">
                For detailed reflection and learning insights, use the "Structured Reflection" tab
              </p>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            <StructuredJournal 
              initialNotes={notes}
              onNotesChange={handleNotesChange}
            />
          </TabsContent>

          {/* Actions - Outside tabs so always visible */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-catppuccin-surface2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title || !platform || !url}
              className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
            >
              Add Problem
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}