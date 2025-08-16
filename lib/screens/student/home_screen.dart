import 'package:flutter/material.dart';
import 'dart:async';

import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/more_page.dart';
import 'package:university_portal/widgets/profile_page.dart';

// ------------------------ HOME SHELL ------------------------
class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _currentIndex = 0;
  bool _isLoading = true; // loading state

  final List<Widget> _pages = const [
    _DashboardPage(),
    MessagesPage(),
    ProfilePage(),
    MorePage(),
  ];

  @override
  void initState() {
    super.initState();
    // simulate loading delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
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
    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Dashboard",
        onAvatarMenu: _onAvatarMenu,
      ),

      drawer: CustomDrawer(contextRef: context),

      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _handleRefresh,
              child: _pages[_currentIndex],
            ),

      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }

  Future<void> _handleRefresh() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) setState(() => _isLoading = false);
  }
}

// ------------------------ DASHBOARD PAGE ------------------------
class _DashboardPage extends StatelessWidget {
  const _DashboardPage();

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          "Good morning 👋",
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        Text(
          "Here’s what’s happening today.",
          style: TextStyle(color: Colors.grey.shade700, fontSize: 16),
        ),
        const SizedBox(height: 28),
        _featureCard(
          context,
          title: "Your Courses",
          subtitle: "3 classes today • Starts at 8:30 AM",
          icon: Icons.menu_book_rounded,
        ),
        const SizedBox(height: 16),
        _featureCard(
          context,
          title: "Finance",
          subtitle: "Invoice due next week",
          icon: Icons.payments_rounded,
        ),
        const SizedBox(height: 16),
        _featureCard(
          context,
          title: "Messages",
          subtitle: "2 unread from Registrar",
          icon: Icons.mail_rounded,
        ),
        const SizedBox(height: 16),
        _featureCard(
          context,
          title: "Upcoming Events",
          subtitle: "Orientation Day • Tomorrow 9:00 AM",
          icon: Icons.event_rounded,
        ),
      ],
    );
  }

  static Widget _featureCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: cs.primaryContainer,
          child: Icon(icon, color: cs.onPrimaryContainer),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right_rounded),
        onTap: () {},
      ),
    );
  }
}
