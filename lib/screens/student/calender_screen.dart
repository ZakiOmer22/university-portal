import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  bool _isLoading = true;
  int _currentIndex = 0;

  final List<Map<String, String>> scheduleEvents = const [
    {
      "title": "Mathematics 101 Lecture",
      "date": "2025-09-10",
      "time": "08:30 AM - 10:00 AM",
      "location": "Room 201",
      "instructor": "Dr. Ahmed",
      "mode": "Online",
    },
    {
      "title": "Physics 201 Lab",
      "date": "2025-09-11",
      "time": "10:30 AM - 12:00 PM",
      "location": "Lab 5",
      "instructor": "Prof. Samira",
      "mode": "Offline",
    },
    {
      "title": "Chemistry 101 Lecture",
      "date": "2025-09-12",
      "time": "09:00 AM - 10:30 AM",
      "location": "Room 101",
      "instructor": "Dr. Yusuf",
      "mode": "Online",
    },
    {
      "title": "Computer Science Seminar",
      "date": "2025-09-13",
      "time": "01:00 PM - 03:00 PM",
      "location": "Auditorium",
      "instructor": "Dr. Hawa",
      "mode": "Offline",
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
              onRefresh: _handleRefresh,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  const Text(
                    "Academic Calendar",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  ...scheduleEvents
                      .map((event) => _eventCard(event, cs))
                      .toList(),
                ],
              ),
            ),
    );
  }

  Future<void> _handleRefresh() async {
    await Future.delayed(const Duration(seconds: 1));
    setState(() {});
  }

  Widget _eventCard(Map<String, String> event, ColorScheme cs) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: Icon(
          event['mode'] == 'Online'
              ? Icons.computer_rounded
              : Icons.location_on_rounded,
          color: cs.primary,
          size: 32,
        ),
        title: Text(
          event['title']!,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("${event['date']} • ${event['time']}"),
            Text("Instructor: ${event['instructor']}"),
            Text("Location: ${event['location']}"),
          ],
        ),
        trailing: const Icon(Icons.chevron_right_rounded),
        onTap: () {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text(event['title']!),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Date: ${event['date']}"),
                  Text("Time: ${event['time']}"),
                  Text("Location: ${event['location']}"),
                  Text("Instructor: ${event['instructor']}"),
                  Text("Mode: ${event['mode']}"),
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
        },
      ),
    );
  }
}
