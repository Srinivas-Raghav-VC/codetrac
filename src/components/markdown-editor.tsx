import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { 
  Bold, 
  Italic, 
  Code, 
  Link2, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  ChevronDown,
  Type,
  Hash,
  Check,
  X,
  Image,
  Table,
  AlignLeft,
  Save,
  Download,
  Upload,
  Zap,
  Code2
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showPreview?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

interface MarkdownTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  icon: JSX.Element;
}

const MARKDOWN_TEMPLATES: MarkdownTemplate[] = [
  {
    id: 'algorithm-analysis',
    name: 'Algorithm Analysis',
    category: 'Problem Solving',
    description: 'Template for analyzing algorithm complexity',
    icon: <Zap className="h-4 w-4" />,
    content: `# Algorithm Analysis

## Problem Statement
Describe the problem clearly...

## Approach
### Initial Thoughts
- What was your first approach?
- What patterns did you recognize?

### Algorithm Choice
- **Time Complexity**: O(?)
- **Space Complexity**: O(?)
- **Why this approach**: Explain your reasoning

## Implementation
\`\`\`cpp
// Your code here
\`\`\`

## Key Insights
- What did you learn?
- What patterns can you apply elsewhere?

## Common Mistakes
- What mistakes did you make initially?
- What edge cases did you miss?

## Follow-up Problems
- Similar problems to practice
- Variations of this problem`
  },
  {
    id: 'binary-search-template',
    name: 'Binary Search Template',
    category: 'Code Templates',
    description: 'Complete binary search implementation guide',
    icon: <Code2 className="h-4 w-4" />,
    content: `# Binary Search Templates

## Standard Binary Search
\`\`\`cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1; // Not found
}
\`\`\`

## Lower Bound (First Occurrence)
\`\`\`cpp
int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) left = mid + 1;
        else right = mid;
    }
    
    return left;
}
\`\`\`

## Predicate-based Binary Search
\`\`\`cpp
template<typename T>
int binarySearchPredicate(int left, int right, T predicate) {
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (predicate(mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}
\`\`\`

## Key Points
- Always check for integer overflow
- Be careful with boundary conditions
- Predicate function should be monotonic`
  },
  {
    id: 'contest-notes',
    name: 'Contest Notes',
    category: 'Competition',
    description: 'Template for live contest problem-solving',
    icon: <Hash className="h-4 w-4" />,
    content: `# Contest: [Contest Name]
**Date**: ${new Date().toLocaleDateString()}
**Platform**: Codeforces/AtCoder/etc.

## Problem A: [Problem Name]
**Time**: [Start Time - End Time]
**Verdict**: [AC/WA/TLE/etc.]
**Attempts**: [Number of submissions]

### Approach
- Quick description of solution

### Code
\`\`\`cpp
// Final working code
\`\`\`

### Mistakes Made
- What went wrong initially
- Time wasted on wrong approaches

---

## Problem B: [Problem Name]
[Same format as above]

## Contest Summary
- **Problems Solved**: X/Y
- **Final Rank**: #rank
- **Rating Change**: +/-X

### What Went Well
- Fast solve on problem A
- Good pattern recognition

### Areas for Improvement
- Missed edge case in problem C
- Need to practice greedy more`
  },
  {
    id: 'learning-notes',
    name: 'Learning Notes',
    category: 'Study',
    description: 'Template for documenting new concepts',
    icon: <Type className="h-4 w-4" />,
    content: `# [Topic Name] - Learning Notes

## Overview
Brief description of the concept...

## Key Concepts
### Concept 1
Explanation with examples

### Concept 2
More detailed explanation

## Implementation Details
\`\`\`cpp
// Code examples
\`\`\`

## When to Use
- Scenario 1: When you need...
- Scenario 2: Useful for...

## Common Patterns
1. **Pattern Name**: Description
2. **Another Pattern**: Description

## Practice Problems
- [ ] Easy: [Problem name and link]
- [ ] Medium: [Problem name and link]  
- [ ] Hard: [Problem name and link]

## Resources
- [Tutorial Link](url)
- [Video Explanation](url)
- [Practice Platform](url)`
  }
];

const TOOLBAR_ACTIONS = [
  { icon: <Heading1 className="h-4 w-4" />, action: '# ', tooltip: 'Heading 1', shortcut: 'Ctrl+1' },
  { icon: <Heading2 className="h-4 w-4" />, action: '## ', tooltip: 'Heading 2', shortcut: 'Ctrl+2' },
  { icon: <Heading3 className="h-4 w-4" />, action: '### ', tooltip: 'Heading 3', shortcut: 'Ctrl+3' },
  { icon: <Bold className="h-4 w-4" />, action: '**bold**', tooltip: 'Bold', shortcut: 'Ctrl+B', wrap: true },
  { icon: <Italic className="h-4 w-4" />, action: '*italic*', tooltip: 'Italic', shortcut: 'Ctrl+I', wrap: true },
  { icon: <Code className="h-4 w-4" />, action: '`code`', tooltip: 'Inline Code', shortcut: 'Ctrl+`', wrap: true },
  { icon: <Link2 className="h-4 w-4" />, action: '[text](url)', tooltip: 'Link', shortcut: 'Ctrl+K' },
  { icon: <List className="h-4 w-4" />, action: '- ', tooltip: 'Bullet List' },
  { icon: <ListOrdered className="h-4 w-4" />, action: '1. ', tooltip: 'Numbered List' },
  { icon: <Quote className="h-4 w-4" />, action: '> ', tooltip: 'Quote' },
  { icon: <Image className="h-4 w-4" />, action: '![alt](url)', tooltip: 'Image' },
  { icon: <Table className="h-4 w-4" />, action: '| Header | Header |\n|--------|--------|\n| Cell   | Cell   |', tooltip: 'Table' },
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start writing your markdown...",
  minHeight = "200px",
  maxHeight = "600px",
  showToolbar = true,
  showPreview = true,
  isFullscreen = false,
  onToggleFullscreen,
  className = ""
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("edit");
  const [isMinimized, setIsMinimized] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string, wrap = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    if (wrap && selectedText) {
      // For wrapping actions like bold, italic
      if (text.includes('**')) {
        newText = `**${selectedText}**`;
      } else if (text.includes('*')) {
        newText = `*${selectedText}*`;
      } else if (text.includes('`')) {
        newText = `\`${selectedText}\``;
      } else {
        newText = text.replace(/\w+/, selectedText);
      }
    } else {
      newText = text;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      if (wrap && selectedText) {
        textarea.setSelectionRange(start, start + newText.length);
      } else {
        const newCursorPos = start + newText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertTemplate = (template: MarkdownTemplate) => {
    onChange(template.content);
    setTemplatesOpen(false);
    textareaRef.current?.focus();
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for preview
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-2 text-catppuccin-blue">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-catppuccin-green">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-catppuccin-yellow">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-catppuccin-blue">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-catppuccin-purple">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-catppuccin-surface1 px-1 py-0.5 rounded text-catppuccin-pink font-mono text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-catppuccin-blue hover:text-catppuccin-purple underline">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-catppuccin-blue pl-4 py-2 bg-catppuccin-surface1 rounded-r text-catppuccin-overlay2">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="list-disc ml-4 mb-1 text-catppuccin-foreground">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="list-decimal ml-4 mb-1 text-catppuccin-foreground">$1</li>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-catppuccin-surface1 p-4 rounded mt-2 mb-2 overflow-x-auto"><code class="text-catppuccin-green font-mono text-sm">$2</code></pre>')
      .replace(/\n/g, '<br/>');
  };

  const editorHeight = isMinimized ? "60px" : isFullscreen ? "calc(100vh - 200px)" : maxHeight;

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''} bg-catppuccin-surface0 border-catppuccin-surface1`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-catppuccin-blue font-mono flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Markdown Editor</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Templates Dropdown */}
            <Popover open={templatesOpen} onOpenChange={setTemplatesOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
                >
                  Templates <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-catppuccin-surface0 border-catppuccin-surface1" align="end">
                <Command className="bg-catppuccin-surface0">
                  <CommandInput placeholder="Search templates..." className="bg-catppuccin-surface1" />
                  <CommandList>
                    <CommandEmpty>No templates found.</CommandEmpty>
                    {['Problem Solving', 'Code Templates', 'Competition', 'Study'].map((category) => (
                      <CommandGroup key={category} heading={category} className="text-catppuccin-overlay1">
                        {MARKDOWN_TEMPLATES.filter(t => t.category === category).map((template) => (
                          <CommandItem
                            key={template.id}
                            onSelect={() => insertTemplate(template)}
                            className="cursor-pointer hover:bg-catppuccin-surface1"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              {template.icon}
                              <div className="flex-1">
                                <div className="font-medium text-catppuccin-foreground">{template.name}</div>
                                <div className="text-xs text-catppuccin-overlay1">{template.description}</div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-catppuccin-surface1"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>

            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="hover:bg-catppuccin-surface1"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        {showToolbar && !isMinimized && (
          <div className="flex flex-wrap gap-1 pt-2">
            {TOOLBAR_ACTIONS.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => insertText(action.action, action.wrap)}
                className="hover:bg-catppuccin-surface1 p-2"
                title={`${action.tooltip} ${action.shortcut || ''}`}
              >
                {action.icon}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          {showPreview ? (
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
              <div className="border-t border-catppuccin-surface1">
                <TabsList className="bg-catppuccin-surface1 grid grid-cols-3 w-full rounded-none h-10">
                  <TabsTrigger 
                    value="edit" 
                    className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview"
                    className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="split"
                    className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
                  >
                    <AlignLeft className="h-4 w-4 mr-1" />
                    Split
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="m-0">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="resize-none border-0 rounded-none bg-catppuccin-surface0 focus:ring-0 font-mono text-sm"
                  style={{ height: editorHeight, minHeight }}
                />
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <div 
                  className="p-4 overflow-y-auto bg-catppuccin-surface0 font-mono text-sm"
                  style={{ height: editorHeight, minHeight }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-catppuccin-overlay1">Nothing to preview...</p>' }}
                />
              </TabsContent>

              <TabsContent value="split" className="m-0">
                <div className="grid grid-cols-2 h-full">
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="resize-none border-0 border-r border-catppuccin-surface1 rounded-none bg-catppuccin-surface0 focus:ring-0 font-mono text-sm"
                    style={{ height: editorHeight, minHeight }}
                  />
                  <div 
                    className="p-4 overflow-y-auto bg-catppuccin-surface0 font-mono text-sm"
                    style={{ height: editorHeight, minHeight }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-catppuccin-overlay1">Nothing to preview...</p>' }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="resize-none border-0 rounded-none bg-catppuccin-surface0 focus:ring-0 font-mono text-sm"
              style={{ height: editorHeight, minHeight }}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}