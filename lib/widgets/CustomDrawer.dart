import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  final BuildContext contextRef;
  const CustomDrawer({super.key, required this.contextRef});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(cs),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _drawerItem(
                    Icons.dashboard_rounded,
                    "Dashboard",
                    '/students/home',
                  ),
                  _drawerItem(
                    Icons.book_rounded,
                    "Courses",
                    '/students/courses',
                  ),
                  _drawerItem(
                    Icons.replay_circle_filled_rounded,
                    "Course Retake",
                    '/students/course-retake',
                  ),
                  _drawerItem(
                    Icons.assignment_turned_in_rounded,
                    "Attendance",
                    '/students/attendance',
                  ),
                  _drawerItem(
                    Icons.payments_rounded,
                    "Finance",
                    '/students/finance',
                  ),
                  _drawerItem(
                    Icons.calendar_month_rounded,
                    "Academic Calendar",
                    '/students/schedule',
                  ),
                  _drawerItem(
                    Icons.grade_rounded,
                    "Grades & Transcripts",
                    '/students/grades',
                  ),
                  _drawerItem(
                    Icons.event_available_rounded,
                    "Exam Schedules",
                    '/students/exam-report',
                  ),
                  _drawerItem(
                    Icons.groups_rounded,
                    "Community",
                    '/students/announcements',
                  ),
                  _drawerItem(
                    Icons.help_rounded,
                    "Help & Support",
                    '/students/support',
                  ),
                  _drawerItem(
                    Icons.settings_rounded,
                    "Settings",
                    '/students/settings',
                  ),
                ],
              ),
            ),
            const Divider(),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ColorScheme cs) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [cs.primary, cs.primaryContainer],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 32,
            backgroundImage: AssetImage('assets/images/avatar.png'),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "John Doe",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "University of Hargeisa",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.white70,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Student • ID: 2025001",
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _drawerItem(IconData icon, String label, String route) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade800),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: () => Navigator.pushNamed(contextRef, route),
    );
  }

  Widget _buildFooter() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset('assets/images/icon.png', width: 18, height: 18),
          const SizedBox(width: 8),
          Text(
            "Powered by eALIF Team",
            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }
}
