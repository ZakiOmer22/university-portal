import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherMessagesPage extends StatefulWidget {
  const TeacherMessagesPage({super.key});

  @override
  State<TeacherMessagesPage> createState() => _TeacherMessagesPageState();
}

class _TeacherMessagesPageState extends State<TeacherMessagesPage> {
  bool _loading = false;
  int _selectedIndex = 0; // Bottom nav selected index

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

  final List<Map<String, String>> _messages = [
    {
      "student": "Ali Mohamed",
      "course": "Physics 101",
      "message": "Can you explain last week's homework?",
      "time": "10:30 AM",
    },
    {
      "student": "Hodan Yusuf",
      "course": "Advanced Mathematics",
      "message": "I will be absent on Monday.",
      "time": "09:15 AM",
    },
    {
      "student": "Mohamed Farah",
      "course": "Chemistry Lab",
      "message": "Could you provide extra lab notes?",
      "time": "Yesterday",
    },
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
      // Add page navigation logic if needed
    });
  }

  Widget _buildMessageCard(Map<String, String> message) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.indigo,
          child: Text(
            message["student"]![0],
            style: const TextStyle(color: Colors.white),
          ),
        ),
        title: Text("${message["student"]} (${message["course"]})"),
        subtitle: Text(message["message"]!),
        trailing: Text(
          message["time"]!,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Opened message from ${message["student"]}"),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSection({required String title, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        child,
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Messages",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    const Text(
                      "Messages",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Messages Section
                    _buildSection(
                      title: "Unread Messages",
                      child: Column(
                        children: _messages.map(_buildMessageCard).toList(),
                      ),
                    ),
                    // Extra Section: Announcements / Replies
                    _buildSection(
                      title: "Recent Replies",
                      child: Column(
                        children: const [
                          ListTile(
                            leading: Icon(Icons.reply, color: Colors.green),
                            title: Text("Ali Mohamed"),
                            subtitle: Text(
                              "Thanks for clarifying the homework!",
                            ),
                          ),
                          ListTile(
                            leading: Icon(Icons.reply, color: Colors.green),
                            title: Text("Hodan Yusuf"),
                            subtitle: Text("Noted, will send notes later."),
                          ),
                        ],
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
