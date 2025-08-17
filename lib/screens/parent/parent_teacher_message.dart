import 'package:flutter/material.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class ParentMessagesPage extends StatefulWidget {
  const ParentMessagesPage({super.key});

  @override
  State<ParentMessagesPage> createState() => _ParentMessagesPageState();
}

class _ParentMessagesPageState extends State<ParentMessagesPage> {
  bool _loading = false;

  // Example messages
  final List<Map<String, dynamic>> _messages = [
    {
      "teacher": "Mrs. Ali",
      "subject": "Mathematics",
      "message": "Reminder: Homework is due tomorrow.",
      "time": "08:30 AM",
    },
    {
      "teacher": "Mr. Hassan",
      "subject": "English",
      "message": "Student performed very well on the last test.",
      "time": "09:15 AM",
    },
    {
      "teacher": "Ms. Fatima",
      "subject": "Physics",
      "message": "Lab session postponed to next week.",
      "time": "11:00 AM",
    },
    {
      "teacher": "Mr. Ahmed",
      "subject": "History",
      "message": "Please check the project submission guidelines.",
      "time": "01:30 PM",
    },
  ];

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _loading = false);
  }

  Widget _buildMessageCard(Map<String, dynamic> msg) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.teal[400],
          child: Text(
            msg["teacher"][0],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          msg["teacher"],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(msg["subject"], style: const TextStyle(fontSize: 13)),
            const SizedBox(height: 4),
            Text(msg["message"], maxLines: 2, overflow: TextOverflow.ellipsis),
          ],
        ),
        trailing: Text(
          msg["time"],
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        isThreeLine: true,
        onTap: () {
          // Open full message page or details if needed
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ParentAppBar(title: "Teacher Messages", onAvatarMenu: (value) {}),
      drawer: ParentDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const Text(
                    "Messages",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ..._messages.map((msg) => _buildMessageCard(msg)),
                ],
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0, // set dynamically based on page
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
