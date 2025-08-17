import 'package:flutter/material.dart';

class TeacherLink {
  final String label;
  final IconData icon;
  final String route;
  final Color activeColor;

  TeacherLink({
    required this.label,
    required this.icon,
    required this.route,
    required this.activeColor,
  });
}

final List<TeacherLink> teacherLinks = [
  TeacherLink(
    label: "Home",
    icon: Icons.home_rounded,
    route: "/teacher/home",
    activeColor: Colors.indigo,
  ),
  TeacherLink(
    label: "My Courses",
    icon: Icons.book_rounded,
    route: "/dashboard/teacher/courses",
    activeColor: Colors.blue,
  ),
  TeacherLink(
    label: "Student Messages",
    icon: Icons.mail_rounded,
    route: "/dashboard/teacher/messages",
    activeColor: Colors.amber,
  ),
  TeacherLink(
    label: "Exam Records Submission",
    icon: Icons.description_rounded,
    route: "/dashboard/teacher/exam-records",
    activeColor: Colors.purple,
  ),
  TeacherLink(
    label: "Student Attendance",
    icon: Icons.check_circle_rounded,
    route: "/dashboard/teacher/attendance",
    activeColor: Colors.green,
  ),
  TeacherLink(
    label: "Student Submissions",
    icon: Icons.assignment_rounded,
    route: "/dashboard/teacher/submissions",
    activeColor: Colors.teal,
  ),
  TeacherLink(
    label: "Payment Verification",
    icon: Icons.payments_rounded,
    route: "/dashboard/teacher/payments",
    activeColor: Colors.orange,
  ),
  TeacherLink(
    label: "Announcements",
    icon: Icons.campaign_rounded,
    route: "/dashboard/teacher/announcements",
    activeColor: Colors.red,
  ),
  TeacherLink(
    label: "Schedule",
    icon: Icons.calendar_today_rounded,
    route: "/dashboard/teacher/schedule",
    activeColor: Colors.green,
  ),
  TeacherLink(
    label: "Gradebook",
    icon: Icons.show_chart_rounded,
    route: "/dashboard/teacher/grades",
    activeColor: Colors.redAccent,
  ),
  TeacherLink(
    label: "Leave Requests",
    icon: Icons.edit_note_rounded,
    route: "/dashboard/teacher/leave-requests",
    activeColor: Colors.indigo,
  ),
  TeacherLink(
    label: "Student Counseling",
    icon: Icons.school_rounded,
    route: "/dashboard/teacher/counseling",
    activeColor: Colors.pink,
  ),
  TeacherLink(
    label: "Classroom Management",
    icon: Icons.meeting_room_rounded,
    route: "/dashboard/teacher/classroom",
    activeColor: Colors.teal,
  ),
  TeacherLink(
    label: "Library Resources",
    icon: Icons.menu_book_rounded,
    route: "/dashboard/teacher/resources",
    activeColor: Colors.indigoAccent,
  ),
  TeacherLink(
    label: "Exams Management",
    icon: Icons.assignment_outlined,
    route: "/dashboard/teacher/exams",
    activeColor: Colors.purple,
  ),
  TeacherLink(
    label: "Support",
    icon: Icons.support_agent_rounded,
    route: "/dashboard/teacher/support",
    activeColor: Colors.cyan,
  ),
  TeacherLink(
    label: "Profile",
    icon: Icons.person_rounded,
    route: "/dashboard/teacher/profile",
    activeColor: Colors.pinkAccent,
  ),
];
