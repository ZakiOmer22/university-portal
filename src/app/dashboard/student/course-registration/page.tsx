"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, BookOpen, Users, Clock, Calendar, Search, Filter, Plus, X } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    instructor: string;
    instructorAvatar?: string;
    creditHours: number;
    schedule: string;
    semester: string;
    availableSlots: number;
    description?: string;
    prerequisites?: string[];
    department: string;
}

const dummyAvailableCourses: Course[] = [
    { 
        id: "course-uuid-1", 
        code: "CS101", 
        name: "Computer Science 101", 
        instructor: "Dr. Smith",
        instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        creditHours: 3,
        schedule: "Mon/Wed 10:00-11:30 AM",
        semester: "Fall 2024",
        availableSlots: 15,
        description: "Introduction to computer science fundamentals including programming, algorithms, and data structures.",
        prerequisites: ["None"],
        department: "Computer Science"
    },
    { 
        id: "course-uuid-2", 
        code: "MATH201", 
        name: "Advanced Mathematics", 
        instructor: "Prof. Jane",
        instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        creditHours: 4,
        schedule: "Tue/Thu 2:00-3:30 PM",
        semester: "Fall 2024",
        availableSlots: 8,
        description: "Advanced mathematical concepts including calculus, linear algebra, and differential equations.",
        prerequisites: ["MATH101"],
        department: "Mathematics"
    },
    { 
        id: "course-uuid-3", 
        code: "ENG105", 
        name: "English Literature", 
        instructor: "Ms. Green",
        instructorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
        creditHours: 2,
        schedule: "Mon/Wed/Fri 1:00-2:00 PM",
        semester: "Fall 2024",
        availableSlots: 25,
        description: "Survey of English literature from the medieval period to the present.",
        prerequisites: ["ENG100"],
        department: "English"
    },
    { 
        id: "course-uuid-4", 
        code: "HIST210", 
        name: "World History", 
        instructor: "Mr. Black",
        instructorAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
        creditHours: 3,
        schedule: "Tue/Thu 11:00-12:30 PM",
        semester: "Fall 2024",
        availableSlots: 12,
        description: "Comprehensive overview of world civilizations and historical developments.",
        prerequisites: ["None"],
        department: "History"
    },
    { 
        id: "course-uuid-5", 
        code: "PHY301", 
        name: "Modern Physics", 
        instructor: "Dr. Johnson",
        instructorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
        creditHours: 4,
        schedule: "Mon/Wed/Fri 9:00-10:30 AM",
        semester: "Fall 2024",
        availableSlots: 5,
        description: "Introduction to modern physics including relativity and quantum mechanics.",
        prerequisites: ["PHY201", "MATH201"],
        department: "Physics"
    },
];

export default function CourseRegistrationPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>(["course-uuid-1", "course-uuid-2"]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        setTimeout(() => {
            try {
                setAvailableCourses(dummyAvailableCourses);
                setLoading(false);
            } catch {
                setError("Failed to load available courses.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    function registerCourse(courseId: string) {
        setLoading(true);
        setTimeout(() => {
            if (!registeredCourseIds.includes(courseId)) {
                setRegisteredCourseIds((prev) => [...prev, courseId]);
            }
            setLoading(false);
        }, 800);
    }

    function unregisterCourse(courseId: string) {
        setLoading(true);
        setTimeout(() => {
            setRegisteredCourseIds((prev) => prev.filter(id => id !== courseId));
            setLoading(false);
        }, 800);
    }

    // Filter courses based on search and department
    const filteredCourses = availableCourses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const departments = ["all", ...new Set(availableCourses.map(course => course.department))];
    const totalCredits = registeredCourseIds.reduce((total, courseId) => {
        const course = availableCourses.find(c => c.id === courseId);
        return total + (course?.creditHours || 0);
    }, 0);

    return (
        <DashboardLayout loading={loading} user={user}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Course Registration</h1>
                        <p className="text-gray-600 mt-1">Browse and register for available courses</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {registeredCourseIds.length} Registered
                    </Badge>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                        <div>
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Registration Summary */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Registered Courses</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{registeredCourseIds.length}</div>
                            <div className="text-indigo-200 text-sm">Current Semester</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Total Credits</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalCredits}</div>
                            <div className="text-blue-200 text-sm">Enrolled Hours</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Users className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Available Courses</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{availableCourses.length}</div>
                            <div className="text-green-200 text-sm">Open for Registration</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search courses by name, code, or instructor..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>
                                            {dept === "all" ? "All Departments" : dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchTerm || selectedDepartment !== "all" 
                                ? "No courses match your search criteria. Try adjusting your filters."
                                : "No courses are currently available for registration."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredCourses.map((course) => {
                            const isRegistered = registeredCourseIds.includes(course.id);
                            const isFull = course.availableSlots === 0;

                            return (
                                <div
                                    key={course.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${
                                        isRegistered ? "border-green-200 bg-green-50/50" : ""
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        {/* Course Information */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-3 h-8 rounded-full"></div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {course.code} - {course.name}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                                    {course.department}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">{course.creditHours} Credits</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mt-2">{course.description}</p>
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={course.instructorAvatar}
                                                                alt={course.instructor}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                            <span>{course.instructor}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{course.schedule}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>{course.availableSlots} slots available</span>
                                                        </div>
                                                    </div>

                                                    {course.prerequisites && course.prerequisites.length > 0 && (
                                                        <div className="mt-3">
                                                            <span className="text-sm font-medium text-gray-700">Prerequisites: </span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {course.prerequisites.map((prereq, index) => (
                                                                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                                                        {prereq}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Section */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-start lg:items-end justify-between lg:justify-start">
                                            {isRegistered ? (
                                                <div className="flex flex-col gap-3">
                                                    <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-sm py-1 px-3">
                                                        <CheckCircle2 size={14} />
                                                        Registered
                                                    </Badge>
                                                    <button
                                                        onClick={() => unregisterCourse(course.id)}
                                                        className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm"
                                                        disabled={loading}
                                                    >
                                                        <X size={14} />
                                                        Unregister
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => registerCourse(course.id)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                        isFull 
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    }`}
                                                    disabled={loading || isFull}
                                                    aria-label={`Register for ${course.name}`}
                                                >
                                                    <Plus size={16} />
                                                    {isFull ? "Course Full" : "Register"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}