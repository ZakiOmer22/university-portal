import 'package:flutter/material.dart';

class AttendancePage extends StatefulWidget {
  const AttendancePage({super.key});

  @override
  State<AttendancePage> createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  int _currentIndex = 0;

  final List<Map<String, dynamic>> attendanceData = [
    {
      "title": "Mathematics 101",
      "code": "MATH101",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
      "attendance": 85,
      "credits": 3,
    },
    {
      "title": "Physics 201",
      "code": "PHYS201",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
      "attendance": 92,
      "credits": 4,
    },
    {
      "title": "Chemistry 101",
      "code": "CHEM101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
      "attendance": 76,
      "credits": 3,
    },
    {
      "title": "English 101",
      "code": "ENG101",
      "avatarUrl": "https://i.pravatar.cc/150?img=4",
      "attendance": 88,
      "credits": 2,
    },
  ];

  void _onAvatarMenu(String value) {
    switch (value) {
      case 'profile':
        Navigator.pushNamed(context, '/profile');
        break;
      case 'dashboard':
        Navigator.pushNamed(context, '/dashboard');
        break;
      case 'logout':
        Navigator.pushNamed(context, '/logout');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Student Dashboard",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: _onAvatarMenu,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'profile', child: Text('Profile')),
              PopupMenuItem(value: 'dashboard', child: Text('Dashboard')),
              PopupMenuItem(value: 'logout', child: Text('Log out')),
            ],
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: CircleAvatar(
                radius: 18,
                backgroundImage: const AssetImage('assets/images/avatar.png'),
                backgroundColor: cs.primaryContainer,
              ),
            ),
          ),
        ],
      ),
      drawer: _buildDrawer(cs),
      bottomNavigationBar: _buildBottomNavigationBar(cs),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Attendance",
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  ...attendanceData.map((course) {
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 28,
                              backgroundImage: NetworkImage(
                                course['avatarUrl'],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "${course['title']} (${course['code']})",
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    "Attendance: ${course['attendance']}%",
                                    style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: LinearProgressIndicator(
                                      value:
                                          (course['attendance'] as int) / 100,
                                      minHeight: 8,
                                      backgroundColor: cs.primary.withOpacity(
                                        0.1,
                                      ),
                                      color: cs.primary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                  const SizedBox(height: 24),
                  const Text(
                    "Credits Attended",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  _buildCreditTable(attendanceData),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditTable(List<Map<String, dynamic>> data) {
    return Table(
      border: TableBorder.all(color: Colors.grey.shade300),
      columnWidths: const {0: FlexColumnWidth(3), 1: FlexColumnWidth(1)},
      children: [
        const TableRow(
          decoration: BoxDecoration(color: Color(0xFFE0E0E0)),
          children: [
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Course",
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Credits",
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
        ...data.map((course) {
          return TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text("${course['title']} (${course['code']})"),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(course['credits'].toString()),
              ),
            ],
          );
        }).toList(),
      ],
    );
  }

  Drawer _buildDrawer(ColorScheme cs) {
    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
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
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _drawerItem(
                    Icons.dashboard_rounded,
                    "Dashboard",
                    onTap: () => Navigator.pushNamed(context, '/students/home'),
                  ),
                  _drawerItem(
                    Icons.book_rounded,
                    "Courses",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/courses'),
                  ),
                  _drawerItem(
                    Icons.replay_circle_filled_rounded,
                    "Course Retake",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/course-retake'),
                  ),
                  _drawerItem(
                    Icons.assignment_turned_in_rounded,
                    "Attendance",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/attendance'),
                  ),
                  _drawerItem(
                    Icons.payments_rounded,
                    "Finance",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/finance'),
                  ),
                  _drawerItem(
                    Icons.calendar_month_rounded,
                    "Academic Calendar",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/schedule'),
                  ),
                  _drawerItem(
                    Icons.grade_rounded,
                    "Grades & Transcripts",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/grades'),
                  ),
                  _drawerItem(
                    Icons.event_available_rounded,
                    "Exam Schedules",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/exam-report'),
                  ),
                  _drawerItem(
                    Icons.groups_rounded,
                    "Community",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/announcements'),
                  ),
                  _drawerItem(
                    Icons.help_rounded,
                    "Help & Support",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/support'),
                  ),
                  _drawerItem(
                    Icons.settings_rounded,
                    "Settings",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/settings'),
                  ),
                ],
              ),
            ),
            const Divider(),
            Padding(
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
            ),
          ],
        ),
      ),
    );
  }

  ListTile _drawerItem(IconData icon, String label, {VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade800),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: onTap,
    );
  }

  BottomNavigationBar _buildBottomNavigationBar(ColorScheme cs) {
    return BottomNavigationBar(
      currentIndex: _currentIndex,
      selectedItemColor: cs.primary,
      unselectedItemColor: Colors.grey,
      onTap: (index) => setState(() => _currentIndex = index),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
        BottomNavigationBarItem(
          icon: Icon(Icons.mail_rounded),
          label: 'Messages',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_rounded),
          label: 'Profile',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.more_horiz_rounded),
          label: 'More',
        ),
      ],
    );
  }
}
