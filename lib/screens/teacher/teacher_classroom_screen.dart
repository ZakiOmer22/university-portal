import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherClassroomManagement extends StatefulWidget {
  const TeacherClassroomManagement({super.key});

  @override
  State<TeacherClassroomManagement> createState() =>
      _TeacherClassroomManagementState();
}

class _TeacherClassroomManagementState
    extends State<TeacherClassroomManagement> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _classrooms = [
    {
      "class": "CS101",
      "subject": "Computer Science",
      "room": "A101",
      "students": "45",
      "status": "Active",
    },
    {
      "class": "ENG201",
      "subject": "English Literature",
      "room": "B203",
      "students": "32",
      "status": "Active",
    },
    {
      "class": "MATH301",
      "subject": "Calculus",
      "room": "C104",
      "students": "28",
      "status": "Inactive",
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

  List<Map<String, String>> get _filteredClassrooms {
    if (_searchQuery.isEmpty) return _classrooms;
    return _classrooms.where((cls) {
      final query = _searchQuery.toLowerCase();
      return cls["class"]!.toLowerCase().contains(query) ||
          cls["subject"]!.toLowerCase().contains(query) ||
          cls["room"]!.toLowerCase().contains(query) ||
          cls["status"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildClassroomCard(Map<String, String> classroom) {
    Color statusColor = classroom["status"] == "Active"
        ? Colors.green
        : Colors.red;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${classroom["class"]} - ${classroom["subject"]}",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Room: ${classroom["room"]}"),
            Text("Students: ${classroom["students"]}"),
            Text(
              "Status: ${classroom["status"]}",
              style: TextStyle(fontWeight: FontWeight.bold, color: statusColor),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.print),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text("Printing report for ${classroom["class"]}"),
              ),
            );
            // Implement actual print logic if needed
          },
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Viewing details for ${classroom["class"]}"),
            ),
          );
          // Optional: implement detailed read-only classroom info
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Classroom Management",
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
                        hintText: "Search by class, subject, room, or status",
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
                      child: _filteredClassrooms.isEmpty
                          ? const Center(child: Text("No classrooms found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredClassrooms.length,
                              itemBuilder: (context, index) =>
                                  _buildClassroomCard(
                                    _filteredClassrooms[index],
                                  ),
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
