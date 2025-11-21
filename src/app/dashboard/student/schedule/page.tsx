"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface ScheduleItem {
    id: string;
    day: string; // Monday, Tuesday, etc.
    start: string; // "HH:mm"
    end: string;
    courseCode: string;
    courseName: string;
    teacher: string;
    teacherAvatar?: string;
    room: string;
    semesterNumber: number;
    type?: "lecture" | "lab" | "tutorial";
    color?: string;
}

// Dummy data for one semester
const dummySchedule: ScheduleItem[] = [
    {
        id: "1",
        day: "Monday",
        start: "08:00",
        end: "09:30",
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        teacher: "Dr. Smith",
        teacherAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        room: "A101",
        semesterNumber: 1,
        type: "lecture",
        color: "from-blue-500 to-cyan-600"
    },
    {
        id: "2",
        day: "Monday",
        start: "10:00",
        end: "11:30",
        courseCode: "MA101",
        courseName: "Calculus I",
        teacher: "Prof. Lee",
        teacherAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        room: "B203",
        semesterNumber: 1,
        type: "lecture",
        color: "from-purple-500 to-pink-600"
    },
    {
        id: "3",
        day: "Tuesday",
        start: "08:00",
        end: "09:30",
        courseCode: "CS201",
        courseName: "Data Structures and Algorithms",
        teacher: "Dr. Kim",
        teacherAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
        room: "C301",
        semesterNumber: 1,
        type: "lecture",
        color: "from-green-500 to-emerald-600"
    },
    {
        id: "4",
        day: "Tuesday",
        start: "14:00",
        end: "16:30",
        courseCode: "CS201",
        courseName: "Data Structures Lab",
        teacher: "Dr. Kim",
        teacherAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
        room: "Lab A",
        semesterNumber: 1,
        type: "lab",
        color: "from-green-500 to-emerald-600"
    },
    {
        id: "5",
        day: "Wednesday",
        start: "10:00",
        end: "11:30",
        courseCode: "PH101",
        courseName: "Physics I",
        teacher: "Dr. Carter",
        teacherAvatar: "https://randomuser.me/api/portraits/men/68.jpg",
        room: "D110",
        semesterNumber: 1,
        type: "lecture",
        color: "from-orange-500 to-red-600"
    },
    {
        id: "6",
        day: "Thursday",
        start: "09:00",
        end: "10:30",
        courseCode: "CS301",
        courseName: "Advanced Algorithms",
        teacher: "Dr. Smith",
        teacherAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        room: "A101",
        semesterNumber: 1,
        type: "lecture",
        color: "from-indigo-500 to-purple-600"
    },
    {
        id: "7",
        day: "Friday",
        start: "11:00",
        end: "12:30",
        courseCode: "MA201",
        courseName: "Linear Algebra",
        teacher: "Prof. Lee",
        teacherAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        room: "B203",
        semesterNumber: 1,
        type: "lecture",
        color: "from-pink-500 to-rose-600"
    },
    {
        id: "8",
        day: "Friday",
        start: "13:00",
        end: "14:30",
        courseCode: "ENG101",
        courseName: "Academic Writing",
        teacher: "Ms. Johnson",
        teacherAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
        room: "E205",
        semesterNumber: 1,
        type: "tutorial",
        color: "from-amber-500 to-yellow-600"
    },
];

// Helper: get day name of today in English Monday..Friday
function getTodayDayName() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return days[today.getDay()];
}

// Helper: convert "HH:mm" to minutes since midnight for easy comparison
function timeToMinutes(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function formatTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default function StudentSchedulePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [currentWeek, setCurrentWeek] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setTimeout(() => setLoading(false), 900);
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const today = getTodayDayName();

    // Filter schedule only for semester 1
    const schedule = dummySchedule.filter((s) => s.semesterNumber === 1);

    // Get next class for each day
    function getNextCourseForDay(day: string) {
        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        const todayCourses = schedule.filter((s) => s.day === day);
        const upcoming = todayCourses.filter((c) => timeToMinutes(c.start) >= nowMinutes);
        
        if (upcoming.length > 0) {
            upcoming.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
            return upcoming[0];
        } else if (todayCourses.length > 0) {
            todayCourses.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
            return todayCourses[0];
        }
        return null;
    }

    // Get current/upcoming class
    const getCurrentClass = () => {
        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        const todayCourses = schedule.filter(s => s.day === today);
        
        for (const course of todayCourses) {
            const start = timeToMinutes(course.start);
            const end = timeToMinutes(course.end);
            if (nowMinutes >= start && nowMinutes <= end) {
                return course;
            }
        }
        return null;
    };

    const currentClass = getCurrentClass();
    const totalClasses = schedule.length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
                        <p className="text-gray-600 mt-1">Your class timetable for Semester 1</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-sm py-1 px-3">
                        {totalClasses} Classes
                    </Badge>
                </div>

                {/* Current Class Banner */}
                {currentClass && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-green-200" />
                                    <span className="text-green-200 font-medium">Currently in class</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {currentClass.courseCode} - {currentClass.courseName}
                                </h2>
                                <div className="flex items-center gap-4 text-green-100">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{currentClass.teacher}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Room {currentClass.room}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Until {formatTime(currentClass.end)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold">{formatTime(currentClass.end)}</div>
                                <div className="text-green-200 text-sm">Ends at</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Summary */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Total Classes</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalClasses}</div>
                            <div className="text-blue-200 text-sm">This Week</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-purple-200" />
                                <div className="text-purple-200 text-sm font-medium">Class Hours</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {schedule.reduce((total, course) => {
                                    const start = timeToMinutes(course.start);
                                    const end = timeToMinutes(course.end);
                                    return total + (end - start) / 60;
                                }, 0).toFixed(1)}
                            </div>
                            <div className="text-purple-200 text-sm">Hours/Week</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <User className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Instructors</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {new Set(schedule.map(course => course.teacher)).size}
                            </div>
                            <div className="text-green-200 text-sm">Teachers</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <MapPin className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Locations</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {new Set(schedule.map(course => course.room)).size}
                            </div>
                            <div className="text-amber-200 text-sm">Different Rooms</div>
                        </div>
                    </div>
                )}

                {/* Weekly Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Weekly Timetable
                        </h2>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentWeek(prev => prev - 1)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 px-3">
                                Week {currentWeek + 1}
                            </span>
                            <button 
                                onClick={() => setCurrentWeek(prev => prev + 1)}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border rounded-xl p-4">
                                    <Skeleton className="h-6 w-24 mb-3" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {days.map((day) => {
                                const isToday = day === today;
                                const dayCourses = schedule.filter((s) => s.day === day);

                                return (
                                    <div
                                        key={day}
                                        className={`border rounded-xl p-4 transition-all duration-200 ${
                                            isToday 
                                                ? "border-blue-500 bg-blue-50 shadow-sm" 
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`font-bold text-lg ${
                                                isToday ? "text-blue-900" : "text-gray-900"
                                            }`}>
                                                {day}
                                            </h3>
                                            {isToday && (
                                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                    Today
                                                </Badge>
                                            )}
                                        </div>

                                        {dayCourses.length > 0 ? (
                                            <div className="space-y-3">
                                                {dayCourses.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        className={`bg-white rounded-lg p-3 border-l-4 ${
                                                            course.type === 'lab' 
                                                                ? 'border-l-green-500 bg-green-50' 
                                                                : course.type === 'tutorial'
                                                                ? 'border-l-amber-500 bg-amber-50'
                                                                : 'border-l-blue-500'
                                                        } shadow-sm hover:shadow-md transition-all duration-200`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                                    {course.courseCode}
                                                                </h4>
                                                                <p className="text-xs text-gray-600 line-clamp-1">
                                                                    {course.courseName}
                                                                </p>
                                                            </div>
                                                            {course.type && (
                                                                <Badge 
                                                                    variant="secondary" 
                                                                    className={`text-xs ${
                                                                        course.type === 'lab' 
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : course.type === 'tutorial'
                                                                            ? 'bg-amber-100 text-amber-800'
                                                                            : 'bg-blue-100 text-blue-800'
                                                                    }`}
                                                                >
                                                                    {course.type}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="space-y-1 text-xs text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{formatTime(course.start)} - {formatTime(course.end)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{course.room}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                <span className="truncate">{course.teacher}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-gray-500">
                                                <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">No classes</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}