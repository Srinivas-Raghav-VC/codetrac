import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  Brain, 
  Clock, 
  Trophy, 
  Calendar,
  Download,
  Share,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Globe,
  School,
  Building2,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  Star,
  Flame,
  Award,
  TrendingDown
} from "lucide-react";
import { Problem as ApiProblem } from "../utils/api";

interface AnalyticsData {
  userGrowth: { month: string; users: number; active: number }[];
  problemStats: { difficulty: string; count: number; solved: number }[];
  platformUsage: { platform: string; users: number; problems: number }[];
  topicDistribution: { topic: string; problems: number; popularity: number }[];
  engagementMetrics: { metric: string; value: number; change: number }[];
  performanceData: { date: string; avgTime: number; accuracy: number; satisfaction: number }[];
  organizationStats: { type: string; count: number; growth: number }[];
  globalRankings: { rank: number; name: string; score: number; country: string; university?: string }[];
}

const SAMPLE_DATA: AnalyticsData = {
  userGrowth: [
    { month: 'Jan', users: 1200, active: 890 },
    { month: 'Feb', users: 1580, active: 1120 },
    { month: 'Mar', users: 2100, active: 1450 },
    { month: 'Apr', users: 2890, active: 1980 },
    { month: 'May', users: 3650, active: 2540 },
    { month: 'Jun', users: 4320, active: 3100 }
  ],
  problemStats: [
    { difficulty: 'Easy', count: 1200, solved: 1050 },
    { difficulty: 'Medium', count: 2400, solved: 1680 },
    { difficulty: 'Hard', count: 800, solved: 320 }
  ],
  platformUsage: [
    { platform: 'Codeforces', users: 2500, problems: 1800 },
    { platform: 'LeetCode', users: 2100, problems: 1500 },
    { platform: 'AtCoder', users: 890, problems: 600 },
    { platform: 'CodeChef', users: 1200, problems: 900 },
    { platform: 'HackerRank', users: 1500, problems: 1100 }
  ],
  topicDistribution: [
    { topic: 'Dynamic Programming', problems: 450, popularity: 85 },
    { topic: 'Graphs', problems: 380, popularity: 78 },
    { topic: 'Greedy', problems: 320, popularity: 72 },
    { topic: 'Trees', problems: 290, popularity: 68 },
    { topic: 'Arrays', problems: 520, popularity: 90 },
    { topic: 'Strings', problems: 280, popularity: 65 }
  ],
  engagementMetrics: [
    { metric: 'Daily Active Users', value: 3100, change: 15.2 },
    { metric: 'Session Duration', value: 45, change: 8.5 },
    { metric: 'Problems Per User', value: 12.3, change: -2.1 },
    { metric: 'Retention Rate', value: 78, change: 5.8 },
    { metric: 'Community Posts', value: 156, change: 23.4 },
    { metric: 'Response Rate', value: 87, change: 3.2 }
  ],
  performanceData: [
    { date: '2024-01', avgTime: 35, accuracy: 72, satisfaction: 8.2 },
    { date: '2024-02', avgTime: 32, accuracy: 75, satisfaction: 8.4 },
    { date: '2024-03', avgTime: 30, accuracy: 78, satisfaction: 8.6 },
    { date: '2024-04', avgTime: 28, accuracy: 80, satisfaction: 8.8 },
    { date: '2024-05', avgTime: 26, accuracy: 82, satisfaction: 9.0 },
    { date: '2024-06', avgTime: 25, accuracy: 85, satisfaction: 9.2 }
  ],
  organizationStats: [
    { type: 'Universities', count: 245, growth: 18.5 },
    { type: 'Companies', count: 156, growth: 25.3 },
    { type: 'Schools', count: 89, growth: 12.7 },
    { type: 'Clubs', count: 312, growth: 31.2 }
  ],
  globalRankings: [
    { rank: 1, name: 'Alex Chen', score: 3247, country: 'USA', university: 'MIT' },
    { rank: 2, name: 'Maria Rodriguez', score: 3156, country: 'Spain', university: 'UCM' },
    { rank: 3, name: 'Yuki Tanaka', score: 3089, country: 'Japan', university: 'Tokyo Tech' },
    { rank: 4, name: 'David Smith', score: 2945, country: 'UK', university: 'Cambridge' },
    { rank: 5, name: 'Lisa Wang', score: 2889, country: 'Canada', university: 'Waterloo' }
  ]
};

interface AdvancedAnalyticsProps {
  problems: ApiProblem[];
  organizationView?: boolean;
  organizationId?: string;
}

export function AdvancedAnalytics({ 
  problems, 
  organizationView = false, 
  organizationId 
}: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('growth');
  const [viewType, setViewType] = useState('overview');

  const COLORS = [
    'var(--catppuccin-blue)',
    'var(--catppuccin-green)', 
    'var(--catppuccin-yellow)',
    'var(--catppuccin-red)',
    'var(--catppuccin-purple)',
    'var(--catppuccin-pink)',
    'var(--catppuccin-teal)'
  ];

  const exportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      timeRange,
      analytics: SAMPLE_DATA
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codetrac-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <BarChart3 className="h-6 w-6 inline mr-2" />
            {organizationView ? 'Organization Analytics' : 'Platform Analytics'}
          </h1>
          <p className="text-catppuccin-overlay1">
            {organizationView 
              ? 'Detailed insights for your organization\'s performance and engagement'
              : 'Comprehensive analytics and insights for the entire CodeTrac platform'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportData}
            className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-catppuccin-blue mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-blue">4.3K</div>
            <div className="text-xs text-catppuccin-overlay1">Active Users</div>
            <div className="text-xs text-catppuccin-green">+15.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-catppuccin-green mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-green">12.4K</div>
            <div className="text-xs text-catppuccin-overlay1">Problems Solved</div>
            <div className="text-xs text-catppuccin-green">+8.7%</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-catppuccin-yellow mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-yellow">25m</div>
            <div className="text-xs text-catppuccin-overlay1">Avg Session</div>
            <div className="text-xs text-catppuccin-green">+3.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 text-catppuccin-purple mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-purple">85%</div>
            <div className="text-xs text-catppuccin-overlay1">Accuracy Rate</div>
            <div className="text-xs text-catppuccin-green">+2.1%</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Building2 className="h-5 w-5 text-catppuccin-pink mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-pink">802</div>
            <div className="text-xs text-catppuccin-overlay1">Organizations</div>
            <div className="text-xs text-catppuccin-green">+22.3%</div>
          </CardContent>
        </Card>
        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 text-catppuccin-red mx-auto mb-2" />
            <div className="text-lg font-bold text-catppuccin-red">78%</div>
            <div className="text-xs text-catppuccin-overlay1">Retention</div>
            <div className="text-xs text-catppuccin-green">+5.8%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={viewType} onValueChange={setViewType} className="space-y-6">
        <TabsList className="bg-catppuccin-surface0 border border-catppuccin-surface1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-catppuccin-blue" />
                  <span>User Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SAMPLE_DATA.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--catppuccin-surface2)" />
                      <XAxis dataKey="month" stroke="var(--catppuccin-overlay1)" />
                      <YAxis stroke="var(--catppuccin-overlay1)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--catppuccin-surface1)', 
                          border: '1px solid var(--catppuccin-surface2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stackId="1"
                        stroke="var(--catppuccin-blue)" 
                        fill="var(--catppuccin-blue)" 
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="active" 
                        stackId="1"
                        stroke="var(--catppuccin-green)" 
                        fill="var(--catppuccin-green)" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Problem Difficulty Distribution */}
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-catppuccin-purple" />
                  <span>Problem Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SAMPLE_DATA.problemStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="count"
                        nameKey="difficulty"
                      >
                        {SAMPLE_DATA.problemStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--catppuccin-surface1)', 
                          border: '1px solid var(--catppuccin-surface2)',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {SAMPLE_DATA.problemStats.map((item, index) => (
                    <div key={item.difficulty} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-catppuccin-overlay1">{item.difficulty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Usage */}
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-catppuccin-teal" />
                  <span>Platform Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SAMPLE_DATA.platformUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--catppuccin-surface2)" />
                      <XAxis 
                        dataKey="platform" 
                        stroke="var(--catppuccin-overlay1)"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="var(--catppuccin-overlay1)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--catppuccin-surface1)', 
                          border: '1px solid var(--catppuccin-surface2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="users" fill="var(--catppuccin-blue)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Topic Popularity Radar */}
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-catppuccin-pink" />
                  <span>Topic Popularity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={SAMPLE_DATA.topicDistribution}>
                      <PolarGrid gridType="polygon" stroke="var(--catppuccin-surface2)" />
                      <PolarAngleAxis 
                        dataKey="topic" 
                        tick={{ fill: 'var(--catppuccin-overlay1)', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ fill: 'var(--catppuccin-overlay1)', fontSize: 10 }}
                      />
                      <Radar
                        name="Popularity"
                        dataKey="popularity"
                        stroke="var(--catppuccin-purple)"
                        fill="var(--catppuccin-purple)"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_DATA.engagementMetrics.map((metric) => (
              <Card key={metric.metric} className="bg-catppuccin-surface0 border-catppuccin-surface1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-catppuccin-foreground">{metric.metric}</h3>
                    <div className={`flex items-center space-x-1 text-sm ${
                      metric.change >= 0 ? 'text-catppuccin-green' : 'text-catppuccin-red'
                    }`}>
                      {metric.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-catppuccin-blue mb-2">
                    {metric.metric.includes('Rate') || metric.metric.includes('Retention') 
                      ? `${metric.value}%` 
                      : metric.metric.includes('Duration') 
                        ? `${metric.value}m`
                        : metric.value.toLocaleString()
                    }
                  </div>
                  
                  <Progress 
                    value={metric.metric.includes('Rate') || metric.metric.includes('Retention') 
                      ? metric.value 
                      : Math.min((metric.value / 100) * 100, 100)
                    } 
                    className="h-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Trends */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-catppuccin-green" />
                <span>Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SAMPLE_DATA.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--catppuccin-surface2)" />
                    <XAxis dataKey="date" stroke="var(--catppuccin-overlay1)" />
                    <YAxis stroke="var(--catppuccin-overlay1)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--catppuccin-surface1)', 
                        border: '1px solid var(--catppuccin-surface2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="var(--catppuccin-green)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--catppuccin-green)', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="var(--catppuccin-blue)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--catppuccin-blue)', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          {/* Global Rankings */}
          <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-catppuccin-yellow" />
                <span>Global Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAMPLE_DATA.globalRankings.map((user, index) => (
                  <div 
                    key={user.rank}
                    className="flex items-center justify-between p-4 rounded border border-catppuccin-surface2 hover:border-catppuccin-blue/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-catppuccin-yellow text-catppuccin-surface0' :
                        index === 1 ? 'bg-catppuccin-overlay1 text-catppuccin-surface0' :
                        index === 2 ? 'bg-catppuccin-purple text-catppuccin-surface0' :
                        'bg-catppuccin-surface2 text-catppuccin-overlay1'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-catppuccin-foreground">{user.name}</div>
                        <div className="text-sm text-catppuccin-overlay1">
                          {user.university && `${user.university} • `}{user.country}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-catppuccin-blue">{user.score.toLocaleString()}</div>
                      <div className="text-sm text-catppuccin-overlay1">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organization Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-catppuccin-pink" />
                  <span>Organization Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {SAMPLE_DATA.organizationStats.map((org) => (
                    <div key={org.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded bg-catppuccin-surface1">
                          {org.type === 'Universities' && <School className="h-4 w-4 text-catppuccin-blue" />}
                          {org.type === 'Companies' && <Building2 className="h-4 w-4 text-catppuccin-green" />}
                          {org.type === 'Schools' && <School className="h-4 w-4 text-catppuccin-yellow" />}
                          {org.type === 'Clubs' && <Users className="h-4 w-4 text-catppuccin-purple" />}
                        </div>
                        <div>
                          <div className="font-medium text-catppuccin-foreground">{org.type}</div>
                          <div className="text-sm text-catppuccin-overlay1">{org.count} organizations</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-catppuccin-green">+{org.growth}%</div>
                        <div className="text-xs text-catppuccin-overlay1">this month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-catppuccin-teal" />
                  <span>Platform Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-catppuccin-green" />
                      <span className="text-sm">Server Uptime</span>
                    </div>
                    <span className="font-semibold text-catppuccin-green">99.9%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-catppuccin-yellow" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <span className="font-semibold text-catppuccin-yellow">127ms</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-catppuccin-red" />
                      <span className="text-sm">Error Rate</span>
                    </div>
                    <span className="font-semibold text-catppuccin-red">0.03%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-catppuccin-blue" />
                      <span className="text-sm">User Satisfaction</span>
                    </div>
                    <span className="font-semibold text-catppuccin-blue">9.2/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs would have specific filtered content */}
        <TabsContent value="users">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">User Analytics</h3>
            <p>Detailed user behavior, demographics, and engagement metrics</p>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Content Analytics</h3>
            <p>Problem statistics, solution quality, and content performance</p>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="text-center py-12 text-catppuccin-overlay1">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
            <p>System performance, load times, and technical health</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}