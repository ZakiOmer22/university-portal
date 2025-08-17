import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherGrades extends StatefulWidget {
  const TeacherGrades({super.key});

  @override
  State<TeacherGrades> createState() => _TeacherGradesState();
}

class _TeacherGradesState extends State<TeacherGrades> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _grades = [
    {
      "student": "Alice Johnson",
      "course": "Advanced Mathematics",
      "grade": "A",
      "comments": "Excellent work",
    },
    {
      "student": "Bob Smith",
      "course": "Physics 101",
      "grade": "B+",
      "comments": "Good effort",
    },
    {
      "student": "Charlie Davis",
      "course": "Chemistry Lab",
      "grade": "A-",
      "comments": "Well done",
    },
    // Add more dummy grades
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

  List<Map<String, String>> get _filteredGrades {
    if (_searchQuery.isEmpty) return _grades;
    return _grades.where((grade) {
      final query = _searchQuery.toLowerCase();
      return grade["student"]!.toLowerCase().contains(query) ||
          grade["course"]!.toLowerCase().contains(query) ||
          grade["grade"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildGradeCard(Map<String, String> grade) {
    Color gradeColor;
    switch (grade["grade"]) {
      case "A":
      case "A-":
        gradeColor = Colors.green;
        break;
      case "B+":
      case "B":
        gradeColor = Colors.blue;
        break;
      case "C":
        gradeColor = Colors.orange;
        break;
      default:
        gradeColor = Colors.red;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${grade["course"]} - ${grade["grade"]}",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: gradeColor,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Student: ${grade["student"]}"),
            Text("Comments: ${grade["comments"]}"),
          ],
        ),
        trailing: Icon(Icons.arrow_forward_ios, size: 18),
        onTap: () {
          // Placeholder for detailed grade view
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Viewing grade for ${grade["student"]}")),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: "Gradebook", onAvatarMenu: _handleAvatarMenu),
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
                        hintText: "Search by student, course, or grade",
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
                      child: _filteredGrades.isEmpty
                          ? const Center(child: Text("No grades found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredGrades.length,
                              itemBuilder: (context, index) =>
                                  _buildGradeCard(_filteredGrades[index]),
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
