import React from "react";
import { User, Mail, Phone, Calendar, BookOpen, GraduationCap, Building, School } from "lucide-react";

interface Student {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  enrollmentNumber: string;
  department: string;
  faculty: string;
  currentSemester: number;
}

export default function AccountTab({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{student.firstName} {student.lastName}</h2>
            <p className="text-indigo-100">{student.enrollmentNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Personal Details" 
          icon={<User className="w-5 h-5" />}
          gradient="from-blue-500 to-cyan-500"
        >
          <Detail label="Full Name" value={`${student.firstName} ${student.lastName}`} icon={<User size={16} />} />
          <Detail label="Email" value={student.email} icon={<Mail size={16} />} />
          <Detail label="Phone" value={student.phone || "Not provided"} icon={<Phone size={16} />} />
          <Detail
            label="Date of Birth"
            value={student.dob ? new Date(student.dob).toLocaleDateString() : "Not provided"}
            icon={<Calendar size={16} />}
          />
        </Card>

        <Card 
          title="University Information" 
          icon={<GraduationCap className="w-5 h-5" />}
          gradient="from-purple-500 to-pink-500"
        >
          <Detail label="Enrollment Number" value={student.enrollmentNumber} icon={<BookOpen size={16} />} />
          <Detail label="Department" value={student.department} icon={<Building size={16} />} />
          <Detail label="Faculty" value={student.faculty} icon={<School size={16} />} />
          <Detail
            label="Current Semester"
            value={
              student.currentSemester !== undefined && student.currentSemester !== null
                ? `Semester ${student.currentSemester}`
                : "Not specified"
            }
            icon={<GraduationCap size={16} />}
          />
        </Card>
      </div>
    </div>
  );
}

function Card({ 
  title, 
  children, 
  icon,
  gradient 
}: { 
  title: string; 
  children: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <dl className="space-y-4">{children}</dl>
      </div>
    </section>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-gray-500 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
        <dd className="text-gray-900 font-medium">{value}</dd>
      </div>
    </div>
  );
}