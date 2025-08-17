import 'package:flutter/material.dart';

class ParentAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final Function(String) onAvatarMenu;
  final Color? backgroundColor; // Optional custom color

  const ParentAppBar({
    super.key,
    required this.title,
    required this.onAvatarMenu,
    this.backgroundColor,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AppBar(
      backgroundColor:
          backgroundColor ??
          const Color(0xFF00897B), // Distinct teal color for parents
      title: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      actions: [
        PopupMenuButton<String>(
          onSelected: onAvatarMenu,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          itemBuilder: (context) => const [
            PopupMenuItem(value: 'profile', child: Text('Profile')),
            PopupMenuItem(value: 'dashboard', child: Text('Dashboard')),
            PopupMenuItem(value: 'logout', child: Text('Log out')),
          ],
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: CircleAvatar(
              radius: 18,
              backgroundImage: const AssetImage('assets/images/avatar.png'),
              backgroundColor: cs.primaryContainer,
            ),
          ),
        ),
      ],
    );
  }
}
