import 'package:flutter/material.dart';

class ParentLink {
  final String label;
  final IconData icon;
  final String route;
  final Color activeColor;
  final Color inactiveColor;

  ParentLink({
    required this.label,
    required this.icon,
    required this.route,
    required this.activeColor,
    required this.inactiveColor,
  });
}

final List<ParentLink> parentLinks = [
  ParentLink(
    label: "Home",
    icon: Icons.home_rounded,
    route: "/parent/home",
    activeColor: Colors.grey.shade800, // matches bg-gray-600
    inactiveColor: Colors.grey.shade400, // text-gray-600
  ),
  ParentLink(
    label: "Fees & Payments",
    icon: Icons.attach_money_rounded, // FaMoneyCheckAlt equivalent
    route: "/dashboard/parent/fees",
    activeColor: Colors.indigo.shade600,
    inactiveColor: Colors.indigo.shade200,
  ),
  ParentLink(
    label: "Academic Schedule",
    icon: Icons.calendar_today_rounded, // FaCalendarAlt equivalent
    route: "/dashboard/parent/schedule",
    activeColor: Colors.blue.shade600,
    inactiveColor: Colors.blue.shade200,
  ),
  ParentLink(
    label: "Teacher Messages",
    icon: Icons.mail_rounded, // FaEnvelope equivalent
    route: "/dashboard/parent/messages",
    activeColor: Colors.green.shade600,
    inactiveColor: Colors.green.shade200,
  ),
  ParentLink(
    label: "Attendance Record",
    icon: Icons.check_circle_rounded, // FaUserCheck equivalent
    route: "/dashboard/parent/attendance",
    activeColor: Colors.yellow.shade500,
    inactiveColor: Colors.yellow.shade200,
  ),
  ParentLink(
    label: "Progress Report",
    icon: Icons.bar_chart_rounded, // FaChartBar equivalent
    route: "/dashboard/parent/progress",
    activeColor: Colors.purple.shade600,
    inactiveColor: Colors.purple.shade200,
  ),
  ParentLink(
    label: "Grades Overview",
    icon: Icons.school_rounded, // FaGraduationCap equivalent
    route: "/dashboard/parent/grades",
    activeColor: Colors.red.shade600,
    inactiveColor: Colors.red.shade200,
  ),
];
