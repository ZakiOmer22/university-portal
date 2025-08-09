"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Info,
    Clock,
    ShieldCheck,
    BookOpen,
    PhoneCall,
    FileQuestionMark,
} from "lucide-react";

// Define union type for event types
type EventType = "semester" | "exam" | "holiday" | "event";

// Define interface for events to enforce types
interface AcademicEvent {
    id: number;
    title: string;
    date?: string;
    dateRange?: [string, string];
    type: EventType;
    description: string;
}

// Typed event list
const academicEvents: AcademicEvent[] = [
    {
        id: 1,
        title: "Fall Semester Begins",
        date: "2025-09-01",
        type: "semester",
        description:
            "The fall semester kicks off with orientation and registration for all students.",
    },
    {
        id: 2,
        title: "Midterm Exams Week",
        dateRange: ["2025-10-15", "2025-10-21"],
        type: "exam",
        description:
            "Midterms are held to assess the progress of students across all courses.",
    },
    {
        id: 3,
        title: "Thanksgiving Holiday",
        date: "2025-11-26",
        type: "holiday",
        description:
            "University will be closed for Thanksgiving. No classes or exams scheduled.",
    },
    {
        id: 4,
        title: "Fall Semester Ends",
        date: "2025-12-15",
        type: "semester",
        description: "The last day of classes and final assignments are due.",
    },
    {
        id: 5,
        title: "Winter Break",
        dateRange: ["2025-12-16", "2026-01-10"],
        type: "holiday",
        description:
            "Winter break allows students and staff to recharge before the next semester.",
    },
    {
        id: 6,
        title: "Spring Semester Begins",
        date: "2026-01-12",
        type: "semester",
        description:
            "Spring semester starts with new courses, schedules, and academic advising.",
    },
    {
        id: 7,
        title: "Final Exams Week",
        dateRange: ["2026-05-01", "2026-05-07"],
        type: "exam",
        description:
            "Comprehensive final exams for all enrolled courses to conclude the semester.",
    },
    {
        id: 8,
        title: "Commencement Ceremony",
        date: "2026-05-15",
        type: "event",
        description:
            "Graduation ceremony celebrating the accomplishments of the graduating class.",
    },
];

// Months for indexing events
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// Typed event colors mapping
const eventColors: Record<EventType, string> = {
    semester: "bg-indigo-700 text-white",
    exam: "bg-red-600 text-white",
    holiday: "bg-green-600 text-white",
    event: "bg-yellow-400 text-black",
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AcademicCalendarPage() {
    const [expandedMonths, setExpandedMonths] = useState<number[]>([8, 9, 10, 11]); // preexpand Fall semester months
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const academicYearStart = month < 8 ? year - 1 : year;
    const academicYearEnd = academicYearStart + 1;

    const academicYearString = `${academicYearStart} - ${academicYearEnd}`;
    // Group events by month
    const eventsByMonth: Record<number, AcademicEvent[]> = {};
    academicEvents.forEach((event) => {
        let monthIndex: number;
        if (event.date) {
            monthIndex = new Date(event.date).getMonth();
        } else if (event.dateRange) {
            monthIndex = new Date(event.dateRange[0]).getMonth();
        } else {
            monthIndex = 0;
        }
        if (!eventsByMonth[monthIndex]) eventsByMonth[monthIndex] = [];
        eventsByMonth[monthIndex].push(event);
    });

    function toggleMonth(index: number) {
        setExpandedMonths((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
            {/* Hero / Intro Section */}
            <section
                id="overview"
                className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-12 gap-12 flex-grow"
            >
                {/* Text */}
                <div className="max-w-xl text-indigo-900 space-y-6">
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Stay Ahead with Our Comprehensive Academic Calendar
                    </h1>
                    <p className="text-lg text-indigo-800/90">
                        Our academic calendar is designed to provide students and faculty with
                        clear, timely information about semester schedules, exam periods,
                        holidays, and important university events.
                    </p>
                    <p className="text-indigo-800/90">
                        We ensure transparency, timely updates, and flexibility to support
                        student success and campus life.
                    </p>
                </div>

                {/* Illustration */}
                <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
                    alt="University calendar concept"
                    className="rounded-3xl shadow-lg max-w-lg w-full object-cover"
                />
            </section>

            {/* Calendar Year Horizontal Timeline */}
            <section
                id="calendar"
                className="max-w-7xl mx-auto p-12 space-y-12 border-t border-indigo-200"
            >
                <h2 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center">
                    Academic Year 2025-2026 Overview
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {months.map((month, i) => {
                        const monthEvents = eventsByMonth[i] || [];

                        return (
                            <div
                                key={month}
                                className="flex flex-col border rounded-2xl p-6 bg-white shadow-md"
                            >
                                <h3 className="text-indigo-700 font-semibold text-lg mb-3 text-center">
                                    {month}
                                </h3>

                                <ul className="space-y-3 flex-grow overflow-y-auto max-h-[240px] pr-2 no-scrollbar">
                                    {monthEvents.length === 0 ? (
                                        <li className="text-indigo-400 italic text-center select-text">
                                            No events
                                        </li>
                                    ) : (
                                        monthEvents.map((event) => (
                                            <li
                                                key={event.id}
                                                className={`rounded-lg px-3 py-2 cursor-default select-text ${eventColors[event.type]
                                                    }`}
                                                title={event.description}
                                            >
                                                <span className="font-semibold">{event.title}</span>
                                                <br />
                                                <small className="text-indigo-100 text-sm select-text">
                                                    {event.date
                                                        ? formatDate(event.date)
                                                        : event.dateRange
                                                            ? `${formatDate(event.dateRange[0])} - ${formatDate(
                                                                event.dateRange[1]
                                                            )}`
                                                            : "TBD"}
                                                </small>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Main Content with Left (detailed accordion) and Right (Info box) */}
            <section className="max-w-7xl mx-auto p-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-indigo-200">
                {/* Left: Monthly Accordion with details */}
                <div className="col-span-2">
                    <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">
                        Monthly Academic Events Detail
                    </h2>
                    {months.map((month, i) => {
                        const monthEvents = eventsByMonth[i] || [];
                        const isExpanded = expandedMonths.includes(i);

                        return (
                            <div
                                key={month}
                                className="mb-6 bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <button
                                    onClick={() => {
                                        setExpandedMonths((prev) =>
                                            prev.includes(i)
                                                ? prev.filter((x) => x !== i)
                                                : [...prev, i]
                                        );
                                    }}
                                    aria-expanded={isExpanded}
                                    className="w-full flex justify-between items-center px-6 py-4 text-indigo-900 font-semibold text-lg hover:bg-indigo-50 transition"
                                >
                                    {month}{" "}
                                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </button>
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.ul
                                            key={`month-list-${i}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="px-8 pt-2 pb-6 space-y-4 text-indigo-800"
                                        >
                                            {monthEvents.length === 0 ? (
                                                <li className="italic text-indigo-400">No events this month</li>
                                            ) : (
                                                monthEvents.map(({ id, title, description, date, dateRange }) => (
                                                    <li
                                                        key={id}
                                                        className="border-l-4 border-indigo-600 pl-4 relative"
                                                    >
                                                        <div className="font-semibold text-lg">{title}</div>
                                                        <div className="text-sm text-indigo-700 italic mb-1">
                                                            {date
                                                                ? formatDate(date)
                                                                : dateRange
                                                                    ? `${formatDate(dateRange[0])} - ${formatDate(
                                                                        dateRange[1]
                                                                    )}`
                                                                    : "Date TBD"}
                                                        </div>
                                                        <div>{description}</div>
                                                    </li>
                                                ))
                                            )}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Right: How University Manages Academic Calendar */}
                <aside className="bg-indigo-50 rounded-xl p-8 shadow-md sticky top-24 h-fit text-indigo-900">
                    <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                        <Info size={28} className="text-indigo-700" /> How We Manage Academic Schedules
                    </h2>
                    <ul className="list-disc list-inside space-y-4 text-lg leading-relaxed">
                        <li>
                            <strong>Collaborative Planning:</strong> Our Academic Affairs office works
                            closely with faculty and department heads to align semester dates, exams,
                            and holidays.
                        </li>
                        <li>
                            <strong>Advanced Scheduling Tools:</strong> We use modern software to avoid
                            conflicts and optimize room and resource allocation.
                        </li>
                        <li>
                            <strong>Student-Centered Approach:</strong> Flexibility is built in to
                            accommodate diverse student needs and external circumstances.
                        </li>
                        <li>
                            <strong>Continuous Updates:</strong> We communicate changes promptly via
                            email, student portal, and university website.
                        </li>
                        <li>
                            <strong>Exam Security:</strong> Strict protocols ensure fairness and
                            integrity during exam periods.
                        </li>
                        <li>
                            <strong>Holiday Observances:</strong> Recognizing cultural and national
                            holidays with scheduled breaks to support wellbeing.
                        </li>
                        <li>
                            <strong>Emergency Flexibility:</strong> Contingency plans allow for
                            calendar adjustments in response to unforeseen events.
                        </li>
                    </ul>
                </aside>
            </section>

            {/* FAQ Section */}
            <section
                id="faq"
                className="max-w-7xl mx-auto p-12 border-t border-indigo-200 bg-white rounded-xl shadow-md my-16"
            >
                <h2 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="max-w-3xl mx-auto space-y-8">
                    <details className="border border-indigo-300 rounded-lg p-5 open:bg-indigo-50 transition">
                        <summary className="font-semibold cursor-pointer text-indigo-800 text-lg select-none">
                            How are exam dates determined?
                        </summary>
                        <p className="mt-3 text-indigo-700 leading-relaxed">
                            Exam dates are scheduled in coordination with faculty to ensure adequate
                            preparation time and to minimize conflicts.
                        </p>
                    </details>

                    <details className="border border-indigo-300 rounded-lg p-5 open:bg-indigo-50 transition">
                        <summary className="font-semibold cursor-pointer text-indigo-800 text-lg select-none">
                            What happens if there is a schedule change?
                        </summary>
                        <p className="mt-3 text-indigo-700 leading-relaxed">
                            All changes are communicated promptly via email and the student portal.
                            We also update the official calendar online.
                        </p>
                    </details>

                    <details className="border border-indigo-300 rounded-lg p-5 open:bg-indigo-50 transition">
                        <summary className="font-semibold cursor-pointer text-indigo-800 text-lg select-none">
                            How do holidays affect classes?
                        </summary>
                        <p className="mt-3 text-indigo-700 leading-relaxed">
                            Classes and exams are not held on official holidays. Makeup classes are
                            scheduled as needed.
                        </p>
                    </details>

                    <details className="border border-indigo-300 rounded-lg p-5 open:bg-indigo-50 transition">
                        <summary className="font-semibold cursor-pointer text-indigo-800 text-lg select-none">
                            Can I get a printed copy of the academic calendar?
                        </summary>
                        <p className="mt-3 text-indigo-700 leading-relaxed">
                            Yes, printable versions are available through the student portal and the
                            academic affairs office.
                        </p>
                    </details>
                </div>
            </section>

            {/* Contact / Footer */}
            <footer
                id="contact"
                className="bg-indigo-700 text-indigo-50 py-12 px-8 mt-auto"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-2xl font-extrabold mb-3">Academic Affairs Office</h3>
                        <p>For questions about the academic calendar or schedules:</p>
                        <p className="mt-1">Phone: +1 (555) 123-4567</p>
                        <p>
                            Email:{" "}
                            <a href="mailto:academics@university.edu" className="underline">
                                academics@university.edu
                            </a>
                        </p>
                    </div>
                    <div>
                        <p className="text-sm opacity-75">&copy; 2025 University Name. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
