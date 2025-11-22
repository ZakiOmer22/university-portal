"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Download,
  BookOpen,
  Megaphone,
  Bell,
  FileText,
  Eye,
  Printer,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: "General" | "Academic" | "Events" | "Urgent";
  content: string;
  priority: "low" | "medium" | "high";
  author: string;
  attachments?: number;
  views: number;
  isPinned?: boolean;
}

const dummyAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Campus Reopening Dates Announced",
    date: "2025-08-01T09:00:00Z",
    category: "General",
    content: `The University of Hargeisa will reopen for the Fall semester starting September 1st. 

All students are advised to complete their course registration by August 25th to ensure a smooth start to the academic year. 

Important dates to remember:
• September 1st: Campus reopens
• September 2nd-5th: Orientation for new students
• September 8th: Classes begin
• August 25th: Registration deadline

Please ensure you have completed all required health and safety protocols before returning to campus. All students must present their vaccination certificates or recent negative COVID-19 test results at the main gate.

For any registration issues, please contact the Student Affairs Office at student.affairs@university.edu or visit Room 101 in the Administration Building.`,
    priority: "high",
    author: "University Administration",
    attachments: 2,
    views: 245,
    isPinned: true
  },
  {
    id: "a2",
    title: "Midterm Exams Schedule Released",
    date: "2025-09-15T12:00:00Z",
    category: "Academic",
    content: `The midterm examination schedule for the Fall 2025 semester has been officially released.

Exam Period: October 10th - October 20th, 2025

Key Information:
• Exam halls will be assigned based on your course registration
• Bring your student ID to all exams
• Electronic devices are not permitted in exam halls
• Review sessions will be held the week before exams

Schedule Highlights:
- Computer Science: October 10th, 9:00 AM
- Mathematics: October 12th, 1:00 PM
- Physics: October 15th, 9:00 AM
- Engineering: October 18th, 1:00 PM

Please check the detailed schedule on the student portal for your specific courses. If you have any scheduling conflicts, contact the Examination Office immediately.`,
    priority: "high",
    author: "Examination Office",
    attachments: 1,
    views: 189
  },
  {
    id: "a3",
    title: "Health Awareness Week",
    date: "2025-08-20T08:00:00Z",
    category: "Events",
    content: `Join us for our annual Health Awareness Week, dedicated to promoting student wellness and healthy lifestyle choices.

Event Details:
Date: August 25th - August 29th, 2025
Time: 9:00 AM - 4:00 PM daily
Location: Student Center and Main Campus Grounds

Featured Activities:
• Free health screenings and checkups
• Mental health workshops and counseling sessions
• Nutrition and fitness seminars
• Yoga and meditation classes
• Sports competitions and fitness challenges

Special Guests:
- Dr. Sarah Johnson (Nutrition Specialist)
- Prof. Michael Chen (Mental Health Expert)
- Local fitness instructors and wellness coaches

All activities are free for students. Registration is recommended for workshops due to limited space.`,
    priority: "medium",
    author: "Student Health Services",
    attachments: 0,
    views: 156
  },
  {
    id: "a4",
    title: "Library Extended Hours",
    date: "2025-09-05T14:00:00Z",
    category: "General",
    content: `To better support students during the examination period, the university library will extend its operating hours.

Extended Hours Schedule (Effective September 10th - October 25th):
• Monday - Friday: 8:00 AM - 10:00 PM
• Saturday - Sunday: 9:00 AM - 8:00 PM

Additional Services:
- 24/7 access to online resources and e-books
- Extended group study room bookings
- Increased computer lab availability
- Free printing credits for research purposes

Additional study spaces have been arranged in the following locations:
- Science Building Study Hall
- Engineering Commons
- Business School Library Annex

Please respect the quiet study zones and maintain a conducive learning environment for all students.`,
    priority: "medium",
    author: "Library Management",
    attachments: 0,
    views: 203
  },
  {
    id: "a5",
    title: "URGENT: Campus Network Maintenance",
    date: "2025-08-22T16:00:00Z",
    category: "Urgent",
    content: `EMERGENCY NOTICE: Campus Network Maintenance

Due to critical infrastructure upgrades, the campus network will undergo emergency maintenance tonight.

Maintenance Window:
Date: Tonight, August 22nd, 2025
Time: 10:00 PM - 2:00 AM (4 hours)

Affected Services:
• Campus Wi-Fi (all networks)
• Student Portal access
• Library database access
• Online learning platforms
• Email services

Impact:
- No internet access during maintenance window
- Save all work before 10:00 PM
- Offline resources will remain available
- Emergency services will not be affected

We apologize for any inconvenience and appreciate your understanding as we work to improve campus infrastructure.`,
    priority: "high",
    author: "IT Department",
    attachments: 0,
    views: 312,
    isPinned: true
  }
];

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params["id"] as string;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (!id) {
      router.push("/dashboard/leader/announcements");
      return;
    }

    setTimeout(() => {
      const found = dummyAnnouncements.find((a) => a.id === id) || null;
      setAnnouncement(found);
      
      // Find related announcements (same category, excluding current)
      if (found) {
        const related = dummyAnnouncements
          .filter(a => a.id !== id && a.category === found.category)
          .slice(0, 3);
        setRelatedAnnouncements(related);
      }
      
      setLoading(false);
    }, 800);
  }, [id, router]);

  const getCategoryIcon = (category: Announcement["category"]) => {
    switch (category) {
      case "General": return <Megaphone className="h-4 w-4" />;
      case "Academic": return <BookOpen className="h-4 w-4" />;
      case "Events": return <Calendar className="h-4 w-4" />;
      case "Urgent": return <Bell className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Announcement["category"]) => {
    switch (category) {
      case "General": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Academic": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Events": return "bg-green-100 text-green-800 border-green-200";
      case "Urgent": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (navigator.share && announcement) {
      try {
        await navigator.share({
          title: announcement.title,
          text: announcement.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout user={user} loading={true}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!announcement) {
    return (
      <DashboardLayout user={user} loading={false}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <Bell className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-4">Announcement Not Found</h2>
            <p className="text-red-700 mb-6">
              The announcement you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/dashboard/leader/announcements">
              <Button className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Announcements
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} loading={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/leader/announcements">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Announcements
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Save as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Announcement Card */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className={getCategoryColor(announcement.category)}>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(announcement.category)}
                  {announcement.category}
                </span>
              </Badge>
              <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                {announcement.priority} Priority
              </Badge>
              {announcement.isPinned && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pinned
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {announcement.title}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mt-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {announcement.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(announcement.date)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {announcement.views} views
              </span>
              {announcement.attachments && announcement.attachments > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {announcement.attachments} attachment{announcement.attachments !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {announcement.content}
              </div>
            </div>

            {/* Attachments Section */}
            {announcement.attachments && announcement.attachments > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Campus_Reopening_Guidelines.pdf</p>
                        <p className="text-sm text-gray-600">2.4 MB • Updated August 1, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Health_Protocols_Checklist.pdf</p>
                        <p className="text-sm text-gray-600">1.1 MB • Updated August 1, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Announcements */}
        {relatedAnnouncements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Related Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedAnnouncements.map((related) => (
                  <Link 
                    key={related.id} 
                    href={`/dashboard/leader/announcements/${related.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={getCategoryColor(related.category)}>
                            {related.category}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatDate(related.date)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{related.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {related.content.substring(0, 120)}...
                        </p>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180 flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/dashboard/leader/announcements">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Announcements
            </Button>
          </Link>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Mail className="h-4 w-4 mr-2" />
            Share with Class
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}