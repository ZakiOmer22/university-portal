import 'package:flutter/material.dart';

class CoursesPage extends StatefulWidget {
  const CoursesPage({super.key});

  @override
  State<CoursesPage> createState() => _CoursesPageState();
}

class _CoursesPageState extends State<CoursesPage> {
  int _currentIndex = 0;

  // Actual Semester Courses
  final List<Map<String, String>> actualCourses = const [
    {
      "title": "Mathematics 101",
      "instructor": "Dr. Ahmed",
      "status": "Ongoing",
      "semester": "Fall 2025",
      "mode": "Online",
      "code": "MATH101",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
    },
    {
      "title": "Physics 201",
      "instructor": "Prof. Samira",
      "status": "Upcoming",
      "semester": "Fall 2025",
      "mode": "Offline",
      "code": "PHYS201",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
    },
    {
      "title": "Chemistry 101",
      "instructor": "Dr. Hussein",
      "status": "Ongoing",
      "semester": "Fall 2025",
      "mode": "Online",
      "code": "CHEM101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
    {
      "title": "Computer Science 101",
      "instructor": "Prof. Leyla",
      "status": "Upcoming",
      "semester": "Fall 2025",
      "mode": "Offline",
      "code": "CS101",
      "avatarUrl": "https://i.pravatar.cc/150?img=4",
    },
    {
      "title": "English Literature",
      "instructor": "Dr. Omar",
      "status": "Ongoing",
      "semester": "Fall 2025",
      "mode": "Online",
      "code": "ENG101",
      "avatarUrl": "https://i.pravatar.cc/150?img=5",
    },
    {
      "title": "Economics 101",
      "instructor": "Prof. Fatima",
      "status": "Upcoming",
      "semester": "Fall 2025",
      "mode": "Offline",
      "code": "ECON101",
      "avatarUrl": "https://i.pravatar.cc/150?img=6",
    },
  ];

  // Retaken Courses (example: placeholder if none)
  final List<Map<String, String>> retakenCourses = const [
    {
      "title": "History 101",
      "instructor": "Mr. Ali",
      "status": "Completed",
      "semester": "Spring 2025",
      "mode": "Online",
      "code": "HIST101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
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

  IconData _getIcon(String status) {
    switch (status) {
      case "Ongoing":
        return Icons.play_circle_fill_rounded;
      case "Upcoming":
        return Icons.schedule_rounded;
      case "Completed":
        return Icons.check_circle_rounded;
      default:
        return Icons.menu_book_rounded;
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case "Ongoing":
        return Colors.green;
      case "Upcoming":
        return Colors.orange;
      case "Completed":
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  void _showCourseDetails(Map<String, String> course) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(course["title"]!),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                backgroundImage: NetworkImage(course["avatarUrl"]!),
                radius: 30,
              ),
              const SizedBox(height: 12),
              _detailRow("Instructor", course["instructor"]!),
              _detailRow("Status", course["status"]!),
              _detailRow("Semester", course["semester"]!),
              _detailRow("Mode", course["mode"]!),
              _detailRow("Course Code", course["code"]!),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Close"),
            ),
          ],
        );
      },
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          Text(value),
        ],
      ),
    );
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

      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 24,
                ),
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
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/icon.png',
                      width: 18,
                      height: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      "Powered by eALIF Team",
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Header
          Row(
            children: const [
              Icon(Icons.menu_book_rounded, size: 28),
              SizedBox(width: 8),
              Text(
                "Courses",
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            "Here are all your enrolled courses.",
            style: TextStyle(color: Colors.grey.shade700, fontSize: 16),
          ),
          const SizedBox(height: 24),

          // Actual Semester Courses
          const Text(
            "Current Semester Courses",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          ...actualCourses.map((course) {
            return GestureDetector(
              onTap: () => _showCourseDetails(course),
              child: _courseCard(course, cs),
            );
          }).toList(),

          const SizedBox(height: 24),
          const Text(
            "Retaken Courses",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          retakenCourses.isEmpty
              ? Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(child: Text("No retaken courses found.")),
                )
              : Column(
                  children: retakenCourses.map((course) {
                    return GestureDetector(
                      onTap: () => _showCourseDetails(course),
                      child: _courseCard(course, cs),
                    );
                  }).toList(),
                ),
        ],
      ),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: cs.primary,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
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
      ),
    );
  }

  ListTile _drawerItem(IconData icon, String label, String route) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade800),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: () => Navigator.pushNamed(context, route),
    );
  }

  Widget _courseCard(Map<String, String> course, ColorScheme cs) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white,
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
        border: Border.all(color: const Color(0x11000000)),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(course["avatarUrl"]!),
        ),
        title: Text(
          course["title"]!,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
        subtitle: Text(
          "Instructor: ${course["instructor"]}\nSemester: ${course["semester"]} • Mode: ${course["mode"]}",
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _getIcon(course["status"]!),
              color: _statusColor(course["status"]!),
            ),
            const SizedBox(height: 2),
            Text(
              course["status"]!,
              style: TextStyle(
                color: _statusColor(course["status"]!),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
