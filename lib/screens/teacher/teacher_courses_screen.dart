import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherCoursesPage extends StatefulWidget {
  const TeacherCoursesPage({super.key});

  @override
  State<TeacherCoursesPage> createState() => _TeacherCoursesPageState();
}

class _TeacherCoursesPageState extends State<TeacherCoursesPage> {
  bool _loading = false;
  int _selectedIndex = 0; // Bottom nav selected index

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _loading = false);
  }

  Future<void> _handleAvatarMenu(String value) async {
    if (value == "logout") {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove("isLoggedIn");
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Selected: $value")));
      }
    }
  }

  final List<Map<String, String>> _teacherCourses = [
    {
      "title": "Advanced Mathematics",
      "schedule": "Mon & Wed, 10:00 AM - 11:30 AM",
      "students": "35",
    },
    {
      "title": "Physics 101",
      "schedule": "Tue & Thu, 1:00 PM - 2:30 PM",
      "students": "28",
    },
    {
      "title": "Chemistry Lab",
      "schedule": "Fri, 9:00 AM - 12:00 PM",
      "students": "20",
    },
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
      // Add page navigation logic if needed
    });
  }

  Widget _buildCourseCard(Map<String, String> course) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: const Icon(Icons.book, size: 40, color: Colors.indigo),
        title: Text(course["title"]!),
        subtitle: Text(
          "${course["schedule"]}\nStudents: ${course["students"]}",
        ),
        isThreeLine: true,
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Opened ${course["title"]} details")),
          );
        },
      ),
    );
  }

  Widget _buildSection({required String title, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        child,
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildCardItem({
    required IconData icon,
    required String title,
    String? subtitle,
    Color color = Colors.blue,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        leading: Icon(icon, size: 40, color: color),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: subtitle != null ? Text(subtitle) : null,
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text("Opened: $title")));
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "My Courses",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    const Text(
                      "My Courses",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Display teacher courses
                    Column(
                      children: _teacherCourses.map(_buildCourseCard).toList(),
                    ),
                    // Upcoming Classes section
                    _buildSection(
                      title: "Upcoming Classes",
                      child: Column(
                        children: [
                          _buildCardItem(
                            icon: Icons.calendar_today,
                            title: "Linear Algebra",
                            subtitle: "Monday, 10:00 AM",
                            color: Colors.purple,
                          ),
                          _buildCardItem(
                            icon: Icons.calendar_today,
                            title: "Organic Chemistry",
                            subtitle: "Wednesday, 11:00 AM",
                            color: Colors.purple,
                          ),
                        ],
                      ),
                    ),
                    // Assignments section
                    _buildSection(
                      title: "Pending Assignments",
                      child: Column(
                        children: [
                          _buildCardItem(
                            icon: Icons.assignment,
                            title: "Math Homework 5",
                            subtitle: "Due: Friday, 5:00 PM",
                            color: Colors.orange,
                          ),
                          _buildCardItem(
                            icon: Icons.assignment,
                            title: "Physics Lab Report",
                            subtitle: "Due: Thursday, 3:00 PM",
                            color: Colors.orange,
                          ),
                          _buildCardItem(
                            icon: Icons.assignment,
                            title: "Chemistry Project",
                            subtitle: "Due: Monday, 12:00 PM",
                            color: Colors.orange,
                          ),
                        ],
                      ),
                    ),
                    // Announcements section
                    _buildSection(
                      title: "Announcements",
                      child: Column(
                        children: [
                          _buildCardItem(
                            icon: Icons.campaign,
                            title: "Campus Closed Next Monday",
                            color: Colors.green,
                          ),
                          _buildCardItem(
                            icon: Icons.campaign,
                            title: "New Course Materials Uploaded",
                            color: Colors.green,
                          ),
                          _buildCardItem(
                            icon: Icons.campaign,
                            title: "Staff Meeting on Thursday",
                            color: Colors.green,
                          ),
                        ],
                      ),
                    ),
                    // New Section: Messages
                    _buildSection(
                      title: "Messages",
                      child: Column(
                        children: [
                          _buildCardItem(
                            icon: Icons.message,
                            title: "Message from Dean",
                            subtitle: "Please submit grades by Friday",
                            color: Colors.teal,
                          ),
                          _buildCardItem(
                            icon: Icons.message,
                            title: "Message from Admin",
                            subtitle: "New classroom allocation available",
                            color: Colors.teal,
                          ),
                        ],
                      ),
                    ),
                    // New Section: Reminders
                    _buildSection(
                      title: "Reminders",
                      child: Column(
                        children: [
                          _buildCardItem(
                            icon: Icons.notifications,
                            title: "Prepare midterm exam",
                            subtitle: "Due next week",
                            color: Colors.redAccent,
                          ),
                          _buildCardItem(
                            icon: Icons.notifications,
                            title: "Update attendance records",
                            subtitle: "Daily",
                            color: Colors.redAccent,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: "Dashboard",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: "Students"),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: "Attendance",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Settings",
          ),
        ],
      ),
    );
  }
}
