import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherExamRecordsPage extends StatefulWidget {
  const TeacherExamRecordsPage({super.key});

  @override
  State<TeacherExamRecordsPage> createState() => _TeacherExamRecordsPageState();
}

class _TeacherExamRecordsPageState extends State<TeacherExamRecordsPage> {
  int _selectedIndex = 0;
  bool _loading = false;

  final List<Map<String, String>> _courses = [
    {"id": "course1", "code": "ENG101", "name": "English Literature"},
    {"id": "course2", "code": "HIST202", "name": "Modern History"},
    {"id": "course3", "code": "PHYS150", "name": "Intro to Physics"},
  ];

  String _selectedCourseId = "course1";

  final Map<String, List<Map<String, dynamic>>> _studentsByCourse = {
    "course1": List.generate(
      25,
      (i) => {
        "id": "stu$i",
        "fullName": "Student ${i + 1}",
        "email": "student${i + 1}@example.com",
        "midterm": null,
        "final": null,
        "assignment": null,
      },
    ),
    "course2": List.generate(
      25,
      (i) => {
        "id": "stu$i",
        "fullName": "Student ${i + 1}",
        "email": "student${i + 1}@example.com",
        "midterm": null,
        "final": null,
        "assignment": null,
      },
    ),
    "course3": List.generate(
      25,
      (i) => {
        "id": "stu$i",
        "fullName": "Student ${i + 1}",
        "email": "student${i + 1}@example.com",
        "midterm": null,
        "final": null,
        "assignment": null,
      },
    ),
  };

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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

  Widget _buildStudentCard(Map<String, dynamic> student) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              student["fullName"],
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 4),
            Text(student["email"], style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildScoreField("Midterm", student, "midterm"),
                ),
                const SizedBox(width: 8),
                Expanded(child: _buildScoreField("Final", student, "final")),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildScoreField("Assignment", student, "assignment"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreField(
    String label,
    Map<String, dynamic> student,
    String key,
  ) {
    return TextFormField(
      initialValue: student[key]?.toString() ?? "",
      keyboardType: TextInputType.number,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      ),
      onChanged: (val) {
        setState(() {
          student[key] = int.tryParse(val);
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final students = _studentsByCourse[_selectedCourseId]!;
    return Scaffold(
      appBar: CustomAppBar(
        title: "Exam Records",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Text(
                        "Select Course: ",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 12),
                      DropdownButton<String>(
                        value: _selectedCourseId,
                        onChanged: (val) {
                          setState(() {
                            _selectedCourseId = val!;
                          });
                        },
                        items: _courses
                            .map(
                              (c) => DropdownMenuItem<String>(
                                value: c["id"],
                                child: Text("${c["code"]} - ${c["name"]}"),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.builder(
                      itemCount: students.length,
                      itemBuilder: (_, index) =>
                          _buildStudentCard(students[index]),
                    ),
                  ),
                ],
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
            label: "Exams",
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
