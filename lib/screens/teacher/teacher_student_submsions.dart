import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class StudentSubmissionsPage extends StatefulWidget {
  const StudentSubmissionsPage({super.key});

  @override
  State<StudentSubmissionsPage> createState() => _StudentSubmissionsPageState();
}

class _StudentSubmissionsPageState extends State<StudentSubmissionsPage> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _submissions = [
    {
      "student": "Alice Johnson",
      "course": "Advanced Mathematics",
      "assignment": "Homework 5",
      "status": "Pending",
      "submitted": "2025-08-15",
    },
    {
      "student": "Bob Smith",
      "course": "Physics 101",
      "assignment": "Lab Report 2",
      "status": "Submitted",
      "submitted": "2025-08-14",
    },
    {
      "student": "Charlie Davis",
      "course": "Chemistry Lab",
      "assignment": "Experiment 3",
      "status": "Graded",
      "submitted": "2025-08-12",
    },
    // Add more dummy submissions
  ];

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

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  List<Map<String, String>> get _filteredSubmissions {
    if (_searchQuery.isEmpty) return _submissions;
    return _submissions.where((sub) {
      final query = _searchQuery.toLowerCase();
      return sub["student"]!.toLowerCase().contains(query) ||
          sub["course"]!.toLowerCase().contains(query) ||
          sub["assignment"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildSubmissionCard(Map<String, String> submission) {
    Color statusColor;
    switch (submission["status"]) {
      case "Submitted":
        statusColor = Colors.blue;
        break;
      case "Graded":
        statusColor = Colors.green;
        break;
      default:
        statusColor = Colors.orange;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(submission["assignment"]!),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Student: ${submission["student"]}"),
            Text("Course: ${submission["course"]}"),
            Text("Submitted: ${submission["submitted"]}"),
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            submission["status"]!,
            style: TextStyle(color: statusColor, fontWeight: FontWeight.bold),
          ),
        ),
        onTap: () {
          // Placeholder for detailed view
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Opened ${submission["assignment"]} submission"),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Submissions",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.search),
                        hintText: "Search by student, course, or assignment",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: _filteredSubmissions.isEmpty
                          ? const Center(child: Text("No submissions found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredSubmissions.length,
                              itemBuilder: (context, index) =>
                                  _buildSubmissionCard(
                                    _filteredSubmissions[index],
                                  ),
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
