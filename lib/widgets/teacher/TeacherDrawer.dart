import 'package:flutter/material.dart';
import 'teacher_links.dart';

class TeacherDrawer extends StatelessWidget {
  final BuildContext contextRef;
  const TeacherDrawer({super.key, required this.contextRef});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(cs),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: teacherLinks.length,
                itemBuilder: (context, index) {
                  final item = teacherLinks[index];
                  return ListTile(
                    leading: Icon(item.icon, color: item.activeColor),
                    title: Text(
                      item.label,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    onTap: () => Navigator.pushNamed(contextRef, item.route),
                  );
                },
              ),
            ),
            const Divider(),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ColorScheme cs) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFF6A1B9A), // dark shade of custom color
            Color(0xFF8E24AA), // lighter shade for smooth gradient
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 32,
            backgroundImage: AssetImage('assets/images/avatar.png'),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Dr. Amina Ali",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Faculty of Science",
                  style: TextStyle(fontSize: 14, color: Colors.white70),
                ),
                SizedBox(height: 4),
                Text(
                  "Teacher • ID: T2025001",
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset('assets/images/icon.png', width: 18, height: 18),
          const SizedBox(width: 8),
          Text(
            "Powered by eALIF Team",
            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }
}
