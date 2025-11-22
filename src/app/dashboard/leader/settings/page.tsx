"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Download,
  Upload,
  Bell,
  Shield,
  User,
  Mail,
  Lock,
  Globe,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  MoreHorizontal,
  Search,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studentAlerts: boolean;
  assignmentDeadlines: boolean;
  gradeUpdates: boolean;
  meetingReminders: boolean;
  systemUpdates: boolean;
  weeklyDigest: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "colleagues-only";
  showEmail: boolean;
  showPhone: boolean;
  studentDataAccess: "full" | "limited" | "restricted";
  dataRetention: number; // months
  allowDataExport: boolean;
}

interface CourseSettings {
  maxStudents: number;
  allowSelfEnrollment: boolean;
  defaultAttendanceRequired: boolean;
  autoArchiveCompleted: boolean;
  gradingScale: "percentage" | "points" | "letter-grade";
  lateSubmissionPenalty: number;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  joinDate: string;
  lastLogin: string;
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  studentAlerts: true,
  assignmentDeadlines: true,
  gradeUpdates: false,
  meetingReminders: true,
  systemUpdates: true,
  weeklyDigest: true,
};

const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: "colleagues-only",
  showEmail: true,
  showPhone: false,
  studentDataAccess: "full",
  dataRetention: 24,
  allowDataExport: true,
};

const defaultCourseSettings: CourseSettings = {
  maxStudents: 50,
  allowSelfEnrollment: false,
  defaultAttendanceRequired: true,
  autoArchiveCompleted: true,
  gradingScale: "percentage",
  lateSubmissionPenalty: 10,
};

export default function LeaderSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Settings states
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotificationSettings);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacySettings);
  const [courseSettings, setCourseSettings] = useState<CourseSettings>(defaultCourseSettings);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfile({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        department: userData.department || "Computer Science",
        bio: userData.bio || "Experienced educator passionate about computer science and student success.",
      });
    }

    setTimeout(() => {
      try {
        // Load settings from localStorage or use defaults
        const savedNotifications = localStorage.getItem("notificationSettings");
        const savedPrivacy = localStorage.getItem("privacySettings");
        const savedCourseSettings = localStorage.getItem("courseSettings");
        
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
        if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
        if (savedCourseSettings) setCourseSettings(JSON.parse(savedCourseSettings));
        
        setLoading(false);
      } catch {
        setError("Failed to load settings.");
        setLoading(false);
      }
    }, 1000);
  }, []);

  const saveSettings = (section: string) => {
    try {
      switch (section) {
        case "profile":
          localStorage.setItem("userProfile", JSON.stringify(profile));
          break;
        case "notifications":
          localStorage.setItem("notificationSettings", JSON.stringify(notifications));
          break;
        case "privacy":
          localStorage.setItem("privacySettings", JSON.stringify(privacy));
          break;
        case "courses":
          localStorage.setItem("courseSettings", JSON.stringify(courseSettings));
          break;
        case "security":
          if (security.newPassword && security.newPassword !== security.confirmPassword) {
            setError("New passwords do not match.");
            return;
          }
          // In a real app, you would make an API call to change the password
          setSecurity(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
          break;
      }
      
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError(`Failed to save ${section} settings.`);
    }
  };

  const handleExportData = () => {
    alert("Exporting your data...");
    // In a real app, this would trigger a data export process
  };

  const handleImportData = () => {
    alert("Import data feature coming soon...");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion process started...");
      // In a real app, this would trigger account deletion
    }
  };

  const resetSettings = (section: string) => {
    if (confirm(`Reset all ${section} settings to default?`)) {
      switch (section) {
        case "notifications":
          setNotifications(defaultNotificationSettings);
          break;
        case "privacy":
          setPrivacy(defaultPrivacySettings);
          break;
        case "courses":
          setCourseSettings(defaultCourseSettings);
          break;
      }
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings reset to default!`);
      setTimeout(() => setSuccess(null), 3000);
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
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account, preferences, and system configurations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {success && (
          <Alert className="flex items-start gap-2 border-green-200 bg-green-50">
            <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
            <div>
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </div>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Settings Navigation */}
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and how others see you on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Enter your department"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                <Button onClick={() => saveSettings("profile")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details and membership information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-500">Member Since</Label>
                      <p className="font-medium">{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Last Login</Label>
                      <p className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-500">User ID</Label>
                      <p className="font-medium">{user?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Account Type</Label>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {user?.role || 'Leader'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how and when you want to be notified</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => resetSettings("notifications")}>
                    Reset to Default
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                        <p className="text-sm text-gray-500">Weekly summary of activities and updates</p>
                      </div>
                      <Switch
                        id="weeklyDigest"
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Alert Types
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="studentAlerts">Student Alerts</Label>
                        <p className="text-sm text-gray-500">Notifications about student performance and issues</p>
                      </div>
                      <Switch
                        id="studentAlerts"
                        checked={notifications.studentAlerts}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, studentAlerts: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="assignmentDeadlines">Assignment Deadlines</Label>
                        <p className="text-sm text-gray-500">Reminders for upcoming assignment deadlines</p>
                      </div>
                      <Switch
                        id="assignmentDeadlines"
                        checked={notifications.assignmentDeadlines}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, assignmentDeadlines: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gradeUpdates">Grade Updates</Label>
                        <p className="text-sm text-gray-500">Notifications when grades are updated</p>
                      </div>
                      <Switch
                        id="gradeUpdates"
                        checked={notifications.gradeUpdates}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, gradeUpdates: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="meetingReminders">Meeting Reminders</Label>
                        <p className="text-sm text-gray-500">Reminders for scheduled meetings</p>
                      </div>
                      <Switch
                        id="meetingReminders"
                        checked={notifications.meetingReminders}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, meetingReminders: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    System Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="systemUpdates">System Updates</Label>
                        <p className="text-sm text-gray-500">Notifications about platform updates and maintenance</p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, systemUpdates: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveSettings("notifications")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => resetSettings("privacy")}>
                    Reset to Default
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Visibility
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <p className="text-sm text-gray-500">Who can see your profile information</p>
                      </div>
                      <select
                        id="profileVisibility"
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'colleagues-only' | 'private' }))}
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="public">Public</option>
                        <option value="colleagues-only">Colleagues Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showEmail">Show Email Address</Label>
                        <p className="text-sm text-gray-500">Display your email address on your profile</p>
                      </div>
                      <Switch
                        id="showEmail"
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showPhone">Show Phone Number</Label>
                        <p className="text-sm text-gray-500">Display your phone number on your profile</p>
                      </div>
                      <Switch
                        id="showPhone"
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showPhone: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Data Access
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="studentDataAccess">Student Data Access</Label>
                        <p className="text-sm text-gray-500">Level of access to student information</p>
                      </div>
                      <select
                        id="studentDataAccess"
                        value={privacy.studentDataAccess}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, studentDataAccess: e.target.value as 'full' | 'limited' | 'restricted' }))}
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="full">Full Access</option>
                        <option value="limited">Limited Access</option>
                        <option value="restricted">Restricted Access</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dataRetention">Data Retention Period</Label>
                        <p className="text-sm text-gray-500">How long to keep your data (months)</p>
                      </div>
                      <Input
                        id="dataRetention"
                        type="number"
                        value={privacy.dataRetention}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, dataRetention: parseInt(e.target.value) || 24 }))}
                        className="w-20"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowDataExport">Allow Data Export</Label>
                        <p className="text-sm text-gray-500">Enable exporting of your personal data</p>
                      </div>
                      <Switch
                        id="allowDataExport"
                        checked={privacy.allowDataExport}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowDataExport: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export My Data
                </Button>
                <Button onClick={() => saveSettings("privacy")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Privacy Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Course Settings */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Course Management Settings</CardTitle>
                    <CardDescription>Configure default settings for your courses</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => resetSettings("courses")}>
                    Reset to Default
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Enrollment Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maxStudents">Maximum Students per Course</Label>
                        <p className="text-sm text-gray-500">Default maximum number of students allowed in a course</p>
                      </div>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={courseSettings.maxStudents}
                        onChange={(e) => setCourseSettings(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 50 }))}
                        className="w-20"
                        min="1"
                        max="200"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowSelfEnrollment">Allow Self-Enrollment</Label>
                        <p className="text-sm text-gray-500">Students can enroll themselves in courses</p>
                      </div>
                      <Switch
                        id="allowSelfEnrollment"
                        checked={courseSettings.allowSelfEnrollment}
                        onCheckedChange={(checked) => setCourseSettings(prev => ({ ...prev, allowSelfEnrollment: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course Management
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="defaultAttendanceRequired">Attendance Required</Label>
                        <p className="text-sm text-gray-500">Mark attendance as required by default</p>
                      </div>
                      <Switch
                        id="defaultAttendanceRequired"
                        checked={courseSettings.defaultAttendanceRequired}
                        onCheckedChange={(checked) => setCourseSettings(prev => ({ ...prev, defaultAttendanceRequired: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoArchiveCompleted">Auto-Archive Completed Courses</Label>
                        <p className="text-sm text-gray-500">Automatically archive courses when completed</p>
                      </div>
                      <Switch
                        id="autoArchiveCompleted"
                        checked={courseSettings.autoArchiveCompleted}
                        onCheckedChange={(checked) => setCourseSettings(prev => ({ ...prev, autoArchiveCompleted: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Grading & Assessment
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gradingScale">Default Grading Scale</Label>
                        <p className="text-sm text-gray-500">Preferred grading scale for new courses</p>
                      </div>
                      <select
                        id="gradingScale"
                        value={courseSettings.gradingScale}
                        onChange={(e) => setCourseSettings(prev => ({ ...prev, gradingScale: e.target.value as 'percentage' | 'points' | 'letter-grade' }))}
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="points">Points</option>
                        <option value="letter-grade">Letter Grade</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="lateSubmissionPenalty">Late Submission Penalty (%)</Label>
                        <p className="text-sm text-gray-500">Default penalty for late assignments</p>
                      </div>
                      <Input
                        id="lateSubmissionPenalty"
                        type="number"
                        value={courseSettings.lateSubmissionPenalty}
                        onChange={(e) => setCourseSettings(prev => ({ ...prev, lateSubmissionPenalty: parseInt(e.target.value) || 10 }))}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveSettings("courses")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Course Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Two-Factor Authentication
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Danger Zone
                  </h4>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-red-800">Delete Account</h5>
                        <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveSettings("security")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Update Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}