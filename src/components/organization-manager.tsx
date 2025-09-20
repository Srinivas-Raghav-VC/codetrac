import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Building2, 
  Users, 
  Crown, 
  Shield, 
  Plus, 
  Settings, 
  BarChart3,
  GraduationCap,
  Trophy,
  Target,
  Calendar,
  UserPlus,
  Mail,
  Globe,
  Lock,
  Eye,
  UserCheck,
  MessageSquare,
  Award,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Problem as ApiProblem } from "../utils/api";

interface Organization {
  id: string;
  name: string;
  type: 'university' | 'company' | 'school' | 'club' | 'personal';
  description: string;
  memberCount: number;
  isPublic: boolean;
  logo?: string;
  website?: string;
  location?: string;
  createdAt: string;
  settings: OrganizationSettings;
  subscription: 'free' | 'pro' | 'enterprise';
}

interface OrganizationSettings {
  allowPublicJoin: boolean;
  requireApproval: boolean;
  enableLeaderboards: boolean;
  enableTeamChallenges: boolean;
  customBranding: boolean;
  dataExport: boolean;
  ssoIntegration: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'member' | 'viewer';
  joinedAt: string;
  stats: {
    problemsSolved: number;
    currentStreak: number;
    rank: number;
    badges: string[];
  };
  avatar?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'contest';
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  problems: string[];
  prize?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const SAMPLE_ORGANIZATIONS: Organization[] = [
  {
    id: 'stanford-cs',
    name: 'Stanford Computer Science',
    type: 'university',
    description: 'Competitive programming club for Stanford CS students',
    memberCount: 245,
    isPublic: true,
    website: 'https://cs.stanford.edu',
    location: 'Stanford, CA',
    createdAt: '2024-01-15T10:00:00Z',
    settings: {
      allowPublicJoin: false,
      requireApproval: true,
      enableLeaderboards: true,
      enableTeamChallenges: true,
      customBranding: true,
      dataExport: true,
      ssoIntegration: true
    },
    subscription: 'enterprise'
  },
  {
    id: 'google-dev',
    name: 'Google Developer Community',
    type: 'company',
    description: 'Internal competitive programming group for Google engineers',
    memberCount: 1024,
    isPublic: false,
    website: 'https://developers.google.com',
    location: 'Mountain View, CA',
    createdAt: '2024-01-10T10:00:00Z',
    settings: {
      allowPublicJoin: false,
      requireApproval: true,
      enableLeaderboards: true,
      enableTeamChallenges: true,
      customBranding: true,
      dataExport: true,
      ssoIntegration: true
    },
    subscription: 'enterprise'
  }
];

const SAMPLE_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alice Chen',
    email: 'alice@stanford.edu',
    role: 'admin',
    joinedAt: '2024-01-15T10:00:00Z',
    stats: {
      problemsSolved: 347,
      currentStreak: 15,
      rank: 1,
      badges: ['Top Performer', 'Streak Master', 'Algorithm Expert']
    }
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@stanford.edu',
    role: 'member',
    joinedAt: '2024-01-20T10:00:00Z',
    stats: {
      problemsSolved: 189,
      currentStreak: 7,
      rank: 5,
      badges: ['Rising Star', 'Team Player']
    }
  }
];

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'weekly-contest-1',
    title: 'Weekly Algorithm Challenge #42',
    description: 'Focus on dynamic programming and graph algorithms',
    type: 'individual',
    startDate: '2024-01-22T00:00:00Z',
    endDate: '2024-01-28T23:59:59Z',
    status: 'active',
    participants: 67,
    problems: ['dp-problem-1', 'graph-problem-2'],
    difficulty: 'Intermediate'
  },
  {
    id: 'team-challenge-1',
    title: 'ACM ICPC Preparation',
    description: 'Team-based preparation for upcoming ICPC regionals',
    type: 'team',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-29T23:59:59Z',
    status: 'upcoming',
    participants: 24,
    problems: ['icpc-style-1', 'icpc-style-2'],
    prize: '$500 Amazon Gift Cards',
    difficulty: 'Advanced'
  }
];

interface OrganizationManagerProps {
  problems: ApiProblem[];
  currentUserId: string;
}

export function OrganizationManager({ problems, currentUserId }: OrganizationManagerProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(SAMPLE_ORGANIZATIONS);
  const [members, setMembers] = useState<TeamMember[]>(SAMPLE_MEMBERS);
  const [challenges, setChallenges] = useState<Challenge[]>(SAMPLE_CHALLENGES);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  // Forms
  const [newOrg, setNewOrg] = useState<Partial<Organization>>({
    name: '',
    type: 'club',
    description: '',
    isPublic: true
  });

  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    type: 'individual',
    difficulty: 'Intermediate'
  });

  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateOrganization = () => {
    const org: Organization = {
      id: `org-${Date.now()}`,
      name: newOrg.name || 'New Organization',
      type: newOrg.type || 'club',
      description: newOrg.description || '',
      memberCount: 1,
      isPublic: newOrg.isPublic || false,
      createdAt: new Date().toISOString(),
      settings: {
        allowPublicJoin: true,
        requireApproval: false,
        enableLeaderboards: true,
        enableTeamChallenges: true,
        customBranding: false,
        dataExport: false,
        ssoIntegration: false
      },
      subscription: 'free'
    };

    setOrganizations(prev => [org, ...prev]);
    setCreateOrgOpen(false);
    setNewOrg({ name: '', type: 'club', description: '', isPublic: true });
    toast.success("Organization created successfully!");
  };

  const handleCreateChallenge = () => {
    const challenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: newChallenge.title || 'New Challenge',
      description: newChallenge.description || '',
      type: newChallenge.type || 'individual',
      difficulty: newChallenge.difficulty || 'Intermediate',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      participants: 0,
      problems: []
    };

    setChallenges(prev => [challenge, ...prev]);
    setCreateChallengeOpen(false);
    setNewChallenge({ title: '', description: '', type: 'individual', difficulty: 'Intermediate' });
    toast.success("Challenge created successfully!");
  };

  const handleInviteMember = () => {
    // In real implementation, this would send an email invitation
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteMemberOpen(false);
  };

  const getOrgTypeIcon = (type: Organization['type']) => {
    switch (type) {
      case 'university': return <GraduationCap className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'school': return <GraduationCap className="h-4 w-4" />;
      case 'club': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'free':
        return <Badge variant="outline" className="text-catppuccin-overlay1">Free</Badge>;
      case 'pro':
        return <Badge className="bg-catppuccin-yellow text-catppuccin-surface0">Pro</Badge>;
      case 'enterprise':
        return <Badge className="bg-catppuccin-purple text-catppuccin-surface0">Enterprise</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-catppuccin-blue font-mono">
            <Building2 className="h-6 w-6 inline mr-2" />
            Organizations & Teams
          </h1>
          <p className="text-catppuccin-overlay1">
            Create and manage organizations for collaborative competitive programming
          </p>
        </div>
        <Button 
          onClick={() => setCreateOrgOpen(true)}
          className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card 
            key={org.id}
            className="bg-catppuccin-surface0 border-catppuccin-surface1 hover:border-catppuccin-blue/50 transition-all cursor-pointer"
            onClick={() => setSelectedOrg(org)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getOrgTypeIcon(org.type)}
                    <CardTitle className="font-mono text-base">{org.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSubscriptionBadge(org.subscription)}
                    {org.isPublic ? (
                      <Badge variant="outline" className="text-catppuccin-teal border-catppuccin-teal">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-catppuccin-red border-catppuccin-red">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-catppuccin-overlay1 line-clamp-2">
                {org.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-catppuccin-overlay1">
                  <Users className="h-4 w-4" />
                  <span>{org.memberCount} members</span>
                </div>
                <div className="flex items-center space-x-1 text-catppuccin-overlay1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {org.location && (
                <div className="text-xs text-catppuccin-overlay1">
                  📍 {org.location}
                </div>
              )}

              <Button
                size="sm"
                className="w-full bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrg(org);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization Detail Dialog */}
      {selectedOrg && (
        <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
          <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1 max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-catppuccin-blue text-xl flex items-center space-x-2">
                {getOrgTypeIcon(selectedOrg.type)}
                <span>{selectedOrg.name}</span>
                {getSubscriptionBadge(selectedOrg.subscription)}
              </DialogTitle>
              <DialogDescription className="text-catppuccin-overlay1">
                {selectedOrg.description}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-catppuccin-surface1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 text-catppuccin-blue mx-auto mb-2" />
                      <div className="text-xl font-bold text-catppuccin-blue">{selectedOrg.memberCount}</div>
                      <div className="text-xs text-catppuccin-overlay1">Active Members</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <CardContent className="p-4 text-center">
                      <Target className="h-6 w-6 text-catppuccin-green mx-auto mb-2" />
                      <div className="text-xl font-bold text-catppuccin-green">{challenges.length}</div>
                      <div className="text-xs text-catppuccin-overlay1">Active Challenges</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 text-catppuccin-yellow mx-auto mb-2" />
                      <div className="text-xl font-bold text-catppuccin-yellow">87%</div>
                      <div className="text-xs text-catppuccin-overlay1">Engagement Rate</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-catppuccin-foreground">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded border border-catppuccin-surface2">
                      <UserPlus className="h-4 w-4 text-catppuccin-green" />
                      <span className="text-sm">5 new members joined this week</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded border border-catppuccin-surface2">
                      <Trophy className="h-4 w-4 text-catppuccin-yellow" />
                      <span className="text-sm">Weekly contest completed with 67 participants</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded border border-catppuccin-surface2">
                      <Award className="h-4 w-4 text-catppuccin-purple" />
                      <span className="text-sm">Alice Chen achieved a 15-day solving streak</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-catppuccin-foreground">Team Members</h3>
                  <Button
                    size="sm"
                    onClick={() => setInviteMemberOpen(true)}
                    className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite Member
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <Card key={member.id} className="bg-catppuccin-surface1 border-catppuccin-surface2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-catppuccin-foreground">{member.name}</h4>
                            <p className="text-sm text-catppuccin-overlay1">{member.email}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {member.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                            {member.role === 'moderator' && <Shield className="h-3 w-3 mr-1" />}
                            {member.role}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="font-semibold text-catppuccin-green">{member.stats.problemsSolved}</div>
                            <div className="text-catppuccin-overlay1">Solved</div>
                          </div>
                          <div>
                            <div className="font-semibold text-catppuccin-yellow">{member.stats.currentStreak}</div>
                            <div className="text-catppuccin-overlay1">Streak</div>
                          </div>
                          <div>
                            <div className="font-semibold text-catppuccin-blue">#{member.stats.rank}</div>
                            <div className="text-catppuccin-overlay1">Rank</div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {member.stats.badges.slice(0, 2).map((badge) => (
                              <Badge key={badge} variant="secondary" className="text-xs bg-catppuccin-surface2">
                                {badge}
                              </Badge>
                            ))}
                            {member.stats.badges.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{member.stats.badges.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-catppuccin-foreground">Organization Challenges</h3>
                  <Button
                    size="sm"
                    onClick={() => setCreateChallengeOpen(true)}
                    className="bg-catppuccin-purple hover:bg-catppuccin-purple/80 text-catppuccin-surface0"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Challenge
                  </Button>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className="bg-catppuccin-surface1 border-catppuccin-surface2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-catppuccin-foreground">{challenge.title}</h4>
                            <p className="text-sm text-catppuccin-overlay1 mt-1">{challenge.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              challenge.status === 'active' ? 'bg-catppuccin-green text-catppuccin-surface0' :
                              challenge.status === 'upcoming' ? 'bg-catppuccin-yellow text-catppuccin-surface0' :
                              'bg-catppuccin-overlay1 text-catppuccin-surface0'
                            }>
                              {challenge.status}
                            </Badge>
                            <Badge variant="outline">{challenge.type}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-semibold text-catppuccin-blue">{challenge.participants}</div>
                            <div className="text-catppuccin-overlay1">Participants</div>
                          </div>
                          <div>
                            <div className="font-semibold text-catppuccin-purple">{challenge.difficulty}</div>
                            <div className="text-catppuccin-overlay1">Difficulty</div>
                          </div>
                          <div>
                            <div className="font-semibold text-catppuccin-green">
                              {new Date(challenge.startDate).toLocaleDateString()}
                            </div>
                            <div className="text-catppuccin-overlay1">Start Date</div>
                          </div>
                          <div>
                            <div className="font-semibold text-catppuccin-red">
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </div>
                            <div className="text-catppuccin-overlay1">End Date</div>
                          </div>
                        </div>

                        {challenge.prize && (
                          <div className="mt-3 p-2 bg-catppuccin-surface2 rounded">
                            <div className="text-sm font-semibold text-catppuccin-yellow">
                              🏆 Prize: {challenge.prize}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <h3 className="font-semibold text-catppuccin-foreground">Organization Leaderboard</h3>
                
                <div className="space-y-2">
                  {members
                    .sort((a, b) => a.stats.rank - b.stats.rank)
                    .map((member, index) => (
                    <Card key={member.id} className="bg-catppuccin-surface1 border-catppuccin-surface2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0 ? 'bg-catppuccin-yellow text-catppuccin-surface0' :
                              index === 1 ? 'bg-catppuccin-overlay1 text-catppuccin-surface0' :
                              index === 2 ? 'bg-catppuccin-purple text-catppuccin-surface0' :
                              'bg-catppuccin-surface2 text-catppuccin-overlay1'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-catppuccin-foreground">{member.name}</h4>
                              <div className="text-sm text-catppuccin-overlay1">
                                {member.stats.problemsSolved} problems solved • {member.stats.currentStreak} day streak
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-catppuccin-blue">
                              {member.stats.problemsSolved * 10} pts
                            </div>
                            <div className="text-xs text-catppuccin-overlay1">Total Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <h3 className="font-semibold text-catppuccin-foreground">Organization Settings</h3>
                
                <div className="space-y-4">
                  <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <CardHeader>
                      <CardTitle className="text-base">Access Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Allow Public Join</div>
                          <div className="text-sm text-catppuccin-overlay1">Let anyone join without invitation</div>
                        </div>
                        <input type="checkbox" checked={selectedOrg.settings.allowPublicJoin} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Require Approval</div>
                          <div className="text-sm text-catppuccin-overlay1">Admin approval required for new members</div>
                        </div>
                        <input type="checkbox" checked={selectedOrg.settings.requireApproval} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <CardHeader>
                      <CardTitle className="text-base">Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Enable Leaderboards</div>
                          <div className="text-sm text-catppuccin-overlay1">Show member rankings and stats</div>
                        </div>
                        <input type="checkbox" checked={selectedOrg.settings.enableLeaderboards} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Team Challenges</div>
                          <div className="text-sm text-catppuccin-overlay1">Allow creation of team-based challenges</div>
                        </div>
                        <input type="checkbox" checked={selectedOrg.settings.enableTeamChallenges} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Organization Dialog */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Create Organization</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Set up your organization for collaborative competitive programming
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name</label>
              <Input
                placeholder="Enter organization name..."
                value={newOrg.name}
                onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select 
                value={newOrg.type} 
                onValueChange={(value: any) => setNewOrg(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your organization..."
                value={newOrg.description}
                onChange={(e) => setNewOrg(prev => ({ ...prev, description: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newOrg.isPublic || false}
                onChange={(e) => setNewOrg(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
              <label htmlFor="isPublic" className="text-sm">
                Make this organization public
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCreateOrgOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrganization}
              disabled={!newOrg.name}
              className="bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
            >
              Create Organization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteMemberOpen} onOpenChange={setInviteMemberOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-blue">Invite Team Member</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setInviteMemberOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteMember}
              disabled={!inviteEmail}
              className="bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Dialog */}
      <Dialog open={createChallengeOpen} onOpenChange={setCreateChallengeOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-purple">Create Challenge</DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              Create a new challenge for your organization members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Challenge Title</label>
              <Input
                placeholder="Enter challenge title..."
                value={newChallenge.title}
                onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the challenge..."
                value={newChallenge.description}
                onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                className="bg-catppuccin-surface1 border-catppuccin-surface2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newChallenge.type} 
                  onValueChange={(value: any) => setNewChallenge(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="contest">Contest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select 
                  value={newChallenge.difficulty} 
                  onValueChange={(value: any) => setNewChallenge(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-catppuccin-surface1 border-catppuccin-surface2">
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCreateChallengeOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChallenge}
              disabled={!newChallenge.title}
              className="bg-catppuccin-purple hover:bg-catppuccin-purple/80 text-catppuccin-surface0"
            >
              Create Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}