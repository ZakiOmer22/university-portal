import React from "react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Personal Details">
        <Detail label="Full Name" value={`${student.firstName} ${student.lastName}`} />
        <Detail label="Email" value={student.email} />
        <Detail label="Phone" value={student.phone || "N/A"} />
        <Detail
          label="Date of Birth"
          value={student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
        />
      </Card>

      <Card title="University Info">
        <Detail label="Enrollment Number" value={student.enrollmentNumber} />
        <Detail label="Department" value={student.department} />
        <Detail label="Faculty" value={student.faculty} />
        <Detail
          label="Current Semester"
          value={
            student.currentSemester !== undefined && student.currentSemester !== null
              ? student.currentSemester.toString()
              : "N/A"
          }
        />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-indigo-50 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-indigo-900 mb-4">{title}</h3>
      <dl className="space-y-3 text-gray-700">{children}</dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-indigo-700 font-semibold">{label}</dt>
      <dd className="text-gray-700">{value}</dd>
    </>
  );
}
