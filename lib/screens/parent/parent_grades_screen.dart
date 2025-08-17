import 'package:flutter/material.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class ParentGradesPage extends StatefulWidget {
  const ParentGradesPage({super.key});

  @override
  State<ParentGradesPage> createState() => _ParentGradesPageState();
}

class _ParentGradesPageState extends State<ParentGradesPage> {
  // Example grades data
  final List<Map<String, dynamic>> _gradesData = [
    {"subject": "Mathematics", "grade": "A", "score": 92},
    {"subject": "English", "grade": "B+", "score": 85},
    {"subject": "Science", "grade": "A-", "score": 89},
    {"subject": "History", "grade": "B", "score": 78},
  ];

  double get averageScore {
    if (_gradesData.isEmpty) return 0;
    double total = _gradesData.fold(0, (sum, item) => sum + item["score"]);
    return total / _gradesData.length;
  }

  Widget _buildGradeCard(Map<String, dynamic> gradeData) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: const Color(0xFF6A1B9A),
          child: Text(
            gradeData["grade"],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          gradeData["subject"],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: LinearProgressIndicator(
          value: gradeData["score"] / 100,
          minHeight: 8,
          backgroundColor: Colors.grey.shade300,
          color: const Color(0xFF6A1B9A),
        ),
        trailing: Text("${gradeData["score"]}%"),
      ),
    );
  }

  Future<void> _refreshPage() async {
    setState(() {});
    await Future.delayed(const Duration(seconds: 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ParentAppBar(title: "Grades Overview", onAvatarMenu: (value) {}),
      drawer: ParentDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              "Grades Overview",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ..._gradesData.map((gradeData) => _buildGradeCard(gradeData)),
            const SizedBox(height: 20),
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const Text(
                      "Average Score",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    LinearProgressIndicator(
                      value: averageScore / 100,
                      minHeight: 12,
                      backgroundColor: Colors.grey.shade300,
                      color: const Color(0xFF6A1B9A),
                    ),
                    const SizedBox(height: 8),
                    Text("${averageScore.toStringAsFixed(1)}%"),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0, // Update dynamically if needed
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: "Dashboard",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: "Children"),
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
