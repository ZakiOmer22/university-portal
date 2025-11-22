"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  UserMinus,
  Shuffle,
  Save,
  Download,
  Mail,
  Settings,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Clock,
  BookOpen,
  Star,
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  grade: number;
  attendance: number;
  isSelected: boolean;
  currentGroup?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  requiredSkills: string[];
  maxGroupSize: number;
  minGroupSize: number;
}

interface Group {
  id: string;
  name: string;
  projectId: string;
  students: Student[];
  status: "draft" | "finalized";
  created: string;
}

const dummyStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    skills: ["JavaScript", "React", "UI/UX Design"],
    grade: 92,
    attendance: 95,
    isSelected: false
  },
  {
    id: "s2",
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    grade: 78,
    attendance: 82,
    isSelected: false
  },
  {
    id: "s3",
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    skills: ["Java", "Spring Boot", "Database Design"],
    grade: 85,
    attendance: 88,
    isSelected: false
  },
  {
    id: "s4",
    name: "David Wilson",
    email: "david.wilson@university.edu",
    skills: ["C++", "Algorithms", "System Design"],
    grade: 96,
    attendance: 100,
    isSelected: false
  },
  {
    id: "s5",
    name: "Eva Brown",
    email: "eva.brown@university.edu",
    skills: ["React", "Node.js", "MongoDB"],
    grade: 88,
    attendance: 90,
    isSelected: false
  },
  {
    id: "s6",
    name: "Frank Miller",
    email: "frank.miller@university.edu",
    skills: ["Python", "Django", "REST APIs"],
    grade: 82,
    attendance: 85,
    isSelected: false
  },
  {
    id: "s7",
    name: "Grace Lee",
    email: "grace.lee@university.edu",
    skills: ["UI/UX Design", "Figma", "Frontend Development"],
    grade: 91,
    attendance: 94,
    isSelected: false
  },
  {
    id: "s8",
    name: "Henry Zhang",
    email: "henry.zhang@university.edu",
    skills: ["Machine Learning", "TensorFlow", "Data Science"],
    grade: 89,
    attendance: 87,
    isSelected: false
  },
  {
    id: "s9",
    name: "Ivy Patel",
    email: "ivy.patel@university.edu",
    skills: ["React Native", "Mobile Development", "Firebase"],
    grade: 84,
    attendance: 89,
    isSelected: false
  },
  {
    id: "s10",
    name: "Jack Wilson",
    email: "jack.wilson@university.edu",
    skills: ["DevOps", "Docker", "AWS"],
    grade: 87,
    attendance: 92,
    isSelected: false
  }
];

const dummyProjects: Project[] = [
  {
    id: "p1",
    title: "E-commerce Platform",
    description: "Build a full-stack e-commerce application with user authentication, product catalog, and payment integration.",
    difficulty: "intermediate",
    requiredSkills: ["React", "Node.js", "Database Design"],
    maxGroupSize: 4,
    minGroupSize: 3
  },
  {
    id: "p2",
    title: "Machine Learning Model",
    description: "Develop a predictive model for student performance analysis using machine learning algorithms.",
    difficulty: "advanced",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis"],
    maxGroupSize: 3,
    minGroupSize: 2
  },
  {
    id: "p3",
    title: "Mobile Task Manager",
    description: "Create a cross-platform mobile application for task management with real-time synchronization.",
    difficulty: "intermediate",
    requiredSkills: ["React Native", "Firebase", "UI/UX Design"],
    maxGroupSize: 4,
    minGroupSize: 2
  },
  {
    id: "p4",
    title: "University Portal Redesign",
    description: "Redesign the student portal interface with improved user experience and accessibility features.",
    difficulty: "beginner",
    requiredSkills: ["UI/UX Design", "Figma", "Frontend Development"],
    maxGroupSize: 5,
    minGroupSize: 3
  }
];

const dummyGroups: Group[] = [
  {
    id: "g1",
    name: "Team Alpha",
    projectId: "p1",
    students: [dummyStudents[0], dummyStudents[1], dummyStudents[2]],
    status: "finalized",
    created: "2025-01-10T14:30:00Z"
  },
  {
    id: "g2",
    name: "Data Science Team",
    projectId: "p2",
    students: [dummyStudents[3], dummyStudents[4]],
    status: "finalized",
    created: "2025-01-12T10:15:00Z"
  }
];

export default function GroupAssemblePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [groupName, setGroupName] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "groups">("students");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setStudents(dummyStudents);
      setProjects(dummyProjects);
      setGroups(dummyGroups);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleStudentSelection = (studentId: string) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId 
        ? { ...student, isSelected: !student.isSelected }
        : student
    ));
  };

  const selectAllStudents = () => {
    setStudents(prev => prev.map(student => ({ ...student, isSelected: true })));
  };

  const clearSelection = () => {
    setStudents(prev => prev.map(student => ({ ...student, isSelected: false })));
  };

  const getSelectedCount = () => students.filter(s => s.isSelected).length;

  const createGroup = () => {
    if (!selectedProject || getSelectedCount() === 0) return;

    const selectedStudentList = students.filter(s => s.isSelected);
    
    // Validate group size
    if (selectedStudentList.length < selectedProject.minGroupSize) {
      alert(`Minimum group size for this project is ${selectedProject.minGroupSize}`);
      return;
    }
    
    if (selectedStudentList.length > selectedProject.maxGroupSize) {
      alert(`Maximum group size for this project is ${selectedProject.maxGroupSize}`);
      return;
    }

    const newGroup: Group = {
      id: `g${groups.length + 1}`,
      name: groupName || `Team ${String.fromCharCode(65 + groups.length)}`,
      projectId: selectedProject.id,
      students: selectedStudentList,
      status: "draft",
      created: new Date().toISOString()
    };

    setGroups(prev => [...prev, newGroup]);
    clearSelection();
    setGroupName("");
    setSelectedProject(null);
  };

  const autoAssignGroups = () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    const availableStudents = students.filter(s => !s.isSelected);
    const groupSize = Math.floor(availableStudents.length / selectedProject.maxGroupSize);
    
    if (groupSize < selectedProject.minGroupSize) {
      alert("Not enough students for auto-assignment");
      return;
    }

    // Simple auto-assignment logic (shuffle and split)
    const shuffled = [...availableStudents].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += selectedProject.maxGroupSize) {
      const groupStudents = shuffled.slice(i, i + selectedProject.maxGroupSize);
      if (groupStudents.length >= selectedProject.minGroupSize) {
        newGroups.push({
          id: `g${groups.length + newGroups.length + 1}`,
          name: `Team ${String.fromCharCode(65 + groups.length + newGroups.length)}`,
          projectId: selectedProject.id,
          students: groupStudents,
          status: "draft",
          created: new Date().toISOString()
        });
      }
    }

    setGroups(prev => [...prev, ...newGroups]);
  };

  const finalizeGroup = (groupId: string) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, status: "finalized" } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getDifficultyColor = (difficulty: Project["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Assemble Groups</h1>
            <p className="text-gray-600 mt-1">Create and manage project teams for your class</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4" />
              Notify Students
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("students")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students & Projects
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">
                  {students.length}
                </Badge>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "groups"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Groups
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
                  {groups.length}
                </Badge>
              </span>
            </button>
          </nav>
        </div>

        {activeTab === "students" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Available Projects</CardTitle>
                <CardDescription>Select a project for group assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProject?.id === project.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <Badge variant="secondary" className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Group size: {project.minGroupSize}-{project.maxGroupSize}</span>
                        <span>{project.requiredSkills.length} skills</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Students Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Student Roster</CardTitle>
                    <CardDescription>
                      {getSelectedCount()} of {students.length} students selected
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllStudents}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      <UserMinus className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, email, or skills..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-4 p-3 border rounded-lg transition-all ${
                        student.isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={student.isSelected}
                        onCheckedChange={() => toggleStudentSelection(student.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {student.grade}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{student.email}</p>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {student.attendance}%
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No students found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Group Creation Panel */}
            {selectedProject && (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Create New Group</CardTitle>
                  <CardDescription>
                    Assign selected students to &quot;{selectedProject.title} &quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Name
                      </label>
                      <Input
                        placeholder="Enter group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Selected Students:</span>
                        <span className="font-semibold">{getSelectedCount()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Required Group Size:</span>
                        <span>
                          {selectedProject.minGroupSize}-{selectedProject.maxGroupSize}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Status:</span>
                        <Badge variant={
                          getSelectedCount() >= selectedProject.minGroupSize && 
                          getSelectedCount() <= selectedProject.maxGroupSize
                            ? "default"
                            : "destructive"
                        }>
                          {getSelectedCount() < selectedProject.minGroupSize && "Too Small"}
                          {getSelectedCount() > selectedProject.maxGroupSize && "Too Large"}
                          {getSelectedCount() >= selectedProject.minGroupSize && 
                           getSelectedCount() <= selectedProject.maxGroupSize && "Valid"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={createGroup}
                      disabled={
                        getSelectedCount() < selectedProject.minGroupSize ||
                        getSelectedCount() > selectedProject.maxGroupSize
                      }
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Create Group
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={autoAssignGroups}
                      className="flex items-center gap-2"
                    >
                      <Shuffle className="h-4 w-4" />
                      Auto-Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Groups Tab */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map(group => {
                const project = getProjectById(group.projectId);
                return (
                  <Card key={group.id} className="relative">
                    {group.status === "draft" && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Draft
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{group.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => finalizeGroup(group.id)}>
                              <Save className="h-4 w-4 mr-2" />
                              Finalize
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardTitle>
                      <CardDescription>
                        {project?.title} • {group.students.length} members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {group.students.map(student => (
                          <div key={student.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-600">Grade: {student.grade}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600">
                          Created {new Date(group.created).toLocaleDateString()}
                        </div>
                        <Button 
                          size="sm" 
                          variant={group.status === "finalized" ? "default" : "outline"}
                          onClick={() => finalizeGroup(group.id)}
                        >
                          {group.status === "finalized" ? "Finalized" : "Finalize"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {groups.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Created</h3>
                  <p className="text-gray-600 mb-4">
                    Start by selecting students and a project to create your first group.
                  </p>
                  <Button onClick={() => setActiveTab("students")}>
                    <Users className="h-4 w-4 mr-2" />
                    Go to Students & Projects
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}