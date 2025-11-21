"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { 
    CheckSquare, 
    Search,
    Filter,
    Download,
    Upload,
    Save,
    Lock,
    Unlock,
    Calculator,
    TrendingUp,
    Users,
    BookOpen,
    MoreVertical,
    Eye,
    Edit,
    FileText,
    BarChart3,
    Target,
    Award,
    Clock
} from "lucide-react";

type Course = {
    id: string;
    code: string;
    name: string;
    semester: number;
    enrolled: number;
    department: string;
};

type Student = {
    id: string;
    fullName: string;
    email: string;
    studentId: string;
    year: string;
    attendance: number;
};

type ScoreEntry = {
    midterm: number | null;
    final: number | null;
    assignment: number | null;
    quiz: number | null;
    project: number | null;
    locked: { 
        midterm: boolean; 
        final: boolean; 
        assignment: boolean;
        quiz: boolean;
        project: boolean;
    };
    lastUpdated: string | null;
};

type GradeSummary = {
    average: number;
    highest: number;
    lowest: number;
    passed: number;
    failed: number;
};

const dummyCourses: Course[] = [
    { 
        id: "course1", 
        code: "ENG201", 
        name: "Advanced Composition", 
        semester: 2,
        enrolled: 24,
        department: "English Department"
    },
    { 
        id: "course2", 
        code: "LIT405", 
        name: "Modern American Literature", 
        semester: 4,
        enrolled: 18,
        department: "Literature Department"
    },
    { 
        id: "course3", 
        code: "WRI301", 
        name: "Creative Writing Workshop", 
        semester: 3,
        enrolled: 16,
        department: "Writing Department"
    },
];

function generateDummyStudents(courseId: string, count: number): Student[] {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah",
        "Ian", "Julia", "Kevin", "Laura", "Mike", "Nina", "Oscar", "Pam",
        "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander",
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore",
        "Taylor", "Anderson", "Thomas", "Jackson", "Martin", "Thompson", "Garcia",
        "Martinez", "Robinson", "Clark", "Lewis", "Walker", "Hall", "Allen",
    ];
    const years = ["Freshman", "Sophomore", "Junior", "Senior"];

    const students = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 7) % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.university.edu`;
        const studentId = `S${(10000 + i).toString().padStart(5, '0')}`;
        const year = years[i % years.length];
        const attendance = Math.floor(Math.random() * 20) + 80; // 80-100% attendance
        
        students.push({ 
            id: `${courseId}-stu${i + 1}`, 
            fullName, 
            email,
            studentId,
            year,
            attendance
        });
    }
    return students;
}

const dummyStudentsByCourseId: Record<string, Student[]> = {
    course1: generateDummyStudents("course1", 24),
    course2: generateDummyStudents("course2", 18),
    course3: generateDummyStudents("course3", 16),
};

const PAGE_SIZE = 12;

export default function ExamRecordsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idParam = searchParams.get("id") ?? dummyCourses[0].id;

    const [selectedCourseId, setSelectedCourseId] = useState(idParam);
    const [students, setStudents] = useState<Student[]>(dummyStudentsByCourseId[idParam] || []);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<Record<string, ScoreEntry>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const selectedCourse = dummyCourses.find(c => c.id === selectedCourseId) || dummyCourses[0];

    useEffect(() => {
        setLoading(true);
        setCurrentPage(1);
        setScores({});
        if (dummyStudentsByCourseId[selectedCourseId]) {
            setStudents(dummyStudentsByCourseId[selectedCourseId]);
        } else {
            setStudents([]);
        }
        setTimeout(() => setLoading(false), 800);
    }, [selectedCourseId]);

    function handleCourseChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newId = e.target.value;
        setSelectedCourseId(newId);
        router.replace(`/dashboard/teacher/exam-records?id=${newId}`);
    }

    function handleScoreChange(studentId: string, type: keyof Omit<ScoreEntry, "locked" | "lastUpdated">, value: string) {
        if (value === "") {
            setScores((prev) => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [type]: null,
                    locked: {
                        ...prev[studentId]?.locked,
                        [type]: false,
                    },
                    lastUpdated: new Date().toISOString()
                },
            }));
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setScores((prev) => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [type]: numValue,
                    locked: {
                        ...prev[studentId]?.locked,
                        [type]: false,
                    },
                    lastUpdated: new Date().toISOString()
                },
            }));
        }
    }

    function handleScoreBlur(studentId: string, type: keyof Omit<ScoreEntry, "locked" | "lastUpdated">) {
        const scoreEntry = scores[studentId];
        if (scoreEntry && typeof scoreEntry[type] === "number") {
            setScores((prev) => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    locked: {
                        ...prev[studentId].locked,
                        [type]: true,
                    },
                },
            }));
        }
    }

    function toggleLock(studentId: string, type: keyof Omit<ScoreEntry, "locked" | "lastUpdated">) {
        setScores((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                locked: {
                    ...prev[studentId].locked,
                    [type]: !prev[studentId]?.locked[type],
                },
            },
        }));
    }

    async function handleSaveAll() {
        setSaveStatus("saving");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
    }

    function calculateOverallGrade(studentId: string): number | null {
        const score = scores[studentId];
        if (!score) return null;
        
        const weights = { midterm: 0.3, final: 0.4, assignment: 0.15, quiz: 0.1, project: 0.05 };
        let total = 0;
        let weightSum = 0;

        (Object.keys(weights) as Array<keyof typeof weights>).forEach(key => {
            if (score[key] !== null) {
                total += score[key]! * weights[key];
                weightSum += weights[key];
            }
        });

        return weightSum > 0 ? Math.round(total / weightSum) : null;
    }

    function getGradeSummary(): GradeSummary {
        const overallGrades = students.map(student => calculateOverallGrade(student.id)).filter(grade => grade !== null) as number[];
        
        if (overallGrades.length === 0) {
            return { average: 0, highest: 0, lowest: 0, passed: 0, failed: 0 };
        }

        const average = Math.round(overallGrades.reduce((a, b) => a + b, 0) / overallGrades.length);
        const highest = Math.max(...overallGrades);
        const lowest = Math.min(...overallGrades);
        const passed = overallGrades.filter(grade => grade >= 60).length;
        const failed = overallGrades.filter(grade => grade < 60).length;

        return { average, highest, lowest, passed, failed };
    }

    const gradeSummary = getGradeSummary();

    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students;
        const term = searchTerm.toLowerCase();
        return students.filter(student => 
            student.fullName.toLowerCase().includes(term) ||
            student.email.toLowerCase().includes(term) ||
            student.studentId.toLowerCase().includes(term)
        );
    }, [students, searchTerm]);

    const pageCount = Math.ceil(filteredStudents.length / PAGE_SIZE);
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredStudents.slice(start, start + PAGE_SIZE);
    }, [filteredStudents, currentPage]);

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function getGradeColor(grade: number | null): string {
        if (grade === null) return "text-gray-500";
        if (grade >= 90) return "text-green-600";
        if (grade >= 80) return "text-blue-600";
        if (grade >= 70) return "text-yellow-600";
        if (grade >= 60) return "text-orange-600";
        return "text-red-600";
    }

    function getGradeBadge(grade: number | null): string {
        if (grade === null) return "N/A";
        if (grade >= 90) return "A";
        if (grade >= 80) return "B";
        if (grade >= 70) return "C";
        if (grade >= 60) return "D";
        return "F";
    }

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Exam Records & Grading
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {selectedCourse.code} - {selectedCourse.name} • {students.length} students
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Upload className="w-4 h-4" />
                                Import
                            </button>
                            <button 
                                onClick={handleSaveAll}
                                disabled={saveStatus === "saving"}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                            >
                                {saveStatus === "saving" ? (
                                    <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saveStatus === "saving" ? "Saving..." : 
                                 saveStatus === "saved" ? "Saved!" : "Save All"}
                            </button>
                        </div>
                    </div>

                    {/* Course Selection and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Course
                                </label>
                                <select
                                    value={selectedCourseId}
                                    onChange={handleCourseChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {dummyCourses.map(({ id, code, name, semester }) => (
                                        <option key={id} value={id}>
                                            {code} - {name} (Sem {semester})
                                        </option>
                                    ))}
                                </select>
                                
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Department</span>
                                        <span className="font-medium">{selectedCourse.department}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Enrolled</span>
                                        <span className="font-medium">{selectedCourse.enrolled} students</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Semester</span>
                                        <span className="font-medium">{selectedCourse.semester}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grade Summary Cards */}
                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Class Average</p>
                                        <p className="text-2xl font-bold">{gradeSummary.average}%</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-blue-200" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Passing Students</p>
                                        <p className="text-2xl font-bold">{gradeSummary.passed}</p>
                                    </div>
                                    <Award className="w-8 h-8 text-green-200" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-100 text-sm">Highest Score</p>
                                        <p className="text-2xl font-bold">{gradeSummary.highest}%</p>
                                    </div>
                                    <Target className="w-8 h-8 text-amber-200" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Need Attention</p>
                                        <p className="text-2xl font-bold">{gradeSummary.failed}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-purple-200" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search students by name, email, or ID..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Grading Table */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                                <p className="text-gray-600">Try adjusting your search or select a different course</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-900 w-64">Student</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-24">Year</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-24">Attendance</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-28">Midterm (30%)</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-28">Final (40%)</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-28">Assignments (15%)</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-24">Quizzes (10%)</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-24">Project (5%)</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-20">Overall</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-900 w-20">Grade</th>
                                                <th className="p-4 w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedStudents.map((student) => {
                                                const scoreEntry = scores[student.id] || {
                                                    midterm: null,
                                                    final: null,
                                                    assignment: null,
                                                    quiz: null,
                                                    project: null,
                                                    locked: { 
                                                        midterm: false, 
                                                        final: false, 
                                                        assignment: false,
                                                        quiz: false,
                                                        project: false
                                                    },
                                                    lastUpdated: null
                                                };
                                                const overallGrade = calculateOverallGrade(student.id);
                                                
                                                return (
                                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                        {/* Student Info */}
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                                    {student.fullName.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{student.fullName}</div>
                                                                    <div className="text-sm text-gray-500">{student.studentId}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center text-sm text-gray-600">
                                                            {student.year}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-sm font-medium text-gray-700">{student.attendance}%</span>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Score Inputs */}
                                                        {(['midterm', 'final', 'assignment', 'quiz', 'project'] as const).map((type) => (
                                                            <td key={type} className="p-4">
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        max={100}
                                                                        value={scoreEntry[type] ?? ""}
                                                                        onChange={(e) => handleScoreChange(student.id, type, e.target.value)}
                                                                        onBlur={() => handleScoreBlur(student.id, type)}
                                                                        disabled={scoreEntry.locked[type]}
                                                                        className={`w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
                                                                            scoreEntry.locked[type] 
                                                                                ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                                                                                : "bg-white hover:border-indigo-300"
                                                                        }`}
                                                                        placeholder="0-100"
                                                                    />
                                                                    <button
                                                                        onClick={() => toggleLock(student.id, type)}
                                                                        className={`p-1 rounded transition-colors duration-200 ${
                                                                            scoreEntry.locked[type] 
                                                                                ? "text-green-600 hover:bg-green-50" 
                                                                                : "text-gray-400 hover:bg-gray-100"
                                                                        }`}
                                                                        title={scoreEntry.locked[type] ? "Unlock" : "Lock"}
                                                                    >
                                                                        {scoreEntry.locked[type] ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        ))}
                                                        
                                                        {/* Overall Grade */}
                                                        <td className="p-4 text-center">
                                                            <span className={`font-bold text-lg ${getGradeColor(overallGrade)}`}>
                                                                {overallGrade !== null ? `${overallGrade}%` : "-"}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                                overallGrade === null ? 'bg-gray-100 text-gray-600' :
                                                                overallGrade >= 90 ? 'bg-green-100 text-green-700' :
                                                                overallGrade >= 80 ? 'bg-blue-100 text-blue-700' :
                                                                overallGrade >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                                                overallGrade >= 60 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                                {getGradeBadge(overallGrade)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <button 
                                                                onClick={() => setSelectedStudent(student)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                            >
                                                                <MoreVertical className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextPage}
                                                disabled={currentPage === pageCount}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="flex justify-between items-start p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
                                <p className="text-gray-600">{selectedStudent.studentId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                    {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.fullName}</h3>
                                    <p className="text-gray-600">{selectedStudent.email}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="text-gray-600">Year</label>
                                    <p className="font-medium">{selectedStudent.year}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600">Attendance</label>
                                    <p className="font-medium">{selectedStudent.attendance}%</p>
                                </div>
                                <div>
                                    <label className="text-gray-600">Student ID</label>
                                    <p className="font-medium">{selectedStudent.studentId}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600">Overall Grade</label>
                                    <p className="font-medium">
                                        {calculateOverallGrade(selectedStudent.id) !== null 
                                            ? `${calculateOverallGrade(selectedStudent.id)}%` 
                                            : "Not graded"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// Skeleton component for loading state
function Skeleton({ className }: { className: string }) {
    return (
        <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
    );
}