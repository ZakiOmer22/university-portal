import 'package:flutter/material.dart';
import 'dart:async';

import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/more_page.dart';
import 'package:university_portal/widgets/profile_page.dart';

class CoursesPage extends StatefulWidget {
  const CoursesPage({super.key});

  @override
  State<CoursesPage> createState() => _CoursesPageState();
}

class _CoursesPageState extends State<CoursesPage> {
  int _currentIndex = 1; // default to Courses tab if needed
  bool _isLoading = true;

  // Semester Courses
  final List<Map<String, String>> actualCourses = const [
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
      "status": "Ongoing",
      "semester": "Fall 2025",
      "mode": "Online",
      "code": "CHEM101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
  ];

  final List<Map<String, String>> retakenCourses = const [
    {
      "title": "History 101",
      "instructor": "Mr. Ali",
      "status": "Completed",
      "semester": "Spring 2025",
      "mode": "Online",
      "code": "HIST101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
  ];

  final List<Widget> _pages = const [MessagesPage(), ProfilePage(), MorePage()];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
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

  IconData _getIcon(String status) {
    switch (status) {
      case "Ongoing":
        return Icons.play_circle_fill_rounded;
      case "Upcoming":
        return Icons.schedule_rounded;
      case "Completed":
        return Icons.check_circle_rounded;
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
      default:
        return Colors.grey;
    }
  }

  void _showCourseDetails(Map<String, String> course) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(course["title"]!),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              backgroundImage: NetworkImage(course["avatarUrl"]!),
              radius: 30,
            ),
            const SizedBox(height: 12),
            _detailRow("Instructor", course["instructor"]!),
            _detailRow("Status", course["status"]!),
            _detailRow("Semester", course["semester"]!),
            _detailRow("Mode", course["mode"]!),
            _detailRow("Course Code", course["code"]!),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          Text(value),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: CustomAppBar(title: "Courses", onAvatarMenu: _onAvatarMenu),
      drawer: CustomDrawer(contextRef: context),

      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                setState(() => _isLoading = true);
                await Future.delayed(const Duration(seconds: 1));
                if (mounted) setState(() => _isLoading = false);
              },
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  const SizedBox(height: 8),
                  const Text(
                    "Current Semester Courses",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  ...actualCourses.map(
                    (course) => GestureDetector(
                      onTap: () => _showCourseDetails(course),
                      child: _courseCard(course, cs),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    "Retaken Courses",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  retakenCourses.isEmpty
                      ? Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Center(
                            child: Text("No retaken courses found."),
                          ),
                        )
                      : Column(
                          children: retakenCourses
                              .map(
                                (course) => GestureDetector(
                                  onTap: () => _showCourseDetails(course),
                                  child: _courseCard(course, cs),
                                ),
                              )
                              .toList(),
                        ),
                ],
              ),
            ),

      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
          // switch pages (for now, just open the sample page)
          if (index > 0 && index - 1 < _pages.length) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => _pages[index - 1]),
            );
          }
        },
      ),
    );
  }

  Widget _courseCard(Map<String, String> course, ColorScheme cs) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
              _getIcon(course["status"]!),
              color: _statusColor(course["status"]!),
            ),
            const SizedBox(height: 2),
            Text(
              course["status"]!,
              style: TextStyle(
                color: _statusColor(course["status"]!),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
