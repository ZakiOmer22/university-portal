import 'package:flutter/material.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool darkMode = false;
  bool notifications = true;
  bool accountSuspended = false;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Settings",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: CircleAvatar(
              radius: 18,
              backgroundImage: const AssetImage('assets/images/avatar.png'),
              backgroundColor: cs.primaryContainer,
            ),
          ),
        ],
      ),
      drawer: _buildDrawer(cs, context),
      bottomNavigationBar: _buildBottomNav(cs),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Section
            Text(
              "Profile",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              color: cs.background,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: cs.primary.withOpacity(0.2)),
              ),
              child: ListTile(
                leading: CircleAvatar(
                  radius: 24,
                  backgroundImage: const AssetImage('assets/images/avatar.png'),
                ),
                title: const Text("Change Avatar"),
                subtitle: const Text("Select a new profile picture"),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () {
                  // TODO: Avatar selector (coming soon)
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Avatar selector coming soon"),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),

            // Account Section
            Text(
              "Account",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            _settingsOption(
              icon: Icons.lock_rounded,
              title: "Password / Security",
              subtitle: "Change password or view security settings",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Feature coming soon")),
                );
              },
              cs: cs,
            ),
            _settingsOption(
              icon: Icons.warning_amber_rounded,
              title: "Account Suspension / Policy Violation",
              subtitle: accountSuspended
                  ? "Your account is temporarily suspended"
                  : "No issues detected",
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Feature coming soon")),
                );
              },
              cs: cs,
            ),
            const SizedBox(height: 16),

            // App Preferences
            Text(
              "Preferences",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            _switchOption(
              icon: Icons.dark_mode_rounded,
              title: "Dark Mode",
              value: darkMode,
              onChanged: (val) {
                setState(() => darkMode = val);
              },
              cs: cs,
            ),
            _switchOption(
              icon: Icons.notifications_rounded,
              title: "Notifications",
              value: notifications,
              onChanged: (val) {
                setState(() => notifications = val);
              },
              cs: cs,
            ),
            const SizedBox(height: 16),

            // About
            Text(
              "About",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            _settingsOption(
              icon: Icons.info_rounded,
              title: "App Version",
              subtitle: "v1.0.0",
              onTap: () {},
              cs: cs,
            ),
            _settingsOption(
              icon: Icons.support_agent_rounded,
              title: "Support",
              subtitle: "Contact support team",
              onTap: () {
                // Could open Help & Support page
              },
              cs: cs,
            ),
          ],
        ),
      ),
    );
  }

  Card _settingsOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required ColorScheme cs,
  }) {
    return Card(
      color: cs.background,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: cs.primary.withOpacity(0.2)),
      ),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        leading: Icon(icon, color: cs.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: onTap,
      ),
    );
  }

  Card _switchOption({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
    required ColorScheme cs,
  }) {
    return Card(
      color: cs.background,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: cs.primary.withOpacity(0.2)),
      ),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        leading: Icon(icon, color: cs.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeColor: cs.primary,
        ),
      ),
    );
  }

  Drawer _buildDrawer(ColorScheme cs, BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
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
                    backgroundImage: AssetImage('assets/images/avatar.png'),
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
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _drawerItem(
                    Icons.dashboard_rounded,
                    "Dashboard",
                    onTap: () => Navigator.pushNamed(context, '/students/home'),
                  ),
                  _drawerItem(
                    Icons.book_rounded,
                    "Courses",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/courses'),
                  ),
                  _drawerItem(
                    Icons.replay_circle_filled_rounded,
                    "Course Retake",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/course-retake'),
                  ),
                  _drawerItem(
                    Icons.assignment_turned_in_rounded,
                    "Attendance",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/attendance'),
                  ),
                  _drawerItem(
                    Icons.payments_rounded,
                    "Finance",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/finance'),
                  ),
                  _drawerItem(
                    Icons.calendar_month_rounded,
                    "Academic Calendar",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/schedule'),
                  ),
                  _drawerItem(
                    Icons.grade_rounded,
                    "Grades & Transcripts",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/grades'),
                  ),
                  _drawerItem(
                    Icons.event_available_rounded,
                    "Exam Schedules",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/exam-report'),
                  ),
                  _drawerItem(
                    Icons.groups_rounded,
                    "Community",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/community'),
                  ),
                  _drawerItem(
                    Icons.help_rounded,
                    "Help & Support",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/help-support'),
                  ),
                  _drawerItem(
                    Icons.settings_rounded,
                    "Settings",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/settings'),
                  ),
                ],
              ),
            ),
            const Divider(),
            Padding(
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
            ),
          ],
        ),
      ),
    );
  }

  BottomNavigationBar _buildBottomNav(ColorScheme cs) {
    return BottomNavigationBar(
      currentIndex: 0,
      selectedItemColor: cs.primary,
      unselectedItemColor: Colors.grey,
      onTap: (index) {},
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
        BottomNavigationBarItem(
          icon: Icon(Icons.mail_rounded),
          label: 'Messages',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_rounded),
          label: 'Profile',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.more_horiz_rounded),
          label: 'More',
        ),
      ],
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
