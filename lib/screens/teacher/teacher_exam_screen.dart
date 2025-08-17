import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherExams extends StatefulWidget {
  const TeacherExams({super.key});

  @override
  State<TeacherExams> createState() => _TeacherExamsState();
}

class _TeacherExamsState extends State<TeacherExams> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _exams = [
    {
      "exam": "Midterm CS101",
      "subject": "Computer Science",
      "date": "2025-09-10",
      "duration": "2 hrs",
      "status": "Scheduled",
    },
    {
      "exam": "Final ENG201",
      "subject": "English Literature",
      "date": "2025-12-01",
      "duration": "3 hrs",
      "status": "Draft",
    },
    {
      "exam": "Quiz MATH301",
      "subject": "Calculus",
      "date": "2025-08-25",
      "duration": "1 hr",
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

  List<Map<String, String>> get _filteredExams {
    if (_searchQuery.isEmpty) return _exams;
    return _exams.where((exam) {
      final query = _searchQuery.toLowerCase();
      return exam["exam"]!.toLowerCase().contains(query) ||
          exam["subject"]!.toLowerCase().contains(query) ||
          exam["status"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildExamCard(Map<String, String> exam) {
    Color statusColor;
    switch (exam["status"]) {
      case "Scheduled":
        statusColor = Colors.blue;
        break;
      case "Draft":
        statusColor = Colors.orange;
        break;
      case "Completed":
        statusColor = Colors.green;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${exam["exam"]} - ${exam["subject"]}",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Date: ${exam["date"]}"),
            Text("Duration: ${exam["duration"]}"),
            Text(
              "Status: ${exam["status"]}",
              style: TextStyle(fontWeight: FontWeight.bold, color: statusColor),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.visibility),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Viewing ${exam["exam"]} details")),
            );
            // Optional: navigate to detailed exam view
          },
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Selected exam: ${exam["exam"]}")),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Exams Management",
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
                        hintText: "Search by exam, subject, or status",
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
                      child: _filteredExams.isEmpty
                          ? const Center(child: Text("No exams found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredExams.length,
                              itemBuilder: (context, index) =>
                                  _buildExamCard(_filteredExams[index]),
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
