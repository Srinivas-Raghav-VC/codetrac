import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Code, 
  TrendingUp,
  Zap,
  BookOpen,
  Users,
  Trophy,
  Calendar,
  Star,
  Brain,
  Rocket
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void;
}

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

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'New to competitive programming', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'intermediate', label: 'Intermediate', description: 'Some contest experience', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'advanced', label: 'Advanced', description: 'Regular contest participant', icon: <Trophy className="h-5 w-5" /> },
  { id: 'expert', label: 'Expert', description: 'High-rated competitive programmer', icon: <Star className="h-5 w-5" /> }
];

const PLATFORMS = [
  { id: 'codeforces', label: 'Codeforces', popular: true },
  { id: 'leetcode', label: 'LeetCode', popular: true },
  { id: 'atcoder', label: 'AtCoder', popular: true },
  { id: 'codechef', label: 'CodeChef', popular: false },
  { id: 'hackerrank', label: 'HackerRank', popular: false },
  { id: 'topcoder', label: 'TopCoder', popular: false },
  { id: 'spoj', label: 'SPOJ', popular: false },
  { id: 'usaco', label: 'USACO', popular: false }
];

const GOALS = [
  { id: 'contest-rating', label: 'Improve Contest Rating', icon: <Trophy className="h-4 w-4" /> },
  { id: 'job-interviews', label: 'Ace Technical Interviews', icon: <Code className="h-4 w-4" /> },
  { id: 'daily-practice', label: 'Build Daily Solving Habit', icon: <Calendar className="h-4 w-4" /> },
  { id: 'algorithm-mastery', label: 'Master Algorithm Patterns', icon: <Brain className="h-4 w-4" /> },
  { id: 'contest-performance', label: 'Perform Better in Contests', icon: <Zap className="h-4 w-4" /> },
  { id: 'learn-new-topics', label: 'Learn Advanced Topics', icon: <BookOpen className="h-4 w-4" /> }
];

const STUDY_SCHEDULES = [
  { id: 'casual', label: 'Casual', description: '1-2 problems per week', time: '2-4 hours/week' },
  { id: 'regular', label: 'Regular', description: '3-5 problems per week', time: '5-8 hours/week' },
  { id: 'intensive', label: 'Intensive', description: '1+ problems per day', time: '10+ hours/week' },
  { id: 'contest-focused', label: 'Contest-Focused', description: 'Preparing for specific contests', time: 'Variable' }
];

const TOPIC_AREAS = [
  'Dynamic Programming', 'Graphs', 'Binary Search', 'Greedy', 'Number Theory',
  'Segment Trees', 'Strings', 'Geometry', 'Game Theory', 'Flow Networks'
];

const MOTIVATIONS = [
  { id: 'career', label: 'Career Advancement', icon: <Rocket className="h-4 w-4" /> },
  { id: 'learning', label: 'Love of Problem Solving', icon: <Brain className="h-4 w-4" /> },
  { id: 'competition', label: 'Competitive Spirit', icon: <Trophy className="h-4 w-4" /> },
  { id: 'community', label: 'Join the Community', icon: <Users className="h-4 w-4" /> }
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    experience: '',
    platforms: [],
    goals: [],
    studySchedule: '',
    preferredTopics: [],
    motivations: [],
    customGoal: ''
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return preferences.name.trim().length > 0;
      case 1: return preferences.experience.length > 0;
      case 2: return preferences.platforms.length > 0;
      case 3: return preferences.goals.length > 0;
      case 4: return preferences.studySchedule.length > 0;
      case 5: return true; // Final step is always valid
      default: return false;
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="min-h-screen bg-background font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-catppuccin-blue mb-2">Welcome to CodeTrac</h1>
          <p className="text-catppuccin-overlay1 mb-4">Let's personalize your competitive programming journey</p>
          <div className="w-full bg-catppuccin-surface1 rounded-full h-2">
            <div 
              className="bg-catppuccin-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-catppuccin-overlay1 mt-2">Step {currentStep + 1} of {totalSteps}</p>
        </div>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardHeader>
            <CardTitle className="text-catppuccin-blue font-mono flex items-center space-x-2">
              {currentStep === 0 && <><Target className="h-5 w-5" /><span>Let's Get Started</span></>}
              {currentStep === 1 && <><TrendingUp className="h-5 w-5" /><span>Your Experience Level</span></>}
              {currentStep === 2 && <><Code className="h-5 w-5" /><span>Preferred Platforms</span></>}
              {currentStep === 3 && <><Trophy className="h-5 w-5" /><span>Your Goals</span></>}
              {currentStep === 4 && <><Calendar className="h-5 w-5" /><span>Study Schedule</span></>}
              {currentStep === 5 && <><CheckCircle2 className="h-5 w-5" /><span>Final Touches</span></>}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 0: Name */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Sparkles className="h-16 w-16 text-catppuccin-yellow mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    What should we call you?
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    This will help us personalize your experience
                  </p>
                </div>
                
                <Input
                  placeholder="Enter your name or nickname"
                  value={preferences.name}
                  onChange={(e) => updatePreferences({ name: e.target.value })}
                  className="text-center text-lg bg-catppuccin-surface1 border-catppuccin-surface2"
                  autoFocus
                />
              </div>
            )}

            {/* Step 1: Experience Level */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    What's your experience level?
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    This helps us recommend the right difficulty and content
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <Card
                      key={level.id}
                      className={`cursor-pointer transition-all border-2 ${
                        preferences.experience === level.id
                          ? 'border-catppuccin-blue bg-catppuccin-blue/10'
                          : 'border-catppuccin-surface2 hover:border-catppuccin-blue/50'
                      }`}
                      onClick={() => updatePreferences({ experience: level.id })}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-catppuccin-blue mb-2">{level.icon}</div>
                        <h4 className="font-semibold text-catppuccin-foreground">{level.label}</h4>
                        <p className="text-sm text-catppuccin-overlay1 mt-1">{level.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Platforms */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    Which platforms do you use?
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    Select all that apply - we'll help you track problems from these platforms
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-catppuccin-green">Popular Platforms</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PLATFORMS.filter(p => p.popular).map((platform) => (
                      <Badge
                        key={platform.id}
                        variant={preferences.platforms.includes(platform.id) ? "default" : "outline"}
                        className={`cursor-pointer p-3 justify-center transition-all ${
                          preferences.platforms.includes(platform.id)
                            ? 'bg-catppuccin-blue text-catppuccin-surface0'
                            : 'border-catppuccin-surface2 hover:border-catppuccin-blue'
                        }`}
                        onClick={() => updatePreferences({ 
                          platforms: toggleArrayItem(preferences.platforms, platform.id)
                        })}
                      >
                        {platform.label}
                      </Badge>
                    ))}
                  </div>

                  <h4 className="font-semibold text-catppuccin-overlay1 mt-6">Other Platforms</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {PLATFORMS.filter(p => !p.popular).map((platform) => (
                      <Badge
                        key={platform.id}
                        variant={preferences.platforms.includes(platform.id) ? "default" : "outline"}
                        className={`cursor-pointer p-2 justify-center text-xs transition-all ${
                          preferences.platforms.includes(platform.id)
                            ? 'bg-catppuccin-purple text-catppuccin-surface0'
                            : 'border-catppuccin-surface2 hover:border-catppuccin-purple'
                        }`}
                        onClick={() => updatePreferences({ 
                          platforms: toggleArrayItem(preferences.platforms, platform.id)
                        })}
                      >
                        {platform.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    What are your main goals?
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    Select all that apply - we'll tailor your experience accordingly
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GOALS.map((goal) => (
                    <Card
                      key={goal.id}
                      className={`cursor-pointer transition-all border-2 ${
                        preferences.goals.includes(goal.id)
                          ? 'border-catppuccin-green bg-catppuccin-green/10'
                          : 'border-catppuccin-surface2 hover:border-catppuccin-green/50'
                      }`}
                      onClick={() => updatePreferences({ 
                        goals: toggleArrayItem(preferences.goals, goal.id)
                      })}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        <div className="text-catppuccin-green">{goal.icon}</div>
                        <span className="font-medium text-catppuccin-foreground">{goal.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-catppuccin-overlay1">
                    Custom Goal (Optional)
                  </label>
                  <Textarea
                    placeholder="Describe any specific goals you have..."
                    value={preferences.customGoal || ''}
                    onChange={(e) => updatePreferences({ customGoal: e.target.value })}
                    className="bg-catppuccin-surface1 border-catppuccin-surface2"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Study Schedule */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    How much time can you dedicate?
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    This helps us set realistic expectations and reminders
                  </p>
                </div>

                <div className="space-y-3">
                  {STUDY_SCHEDULES.map((schedule) => (
                    <Card
                      key={schedule.id}
                      className={`cursor-pointer transition-all border-2 ${
                        preferences.studySchedule === schedule.id
                          ? 'border-catppuccin-purple bg-catppuccin-purple/10'
                          : 'border-catppuccin-surface2 hover:border-catppuccin-purple/50'
                      }`}
                      onClick={() => updatePreferences({ studySchedule: schedule.id })}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-catppuccin-foreground">{schedule.label}</h4>
                            <p className="text-sm text-catppuccin-overlay1 mt-1">{schedule.description}</p>
                          </div>
                          <Badge variant="outline" className="border-catppuccin-surface2 text-catppuccin-overlay1">
                            {schedule.time}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Final Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle2 className="h-16 w-16 text-catppuccin-green mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-catppuccin-foreground mb-2">
                    Almost there, {preferences.name}!
                  </h3>
                  <p className="text-catppuccin-overlay1">
                    Let's wrap up with a few final preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-catppuccin-overlay1 mb-2 block">
                      Topics you want to focus on (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOPIC_AREAS.map((topic) => (
                        <Badge
                          key={topic}
                          variant={preferences.preferredTopics.includes(topic) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            preferences.preferredTopics.includes(topic)
                              ? 'bg-catppuccin-yellow text-catppuccin-surface0'
                              : 'border-catppuccin-surface2 hover:border-catppuccin-yellow'
                          }`}
                          onClick={() => updatePreferences({ 
                            preferredTopics: toggleArrayItem(preferences.preferredTopics, topic)
                          })}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-catppuccin-overlay1 mb-2 block">
                      What motivates you most?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {MOTIVATIONS.map((motivation) => (
                        <Card
                          key={motivation.id}
                          className={`cursor-pointer transition-all border-2 ${
                            preferences.motivations.includes(motivation.id)
                              ? 'border-catppuccin-pink bg-catppuccin-pink/10'
                              : 'border-catppuccin-surface2 hover:border-catppuccin-pink/50'
                          }`}
                          onClick={() => updatePreferences({ 
                            motivations: toggleArrayItem(preferences.motivations, motivation.id)
                          })}
                        >
                          <CardContent className="p-3 flex items-center space-x-2">
                            <div className="text-catppuccin-pink">{motivation.icon}</div>
                            <span className="text-sm font-medium text-catppuccin-foreground">{motivation.label}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-catppuccin-surface1">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
              >
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    Complete Setup <Rocket className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}