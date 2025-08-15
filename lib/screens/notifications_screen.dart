import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  // Sample notifications data
  final List<Map<String, dynamic>> notifications = const [
    {
      "title": "New Assignment",
      "message": "Your Math assignment is due tomorrow.",
      "time": "2025-08-14 10:30:00",
      "icon": Icons.book,
      "color": Colors.blue,
    },
    {
      "title": "Payment Received",
      "message": "Your tuition fee has been successfully received.",
      "time": "2025-08-13 14:45:00",
      "icon": Icons.payment,
      "color": Colors.green,
    },
    {
      "title": "Class Reminder",
      "message": "Don't forget your Physics class at 3 PM.",
      "time": "2025-08-14 08:00:00",
      "icon": Icons.science,
      "color": Colors.orange,
    },
    {
      "title": "Exam Result",
      "message": "Your History exam result is available now.",
      "time": "2025-08-12 18:20:00",
      "icon": Icons.assignment_turned_in,
      "color": Colors.purple,
    },
  ];

  String formatTime(String timeString) {
    final dt = DateTime.parse(timeString);
    return DateFormat('MMM dd, yyyy – hh:mm a').format(dt);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notifications")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: notifications.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final notif = notifications[index];
          return Card(
            elevation: 4,
            shadowColor: Colors.black26,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              leading: CircleAvatar(
                radius: 24,
                backgroundColor: (notif["color"] as Color).withOpacity(0.2),
                child: Icon(
                  notif["icon"] as IconData,
                  color: notif["color"] as Color,
                  size: 28,
                ),
              ),
              title: Text(
                notif["title"] as String,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 4),
                  Text(
                    notif["message"] as String,
                    style: const TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    formatTime(notif["time"] as String),
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ],
              ),
              trailing: Icon(
                Icons.chevron_right_rounded,
                color: Colors.grey.shade400,
              ),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Tapped: ${notif["title"]}")),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
