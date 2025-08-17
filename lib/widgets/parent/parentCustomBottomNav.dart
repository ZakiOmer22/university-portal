import 'package:flutter/material.dart';

class ParentBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onDestinationSelected;

  const ParentBottomNav({
    super.key,
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: onDestinationSelected,
      backgroundColor: const Color(0xFF00897B), // Matches ParentAppBar teal
      indicatorColor: Colors.white.withOpacity(
        0.3,
      ), // Subtle highlight behind icon
      labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
        NavigationDestination(
          icon: Icon(Icons.mail_rounded),
          label: 'Messages',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_rounded),
          label: 'Profile',
        ),
        NavigationDestination(
          icon: Icon(Icons.more_horiz_rounded),
          label: 'More',
        ),
      ],
    );
  }
}
