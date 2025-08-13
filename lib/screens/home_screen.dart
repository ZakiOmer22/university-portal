import 'package:flutter/material.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell>
    with SingleTickerProviderStateMixin {
  String get _greeting {
    final hour = DateTime.now().hour;
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  void _onAvatarMenu(String value) {
    switch (value) {
      case 'profile':
        break;
      case 'dashboard':
        break;
      case 'logout':
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Student Portal",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: _onAvatarMenu,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'profile', child: Text('Profile')),
              PopupMenuItem(value: 'dashboard', child: Text('Dashboard')),
              PopupMenuItem(value: 'logout', child: Text('Log out')),
            ],
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: CircleAvatar(
                radius: 18,
                backgroundImage: const AssetImage('assets/images/avatar.jpg'),
                backgroundColor: cs.primaryContainer,
              ),
            ),
          ),
        ],
      ),

      // Bigger, richer drawer
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header with gradient background
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 24,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [cs.primary, cs.primaryContainer],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 32,
                      backgroundImage: AssetImage('assets/images/avatar.jpg'),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "John Doe",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            "University of Hargeisa",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.white70,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            "Student • ID: 2025001",
                            style: TextStyle(color: Colors.white70),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Drawer menu items
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  children: [
                    _drawerItem(Icons.dashboard_rounded, "Dashboard"),
                    _drawerItem(Icons.book_rounded, "Courses"),
                    _drawerItem(
                      Icons.assignment_turned_in_rounded,
                      "Attendance",
                    ),
                    _drawerItem(Icons.payments_rounded, "Finance"),
                    _drawerItem(
                      Icons.calendar_month_rounded,
                      "Academic Calendar",
                    ),
                    _drawerItem(Icons.grade_rounded, "Grades & Transcripts"),
                    _drawerItem(
                      Icons.event_available_rounded,
                      "Exam Schedules",
                    ),
                    _drawerItem(Icons.groups_rounded, "Community"),
                    _drawerItem(Icons.help_rounded, "Help & Support"),
                    _drawerItem(Icons.settings_rounded, "Settings"),
                  ],
                ),
              ),

              // Footer
              const Divider(),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/icon.png',
                      width: 18,
                      height: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      "Powered by eALIF Team",
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 120),
        children: [
          Text(
            "$_greeting 👋",
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          Text(
            "Here’s what’s happening today.",
            style: TextStyle(color: Colors.grey.shade700),
          ),
          const SizedBox(height: 20),

          _featureCard(
            context,
            title: "Your Courses",
            subtitle: "3 classes today • Starts at 8:30 AM",
            icon: Icons.menu_book_rounded,
          ),
          _featureCard(
            context,
            title: "Finance",
            subtitle: "Invoice due next week",
            icon: Icons.payments_rounded,
          ),
          _featureCard(
            context,
            title: "Messages",
            subtitle: "2 unread from Registrar",
            icon: Icons.mail_rounded,
          ),
          _featureCard(
            context,
            title: "Upcoming Events",
            subtitle: "Orientation Day • Tomorrow 9:00 AM",
            icon: Icons.event_rounded,
          ),
        ],
      ),

      bottomNavigationBar: _BottomNotificationsBar(
        onTap: () => Navigator.pushNamed(context, '/notifications'),
      ),
    );
  }

  Widget _featureCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
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
        border: Border.all(color: const Color(0x11000000)),
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

  ListTile _drawerItem(IconData icon, String label, {VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade800),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: onTap,
    );
  }
}

// Bottom notifications pill
class _BottomNotificationsBar extends StatelessWidget {
  final VoidCallback onTap;
  const _BottomNotificationsBar({required this.onTap});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return SafeArea(
      minimum: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.92),
          borderRadius: BorderRadius.circular(20),
          boxShadow: const [
            BoxShadow(
              color: Color(0x1F000000),
              blurRadius: 16,
              offset: Offset(0, 6),
            ),
          ],
          border: Border.all(color: const Color(0x11000000)),
        ),
        child: Row(
          children: [
            Icon(Icons.notifications_active_rounded, color: cs.primary),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                "Notifications",
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
              ),
            ),
            FilledButton(
              onPressed: onTap,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text("Open"),
            ),
          ],
        ),
      ),
    );
  }
}
