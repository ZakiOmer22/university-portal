import 'package:flutter/material.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class AcademicSchedulePage extends StatefulWidget {
  const AcademicSchedulePage({super.key});

  @override
  State<AcademicSchedulePage> createState() => _AcademicSchedulePageState();
}

class _AcademicSchedulePageState extends State<AcademicSchedulePage> {
  bool _loading = false;

  // Example academic schedule
  final List<Map<String, dynamic>> _schedule = [
    {
      "day": "Monday",
      "subject": "Mathematics",
      "time": "08:00 - 09:30",
      "location": "Room 101",
    },
    {
      "day": "Monday",
      "subject": "English",
      "time": "10:00 - 11:30",
      "location": "Room 102",
    },
    {
      "day": "Tuesday",
      "subject": "Physics",
      "time": "08:00 - 09:30",
      "location": "Room 201",
    },
    {
      "day": "Wednesday",
      "subject": "Chemistry",
      "time": "09:00 - 10:30",
      "location": "Lab 3",
    },
    {
      "day": "Thursday",
      "subject": "History",
      "time": "11:00 - 12:30",
      "location": "Room 104",
    },
  ];

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _loading = false);
  }

  Widget _buildScheduleCard(Map<String, dynamic> item) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(Icons.schedule, size: 40, color: Colors.blueAccent),
        title: Text(
          item["subject"],
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          "${item["day"]} | ${item["time"]}\nLocation: ${item["location"]}",
        ),
        isThreeLine: true,
        trailing: Icon(Icons.arrow_forward_ios, size: 20),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ParentAppBar(
        title: "Next Academic Schedule",
        onAvatarMenu: (value) {
          // optional menu callback
        },
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
                    "Upcoming Classes",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ..._schedule.map((item) => _buildScheduleCard(item)),
                  const SizedBox(height: 24),
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Tips for Upcoming Week",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            "- Review your notes daily.\n- Prepare questions for each class.\n- Check required books/materials in advance.\n- Manage your time effectively.",
                            style: TextStyle(fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0, // set dynamically if needed
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
