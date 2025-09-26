"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  read: boolean;
}

const dummyMessages: Message[] = [
  { id: "m1", from: "Alice Johnson", subject: "Question about Assignment 3", date: "2025-08-19", read: false },
  { id: "m2", from: "Bob Smith", subject: "Requesting Meeting", date: "2025-08-18", read: true },
  { id: "m3", from: "Charlie Lee", subject: "Feedback on Project Proposal", date: "2025-08-17", read: false },
  { id: "m4", from: "Diana Ross", subject: "Attendance Issue", date: "2025-08-16", read: true },
];

export default function LeaderMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const user = { fullName: "Leader User", role: "LEADER" };

  useEffect(() => {
    setTimeout(() => {
      try {
        setMessages(dummyMessages);
        setLoading(false);
      } catch {
        setError("Failed to load messages.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredMessages = messages.filter((m) =>
    m.from.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout user={user} loading={loading}>
      <section className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-indigo-900">Messages</h2>
          <input
            type="text"
            placeholder="Search messages..."
            className="border rounded-lg p-2 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

        {/* Messages List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredMessages.map((msg) => (
              <li
                key={msg.id}
                className={`border rounded-lg p-4 bg-white shadow hover:shadow-lg transition flex justify-between items-center ${
                  msg.read ? "opacity-80" : "bg-indigo-50"
                }`}
              >
                <div>
                  <p className="font-semibold text-indigo-900">{msg.from}</p>
                  <p className="text-sm text-gray-700">{msg.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  onClick={() => alert(`Open message: ${msg.subject}`)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}
