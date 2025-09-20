import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { 
  Brain, 
  AlertTriangle, 
  Target, 
  BookOpen, 
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle
} from "lucide-react";

interface StructuredJournalProps {
  initialNotes?: string;
  onNotesChange: (notes: string, metadata: JournalMetadata) => void;
}

interface JournalMetadata {
  mistakeType: string;
  confidenceLevel: string;
  timeSpent: string;
  difficultyPerception: string;
  keyInsights: string;
  nextSteps: string;
}

const MISTAKE_TYPES = [
  { value: 'logic', label: 'Logic Error', description: 'Flawed reasoning or algorithm design' },
  { value: 'implementation', label: 'Implementation Bug', description: 'Coding error or syntax mistake' },
  { value: 'misread', label: 'Misread Problem', description: 'Misunderstood requirements or constraints' },
  { value: 'edge-case', label: 'Edge Case', description: 'Failed to handle boundary conditions' },
  { value: 'optimization', label: 'Time/Space Complexity', description: 'Inefficient solution approach' },
  { value: 'none', label: 'No Mistake', description: 'Solved correctly on first attempt' }
];

const CONFIDENCE_LEVELS = [
  { value: 'high', label: 'High Confidence', description: 'Very comfortable with this solution' },
  { value: 'medium', label: 'Medium Confidence', description: 'Generally understand but some uncertainty' },
  { value: 'low', label: 'Low Confidence', description: 'Uncertain about correctness or approach' }
];

const TIME_SPENT_OPTIONS = [
  { value: 'under-15', label: '< 15 minutes' },
  { value: '15-30', label: '15-30 minutes' },
  { value: '30-60', label: '30-60 minutes' },
  { value: '1-2-hours', label: '1-2 hours' },
  { value: 'over-2-hours', label: '> 2 hours' }
];

const DIFFICULTY_PERCEPTION = [
  { value: 'easier', label: 'Easier than rated' },
  { value: 'accurate', label: 'Accurate rating' },
  { value: 'harder', label: 'Harder than rated' }
];

export function StructuredJournal({ initialNotes = "", onNotesChange }: StructuredJournalProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [mistakeType, setMistakeType] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [difficultyPerception, setDifficultyPerception] = useState("");
  const [keyInsights, setKeyInsights] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  const handleChange = () => {
    const metadata: JournalMetadata = {
      mistakeType,
      confidenceLevel,
      timeSpent,
      difficultyPerception,
      keyInsights,
      nextSteps
    };

    onNotesChange(notes, metadata);
  };

  // Call handleChange whenever any field changes
  const updateField = (field: string, value: string) => {
    switch (field) {
      case 'notes': setNotes(value); break;
      case 'mistakeType': setMistakeType(value); break;
      case 'confidenceLevel': setConfidenceLevel(value); break;
      case 'timeSpent': setTimeSpent(value); break;
      case 'difficultyPerception': setDifficultyPerception(value); break;
      case 'keyInsights': setKeyInsights(value); break;
      case 'nextSteps': setNextSteps(value); break;
    }
    // Use setTimeout to ensure state is updated before calling handleChange
    setTimeout(handleChange, 0);
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      case 'medium': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'low': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  const getMistakeTypeColor = (type: string) => {
    switch (type) {
      case 'logic': return 'text-catppuccin-red border-catppuccin-red bg-catppuccin-red/10';
      case 'implementation': return 'text-catppuccin-yellow border-catppuccin-yellow bg-catppuccin-yellow/10';
      case 'misread': return 'text-catppuccin-purple border-catppuccin-purple bg-catppuccin-purple/10';
      case 'edge-case': return 'text-catppuccin-blue border-catppuccin-blue bg-catppuccin-blue/10';
      case 'optimization': return 'text-catppuccin-pink border-catppuccin-pink bg-catppuccin-pink/10';
      case 'none': return 'text-catppuccin-green border-catppuccin-green bg-catppuccin-green/10';
      default: return 'text-catppuccin-overlay1 border-catppuccin-surface2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5 text-catppuccin-blue" />
        <h3 className="font-semibold text-catppuccin-blue font-mono">Structured Reflection</h3>
        <Badge variant="outline" className="text-xs bg-catppuccin-surface1 text-catppuccin-overlay1">
          Build your learning database
        </Badge>
      </div>

      {/* Primary Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-catppuccin-red" />
              <span>Mistake Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">What type of mistake occurred?</Label>
              <Select value={mistakeType} onValueChange={(value) => updateField('mistakeType', value)}>
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue placeholder="Select mistake type..." />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  {MISTAKE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-catppuccin-overlay1">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {mistakeType && (
                <Badge className={`text-xs ${getMistakeTypeColor(mistakeType)}`}>
                  {MISTAKE_TYPES.find(t => t.value === mistakeType)?.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Target className="h-4 w-4 text-catppuccin-blue" />
              <span>Confidence Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">How confident are you in this solution?</Label>
              <Select value={confidenceLevel} onValueChange={(value) => updateField('confidenceLevel', value)}>
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue placeholder="Select confidence level..." />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  {CONFIDENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-catppuccin-overlay1">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {confidenceLevel && (
                <Badge className={`text-xs ${getConfidenceColor(confidenceLevel)}`}>
                  {CONFIDENCE_LEVELS.find(l => l.value === confidenceLevel)?.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-catppuccin-yellow" />
              <span>Time Spent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">How long did this problem take?</Label>
              <Select value={timeSpent} onValueChange={(value) => updateField('timeSpent', value)}>
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue placeholder="Select time range..." />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  {TIME_SPENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-catppuccin-purple" />
              <span>Difficulty Perception</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">How did the actual difficulty compare to the rating?</Label>
              <Select value={difficultyPerception} onValueChange={(value) => updateField('difficultyPerception', value)}>
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue placeholder="Select perception..." />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  {DIFFICULTY_PERCEPTION.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-catppuccin-surface2" />

      {/* Detailed Reflection */}
      <div className="space-y-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Lightbulb className="h-4 w-4 text-catppuccin-green" />
              <span>Key Insights & Learning</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">
                What did you learn? What patterns or techniques emerged?
              </Label>
              <Textarea
                value={keyInsights}
                onChange={(e) => updateField('keyInsights', e.target.value)}
                placeholder="Describe the key algorithmic insights, patterns you noticed, or techniques you learned..."
                className="bg-catppuccin-surface1 border-catppuccin-surface2 min-h-[80px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-catppuccin-blue" />
              <span>Next Steps & Review Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">
                What should you review? Any follow-up problems or concepts to practice?
              </Label>
              <Textarea
                value={nextSteps}
                onChange={(e) => updateField('nextSteps', e.target.value)}
                placeholder="Plan your follow-up: similar problems to practice, concepts to review, or variations to explore..."
                className="bg-catppuccin-surface1 border-catppuccin-surface2 min-h-[80px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <MessageSquare className="h-4 w-4 text-catppuccin-overlay1" />
              <span>Detailed Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-catppuccin-overlay1">
                Additional notes, solution approach, code snippets, or thoughts
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Capture your solution approach, code snippets, alternative methods, or any other observations..."
                className="bg-catppuccin-surface1 border-catppuccin-surface2 min-h-[120px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-xs text-catppuccin-overlay1 font-mono">
        <span>Building your personalized learning database...</span>
        <div className="flex space-x-1">
          {[mistakeType, confidenceLevel, timeSpent, difficultyPerception].map((field, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                field ? 'bg-catppuccin-green' : 'bg-catppuccin-surface2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}