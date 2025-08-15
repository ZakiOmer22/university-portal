import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class ExamScheduleScreen extends StatefulWidget {
  const ExamScheduleScreen({super.key});

  @override
  State<ExamScheduleScreen> createState() => _ExamScheduleScreenState();
}

class _ExamScheduleScreenState extends State<ExamScheduleScreen> {
  // Set to false to test "exam period passed" UI
  bool examsAvailable = false;

  final List<Map<String, String>> exams = [
    {
      "course": "Mathematics 101",
      "code": "MATH101",
      "date": "2025-12-01",
      "time": "09:00 AM",
      "location": "Room 201",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
    },
    {
      "course": "Physics 201",
      "code": "PHYS201",
      "date": "2025-12-03",
      "time": "11:00 AM",
      "location": "Room 105",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
    },
    {
      "course": "Chemistry 101",
      "code": "CHEM101",
      "date": "2025-12-05",
      "time": "01:00 PM",
      "location": "Lab 3",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    final nextExam = examsAvailable && exams.isNotEmpty
        ? exams.first
        : {
            "course": "N/A",
            "date": "-",
            "time": "-",
            "location": "-",
            "avatarUrl": "",
          };

    return Scaffold(
      backgroundColor: cs.background,
      appBar: AppBar(
        title: const Text(
          "Student Dashboard",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: CircleAvatar(
              radius: 18,
              backgroundImage: const AssetImage('assets/images/avatar.png'),
              backgroundColor: cs.primaryContainer,
            ),
          ),
        ],
      ),
      drawer: _buildDrawer(cs, context),
      bottomNavigationBar: _buildBottomNav(cs),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: examsAvailable
            ? _buildExamAvailableUI(cs, nextExam)
            : _buildExamPassedUI(cs),
      ),
    );
  }

  Widget _buildExamAvailableUI(ColorScheme cs, Map<String, String> nextExam) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Announcement card
        Card(
          color: cs.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: cs.primary.withOpacity(0.2)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.campaign_rounded, color: cs.primary, size: 36),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    "Reminder: Check your upcoming exams and be prepared!",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: cs.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Next Exam card
        Card(
          color: cs.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: cs.primary.withOpacity(0.2)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundImage: NetworkImage(nextExam['avatarUrl'] ?? ''),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Next Exam: ${nextExam['course']}",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: cs.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text("Date: ${nextExam['date']}"),
                      Text("Time: ${nextExam['time']}"),
                      Text("Location: ${nextExam['location']}"),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Exam Table
        Expanded(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columnSpacing: 24,
              headingRowColor: MaterialStateProperty.all(
                cs.primary.withOpacity(0.15),
              ),
              columns: const [
                DataColumn(label: Text("Course Code")),
                DataColumn(label: Text("Course Title")),
                DataColumn(label: Text("Date")),
                DataColumn(label: Text("Time")),
                DataColumn(label: Text("Location")),
              ],
              rows: exams
                  .map(
                    (exam) => DataRow(
                      cells: [
                        DataCell(Text(exam["code"]!)),
                        DataCell(Text(exam["course"]!)),
                        DataCell(Text(exam["date"]!)),
                        DataCell(Text(exam["time"]!)),
                        DataCell(Text(exam["location"]!)),
                      ],
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildExamPassedUI(ColorScheme cs) {
    return Center(
      child: Card(
        color: cs.background,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: cs.primary.withOpacity(0.2)),
        ),
        elevation: 0,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Lottie.asset(
                'assets/animations/no_exam.json',
                width: 150,
                height: 150,
              ),
              const SizedBox(height: 16),
              Text(
                "Exam period has passed.",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: cs.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Drawer _buildDrawer(ColorScheme cs, BuildContext context) {
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

  BottomNavigationBar _buildBottomNav(ColorScheme cs) {
    return BottomNavigationBar(
      currentIndex: 0,
      selectedItemColor: cs.primary,
      unselectedItemColor: Colors.grey,
      onTap: (index) {},
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

  ListTile _drawerItem(IconData icon, String label, {VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade800),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: onTap,
    );
  }
}
