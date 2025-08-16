import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class CourseRetakePage extends StatefulWidget {
  const CourseRetakePage({super.key});

  @override
  State<CourseRetakePage> createState() => _CourseRetakePageState();
}

class _CourseRetakePageState extends State<CourseRetakePage> {
  int _currentIndex = 1; // Default tab index
  bool _isLoading = true;

  final List<Map<String, String>> courses = const [
    {
      "title": "Mathematics 101",
      "instructor": "Dr. Ahmed",
      "status": "Ongoing",
      "semester": "Fall 2025",
      "mode": "Online",
      "code": "MATH101",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
    },
    {
      "title": "Physics 201",
      "instructor": "Prof. Samira",
      "status": "Upcoming",
      "semester": "Fall 2025",
      "mode": "Offline",
      "code": "PHYS201",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
    },
    {
      "title": "Chemistry 101",
      "instructor": "Dr. Hussein",
      "status": "Completed",
      "semester": "Spring 2025",
      "mode": "Online",
      "code": "CHEM101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
  ];

  final List<Map<String, String>> pendingRetake = [];

  final List<Widget> _pages = const [MessagesPage(), ProfilePage(), MorePage()];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  void _onAvatarMenu(String value) {
    switch (value) {
      case 'profile':
        Navigator.pushNamed(context, '/profile');
        break;
      case 'dashboard':
        Navigator.pushNamed(context, '/dashboard');
        break;
      case 'logout':
        Navigator.pushNamed(context, '/logout');
        break;
    }
  }

  void _confirmRetake(Map<String, String> course) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Confirm Retake"),
        content: Text(
          "Do you want to retake ${course['title']} (${course['code']})?",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text("Confirm"),
          ),
        ],
      ),
    );

    if (result == true) {
      setState(() => pendingRetake.add(course));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("${course['title']} is now pending retake.")),
      );
    }
  }

  IconData _getIcon(String status) {
    switch (status) {
      case "Ongoing":
        return Icons.play_circle_fill_rounded;
      case "Upcoming":
        return Icons.schedule_rounded;
      case "Completed":
        return Icons.check_circle_rounded;
      case "Pending":
        return Icons.replay_circle_filled_rounded;
      default:
        return Icons.menu_book_rounded;
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case "Ongoing":
        return Colors.green;
      case "Upcoming":
        return Colors.orange;
      case "Completed":
        return Colors.blue;
      case "Pending":
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Dashboard",
        onAvatarMenu: _onAvatarMenu,
      ),
      drawer: CustomDrawer(contextRef: context),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
          if (index > 0 && index - 1 < _pages.length) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => _pages[index - 1]),
            );
          }
        },
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                setState(() => _isLoading = true);
                await Future.delayed(const Duration(milliseconds: 500));
                if (mounted) setState(() => _isLoading = false);
              },
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  const SizedBox(height: 8),
                  ...courses.map((course) {
                    final isPending = pendingRetake.contains(course);
                    final status = isPending ? "Pending" : course["status"]!;
                    return GestureDetector(
                      onTap: () => _confirmRetake(course),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Colors.white,
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x14000000),
                              blurRadius: 12,
                              offset: Offset(0, 6),
                            ),
                          ],
                          border: Border.all(color: const Color(0x11000000)),
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(course["avatarUrl"]!),
                          ),
                          title: Text(
                            course["title"]!,
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                          subtitle: Text(
                            "Instructor: ${course["instructor"]}\nSemester: ${course["semester"]} • Mode: ${course["mode"]}",
                          ),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                _getIcon(status),
                                color: _statusColor(status),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                status,
                                style: TextStyle(
                                  color: _statusColor(status),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
    );
  }
}
