import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = List.generate(
      10,
      (i) => ("New announcement #$i", "Tap to view details."),
    );

    return Scaffold(
      appBar: AppBar(title: const Text("Notifications")),
      body: ListView.separated(
        itemBuilder: (_, i) {
          final (title, body) = items[i];
          return ListTile(
            leading: const Icon(Icons.notifications),
            title: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
            subtitle: Text(body),
            trailing: const Icon(Icons.chevron_right_rounded),
            onTap: () {},
          );
        },
        separatorBuilder: (_, __) => const Divider(height: 0),
        itemCount: items.length,
      ),
    );
  }
}
