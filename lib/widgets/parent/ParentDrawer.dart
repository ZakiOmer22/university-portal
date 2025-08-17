import 'package:flutter/material.dart';
import 'parent_links.dart';

class ParentDrawer extends StatelessWidget {
  final BuildContext contextRef;
  const ParentDrawer({super.key, required this.contextRef});

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
                itemCount: parentLinks.length,
                itemBuilder: (context, index) {
                  final item = parentLinks[index];
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
            Color(0xFF00897B), // teal dark
            Color(0xFF26A69A), // lighter teal for smooth gradient
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
                  "Mr. Omar Zaki", // Parent name
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Parent Dashboard", // Parent-specific info
                  style: TextStyle(fontSize: 14, color: Colors.white70),
                ),
                SizedBox(height: 4),
                Text(
                  "Parent • ID: P2025001", // Parent ID
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
