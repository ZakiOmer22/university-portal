import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherCounseling extends StatefulWidget {
  const TeacherCounseling({super.key});

  @override
  State<TeacherCounseling> createState() => _TeacherCounselingState();
}

class _TeacherCounselingState extends State<TeacherCounseling> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _counselingSessions = [
    {
      "student": "Ali Mohamed",
      "topic": "Academic performance",
      "date": "2025-08-18",
      "status": "Completed",
    },
    {
      "student": "Hodan Abdi",
      "topic": "Behavior issues",
      "date": "2025-08-20",
      "status": "Pending",
    },
    {
      "student": "Abdirahman Yusuf",
      "topic": "Career guidance",
      "date": "2025-08-21",
      "status": "Completed",
    },
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

  List<Map<String, String>> get _filteredSessions {
    if (_searchQuery.isEmpty) return _counselingSessions;
    return _counselingSessions.where((session) {
      final query = _searchQuery.toLowerCase();
      return session["student"]!.toLowerCase().contains(query) ||
          session["topic"]!.toLowerCase().contains(query) ||
          session["status"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildSessionCard(Map<String, String> session) {
    Color statusColor;
    switch (session["status"]) {
      case "Completed":
        statusColor = Colors.green;
        break;
      case "Pending":
        statusColor = Colors.orange;
        break;
      default:
        statusColor = Colors.red;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${session["student"]} - ${session["topic"]}",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Date: ${session["date"]}"),
            Text(
              "Status: ${session["status"]}",
              style: TextStyle(fontWeight: FontWeight.bold, color: statusColor),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.print),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Printing counseling summary...")),
            );
            // implement actual print logic if needed
          },
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Open notes for ${session["student"]}")),
          );
          // implement detailed counseling note view/edit
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Counseling",
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
                        hintText: "Search by student, topic, or status",
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
                      child: _filteredSessions.isEmpty
                          ? const Center(
                              child: Text("No counseling sessions found"),
                            )
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredSessions.length,
                              itemBuilder: (context, index) =>
                                  _buildSessionCard(_filteredSessions[index]),
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Navigate to Add Counseling Session")),
          );
        },
        label: const Text("Add Session"),
        icon: const Icon(Icons.add),
      ),
    );
  }
}
