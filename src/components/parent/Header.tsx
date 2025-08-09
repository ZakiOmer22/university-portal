import React from "react";

interface Student {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  department: string;
  faculty: string;
  enrollmentNumber: string;
  email: string;
  phone?: string;
  dob?: string;
}

interface HeaderProps {
  student: Student;
}

export default function Header({ student }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <img
          src={student.profilePicture || ""}
          alt={`${student.firstName} ${student.lastName}`}
          className="w-28 h-28 rounded-full shadow-lg object-cover border-4 border-indigo-600"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=4f46e5&color=fff&size=256`;
          }}
        />
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-indigo-900 mb-1">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-indigo-600 font-semibold tracking-wide uppercase">
            {student.department} - {student.faculty}
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            Enrollment #:{" "}
            <span className="font-semibold">{student.enrollmentNumber}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Email: <span className="font-semibold">{student.email}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Phone: <span className="font-semibold">{student.phone || "N/A"}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Date of Birth:{" "}
            <span className="font-semibold">
              {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
