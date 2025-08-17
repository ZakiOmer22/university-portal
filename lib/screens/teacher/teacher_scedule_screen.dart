import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherSchedule extends StatefulWidget {
  const TeacherSchedule({super.key});

  @override
  State<TeacherSchedule> createState() => _TeacherScheduleState();
}

class _TeacherScheduleState extends State<TeacherSchedule> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _schedule = [
    {
      "course": "Mathematics 101",
      "day": "Monday",
      "time": "08:00 - 10:00",
      "room": "Room A1",
    },
    {
      "course": "Physics 201",
      "day": "Tuesday",
      "time": "10:30 - 12:30",
      "room": "Lab B2",
    },
    {
      "course": "Computer Science 101",
      "day": "Wednesday",
      "time": "09:00 - 11:00",
      "room": "Room C3",
    },
    {
      "course": "English Literature",
      "day": "Thursday",
      "time": "13:00 - 15:00",
      "room": "Room D4",
    },
    {
      "course": "Biology 101",
      "day": "Friday",
      "time": "08:00 - 10:00",
      "room": "Lab E5",
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

  List<Map<String, String>> get _filteredSchedule {
    if (_searchQuery.isEmpty) return _schedule;
    return _schedule.where((item) {
      final query = _searchQuery.toLowerCase();
      return item["course"]!.toLowerCase().contains(query) ||
          item["day"]!.toLowerCase().contains(query) ||
          item["room"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildScheduleCard(Map<String, String> schedule) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 3,
      shadowColor: Colors.grey.withOpacity(0.3),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              schedule["course"]!,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.teal,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(schedule["day"]!, style: const TextStyle(fontSize: 14)),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.access_time, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(schedule["time"]!, style: const TextStyle(fontSize: 14)),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(schedule["room"]!, style: const TextStyle(fontSize: 14)),
              ],
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        "Printing schedule for ${schedule["course"]}",
                      ),
                    ),
                  );
                },
                icon: const Icon(Icons.print, size: 16),
                label: const Text("Print"),
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  backgroundColor: Colors.teal,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "My Schedule",
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
                        hintText: "Search schedule...",
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
                      child: _filteredSchedule.isEmpty
                          ? const Center(child: Text("No schedule found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredSchedule.length,
                              itemBuilder: (context, index) =>
                                  _buildScheduleCard(_filteredSchedule[index]),
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
