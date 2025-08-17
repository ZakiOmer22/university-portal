import 'package:flutter/material.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class ParentAttendancePage extends StatefulWidget {
  const ParentAttendancePage({super.key});

  @override
  State<ParentAttendancePage> createState() => _ParentAttendancePageState();
}

class _ParentAttendancePageState extends State<ParentAttendancePage> {
  bool _loading = false;

  // Example attendance data
  final List<Map<String, dynamic>> _attendanceRecords = [
    {
      "child": "Ahmed Ali",
      "class": "Grade 5 - A",
      "status": "Present",
      "date": "2025-08-16",
    },
    {
      "child": "Ahmed Ali",
      "class": "Grade 5 - A",
      "status": "Absent",
      "date": "2025-08-15",
    },
    {
      "child": "Ahmed Ali",
      "class": "Grade 5 - A",
      "status": "Present",
      "date": "2025-08-14",
    },
    {
      "child": "Zahra Omar",
      "class": "Grade 3 - B",
      "status": "Present",
      "date": "2025-08-16",
    },
  ];

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _loading = false);
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'present':
        return Colors.green;
      case 'absent':
        return Colors.red;
      case 'late':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  Widget _buildAttendanceCard(Map<String, dynamic> record) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(record["status"]),
          child: Text(
            record["child"][0],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          record["child"],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(record["class"], style: const TextStyle(fontSize: 13)),
            const SizedBox(height: 4),
            Text("Status: ${record["status"]}"),
          ],
        ),
        trailing: Text(
          record["date"],
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        isThreeLine: true,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ParentAppBar(
        title: "Attendance Records",
        onAvatarMenu: (value) {},
      ),
      drawer: ParentDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const Text(
                    "Attendance Records",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ..._attendanceRecords.map(
                    (record) => _buildAttendanceCard(record),
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
