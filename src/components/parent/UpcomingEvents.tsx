import React from "react";
import { FiCalendar, FiClock, FiAlertCircle } from "react-icons/fi";

interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: "meeting" | "deadline" | "alert";
}

interface UpcomingEventsProps {
    events: Event[];
}

const EventIcon = ({ type }: { type: Event["type"] }) => {
    switch (type) {
        case "meeting":
            return <FiCalendar className="text-indigo-600" />;
        case "deadline":
            return <FiClock className="text-yellow-500" />;
        case "alert":
            return <FiAlertCircle className="text-red-600" />;
        default:
            return null;
    }
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    return (
        <section
            className="bg-white rounded-lg shadow p-6 max-h-[400px] overflow-y-auto mt-8"
            aria-label="Upcoming events"
        >
            <h3 className="text-xl font-semibold mb-6 text-indigo-900">Upcoming Events</h3>
            {events.length === 0 ? (
                <p className="text-gray-600 italic">No upcoming events.</p>
            ) : (
                <ul className="space-y-4">
                    {events.map(({ id, title, description, date, type }) => (
                        <li
                            key={id}
                            className="flex items-start gap-4 p-4 border border-indigo-100 rounded hover:shadow-md transition cursor-pointer"
                            tabIndex={0}
                            aria-label={`${title} on ${date.toLocaleDateString()}`}
                        >
                            <div className="text-2xl mt-1">
                                <EventIcon type={type} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-indigo-900">{title}</h4>
                                <p className="text-sm text-gray-700">{description}</p>
                                <time
                                    dateTime={date.toISOString()}
                                    className="text-xs text-gray-500 mt-1 block"
                                    aria-label={`Date and time: ${date.toLocaleString()}`}
                                >
                                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </time>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}