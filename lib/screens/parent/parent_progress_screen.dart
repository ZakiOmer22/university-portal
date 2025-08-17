import 'package:flutter/material.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class ParentProgressPage extends StatefulWidget {
  const ParentProgressPage({super.key});

  @override
  State<ParentProgressPage> createState() => _ParentProgressPageState();
}

class _ParentProgressPageState extends State<ParentProgressPage> {
  // Example data
  final List<Map<String, dynamic>> _progressData = [
    {
      "child": "Ahmed Ali",
      "class": "Grade 5 - A",
      "subjects": {"Math": 85, "English": 78, "Science": 92, "History": 74},
    },
    {
      "child": "Zahra Omar",
      "class": "Grade 3 - B",
      "subjects": {"Math": 90, "English": 88, "Science": 80, "History": 95},
    },
  ];

  Widget _buildSubjectProgress(String subject, int score) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "$subject: $score%",
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: score / 100,
            minHeight: 8,
            backgroundColor: Colors.grey.shade300,
            color: const Color(0xFF6A1B9A),
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  Widget _buildProgressCard(Map<String, dynamic> childData) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              childData["child"],
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              childData["class"],
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
            const Divider(height: 16, thickness: 1),
            ...childData["subjects"].entries.map(
              (entry) => _buildSubjectProgress(entry.key, entry.value),
            ),
          ],
        ),
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
      appBar: ParentAppBar(title: "Progress Report", onAvatarMenu: (value) {}),
      drawer: ParentDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              "Academic Progress",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ..._progressData.map((childData) => _buildProgressCard(childData)),
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
