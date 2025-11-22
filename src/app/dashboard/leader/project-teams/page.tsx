"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Target,
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  MoreHorizontal,
  Eye,
  Edit3,
  Download,
  Mail,
  Plus,
  BarChart3,
  Star,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "leader" | "developer" | "designer" | "researcher";
  avatar?: string;
  tasksCompleted: number;
  totalTasks: number;
  lastActive: string;
}

interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
}

interface ProjectTeam {
  id: string;
  name: string;
  project: {
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    deadline: string;
  };
  members: TeamMember[];
  tasks: ProjectTask[];
  status: "active" | "paused" | "completed" | "behind";
  progress: number;
  startDate: string;
  lastUpdated: string;
  milestones: {
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

const dummyTeams: ProjectTeam[] = [
  {
    id: "t1",
    name: "Team Alpha",
    project: {
      id: "p1",
      title: "E-commerce Platform",
      description: "Build a full-stack e-commerce application with user authentication, product catalog, and payment integration.",
      difficulty: "intermediate",
      deadline: "2025-03-15"
    },
    status: "active",
    progress: 65,
    startDate: "2025-01-10",
    lastUpdated: "2025-01-28",
    members: [
      {
        id: "m1",
        name: "Alice Johnson",
        email: "alice.johnson@university.edu",
        role: "leader",
        tasksCompleted: 8,
        totalTasks: 10,
        lastActive: "2025-01-28T14:30:00Z"
      },
      {
        id: "m2",
        name: "Bob Smith",
        email: "bob.smith@university.edu",
        role: "developer",
        tasksCompleted: 6,
        totalTasks: 8,
        lastActive: "2025-01-28T13:45:00Z"
      },
      {
        id: "m3",
        name: "Carol Davis",
        email: "carol.davis@university.edu",
        role: "designer",
        tasksCompleted: 7,
        totalTasks: 7,
        lastActive: "2025-01-28T12:15:00Z"
      },
      {
        id: "m4",
        name: "David Wilson",
        email: "david.wilson@university.edu",
        role: "developer",
        tasksCompleted: 5,
        totalTasks: 8,
        lastActive: "2025-01-27T16:20:00Z"
      }
    ],
    tasks: [
      {
        id: "task1",
        title: "User Authentication System",
        assignee: "Alice Johnson",
        status: "completed",
        priority: "high",
        dueDate: "2025-01-20",
        estimatedHours: 20,
        actualHours: 18
      },
      {
        id: "task2",
        title: "Product Catalog Design",
        assignee: "Carol Davis",
        status: "completed",
        priority: "medium",
        dueDate: "2025-01-25",
        estimatedHours: 15,
        actualHours: 14
      },
      {
        id: "task3",
        title: "Shopping Cart Implementation",
        assignee: "Bob Smith",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-02-05",
        estimatedHours: 25
      },
      {
        id: "task4",
        title: "Payment Gateway Integration",
        assignee: "David Wilson",
        status: "todo",
        priority: "high",
        dueDate: "2025-02-15",
        estimatedHours: 30
      },
      {
        id: "task5",
        title: "Admin Dashboard",
        assignee: "Alice Johnson",
        status: "review",
        priority: "medium",
        dueDate: "2025-02-10",
        estimatedHours: 18,
        actualHours: 20
      }
    ],
    milestones: [
      { title: "Project Kickoff", dueDate: "2025-01-15", completed: true },
      { title: "UI/UX Design Completion", dueDate: "2025-01-30", completed: true },
      { title: "Core Features Implementation", dueDate: "2025-02-20", completed: false },
      { title: "Testing & QA", dueDate: "2025-03-05", completed: false },
      { title: "Project Delivery", dueDate: "2025-03-15", completed: false }
    ]
  },
  {
    id: "t2",
    name: "Data Science Team",
    project: {
      id: "p2",
      title: "Machine Learning Model",
      description: "Develop a predictive model for student performance analysis using machine learning algorithms.",
      difficulty: "advanced",
      deadline: "2025-04-01"
    },
    status: "active",
    progress: 40,
    startDate: "2025-01-12",
    lastUpdated: "2025-01-28",
    members: [
      {
        id: "m5",
        name: "Eva Brown",
        email: "eva.brown@university.edu",
        role: "leader",
        tasksCompleted: 5,
        totalTasks: 8,
        lastActive: "2025-01-28T11:30:00Z"
      },
      {
        id: "m6",
        name: "Frank Miller",
        email: "frank.miller@university.edu",
        role: "researcher",
        tasksCompleted: 4,
        totalTasks: 6,
        lastActive: "2025-01-28T10:15:00Z"
      }
    ],
    tasks: [
      {
        id: "task6",
        title: "Data Collection & Cleaning",
        assignee: "Frank Miller",
        status: "completed",
        priority: "medium",
        dueDate: "2025-01-25",
        estimatedHours: 25,
        actualHours: 28
      },
      {
        id: "task7",
        title: "Exploratory Data Analysis",
        assignee: "Eva Brown",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-02-10",
        estimatedHours: 20
      },
      {
        id: "task8",
        title: "Model Selection & Training",
        assignee: "Eva Brown",
        status: "todo",
        priority: "high",
        dueDate: "2025-03-01",
        estimatedHours: 35
      }
    ],
    milestones: [
      { title: "Data Preparation", dueDate: "2025-01-25", completed: true },
      { title: "EDA Completion", dueDate: "2025-02-10", completed: false },
      { title: "Model Development", dueDate: "2025-03-15", completed: false },
      { title: "Model Evaluation", dueDate: "2025-03-25", completed: false },
      { title: "Final Report", dueDate: "2025-04-01", completed: false }
    ]
  },
  {
    id: "t3",
    name: "Mobile Dev Crew",
    project: {
      id: "p3",
      title: "Mobile Task Manager",
      description: "Create a cross-platform mobile application for task management with real-time synchronization.",
      difficulty: "intermediate",
      deadline: "2025-03-20"
    },
    status: "behind",
    progress: 25,
    startDate: "2025-01-15",
    lastUpdated: "2025-01-27",
    members: [
      {
        id: "m7",
        name: "Grace Lee",
        email: "grace.lee@university.edu",
        role: "leader",
        tasksCompleted: 3,
        totalTasks: 8,
        lastActive: "2025-01-27T15:45:00Z"
      },
      {
        id: "m8",
        name: "Henry Zhang",
        email: "henry.zhang@university.edu",
        role: "developer",
        tasksCompleted: 2,
        totalTasks: 6,
        lastActive: "2025-01-26T11:20:00Z"
      }
    ],
    tasks: [
      {
        id: "task9",
        title: "UI Design System",
        assignee: "Grace Lee",
        status: "in-progress",
        priority: "medium",
        dueDate: "2025-02-05",
        estimatedHours: 20
      },
      {
        id: "task10",
        title: "Backend API Setup",
        assignee: "Henry Zhang",
        status: "todo",
        priority: "high",
        dueDate: "2025-02-15",
        estimatedHours: 25
      }
    ],
    milestones: [
      { title: "Design System", dueDate: "2025-02-05", completed: false },
      { title: "Backend Setup", dueDate: "2025-02-15", completed: false },
      { title: "Core Features", dueDate: "2025-03-01", completed: false },
      { title: "Testing & Polish", dueDate: "2025-03-15", completed: false }
    ]
  }
];

export default function ProjectTeamsPage() {
  const [teams, setTeams] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<ProjectTeam | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setTeams(dummyTeams);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ProjectTeam["status"]) => {
    switch (status) {
      case "active": return <PlayCircle className="h-4 w-4 text-green-600" />;
      case "paused": return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case "completed": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case "behind": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ProjectTeam["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "paused": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "behind": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: ProjectTeam["project"]["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: ProjectTask["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "todo": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  const overallStats = {
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === "active").length,
    behindSchedule: teams.filter(t => t.status === "behind").length,
    totalMembers: teams.reduce((acc, team) => acc + team.members.length, 0),
    averageProgress: teams.reduce((acc, team) => acc + team.progress, 0) / teams.length
  };

  if (loading) {
    return (
      <DashboardLayout user={user} loading={true}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} loading={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Teams</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all active project teams</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Reports
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Team
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalTeams}</div>
              <p className="text-xs text-gray-600">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalMembers}</div>
              <p className="text-xs text-gray-600">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageProgress.toFixed(0)}%</div>
              <p className="text-xs text-gray-600">Overall completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Behind Schedule</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.behindSchedule}</div>
              <p className="text-xs text-gray-600">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search teams or projects..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("paused")}>Paused</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("behind")}>Behind Schedule</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredTeams.length} teams</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTeams.map(team => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={getStatusColor(team.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(team.status)}
                          {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                        </span>
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(team.project.difficulty)}>
                        {team.project.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {team.project.title}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Team
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Project Progress</span>
                    <span className="text-sm font-bold text-gray-900">{team.progress}%</span>
                  </div>
                  <Progress value={team.progress} className={getProgressColor(team.progress)} />
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Team Members</span>
                    <Badge variant="outline">{team.members.length} members</Badge>
                  </div>
                  <div className="flex -space-x-2">
                    {team.members.map(member => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center text-blue-600 text-xs font-medium tooltip"
                        title={`${member.name} (${member.role})`}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {team.tasks.filter(t => t.status === "completed").length}
                    </div>
                    <div className="text-xs text-gray-600">Tasks Done</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {calculateDaysUntilDeadline(team.project.deadline)}
                    </div>
                    <div className="text-xs text-gray-600">Days Left</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {team.milestones.filter(m => m.completed).length}/{team.milestones.length}
                    </div>
                    <div className="text-xs text-gray-600">Milestones</div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Recent Tasks</span>
                  </div>
                  <div className="space-y-2">
                    {team.tasks.slice(0, 2).map(task => (
                      <div key={task.id} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{task.title}</span>
                        <Badge variant="secondary" className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teams Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? `No teams found for "${searchTerm}"` : "No project teams match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}