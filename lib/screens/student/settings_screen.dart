import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool darkMode = false;
  bool notifications = true;
  bool accountSuspended = false;
  int _currentIndex = 0;

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text("$feature coming soon")));
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
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _settingsSection(
              title: "Profile",
              children: [
                _settingsOption(
                  icon: Icons.account_circle_rounded,
                  title: "Change Avatar",
                  subtitle: "Select a new profile picture",
                  onTap: () => _showComingSoon("Avatar selector"),
                  cs: cs,
                ),
              ],
            ),
            _settingsSection(
              title: "Account",
              children: [
                _settingsOption(
                  icon: Icons.lock_rounded,
                  title: "Password / Security",
                  subtitle: "Change password or view security settings",
                  onTap: () => _showComingSoon("Password & Security"),
                  cs: cs,
                ),
                _settingsOption(
                  icon: Icons.warning_amber_rounded,
                  title: "Account Suspension / Policy Violation",
                  subtitle: accountSuspended
                      ? "Your account is temporarily suspended"
                      : "No issues detected",
                  onTap: () => _showComingSoon("Account Suspension"),
                  cs: cs,
                ),
              ],
            ),
            _settingsSection(
              title: "Preferences",
              children: [
                _switchOption(
                  icon: Icons.dark_mode_rounded,
                  title: "Dark Mode",
                  value: darkMode,
                  onChanged: (val) => setState(() => darkMode = val),
                  cs: cs,
                ),
                _switchOption(
                  icon: Icons.notifications_rounded,
                  title: "Notifications",
                  value: notifications,
                  onChanged: (val) => setState(() => notifications = val),
                  cs: cs,
                ),
              ],
            ),
            _settingsSection(
              title: "About",
              children: [
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
                  onTap: () =>
                      Navigator.pushNamed(context, '/students/help-support'),
                  cs: cs,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _settingsSection({
    required String title,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ...children,
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _settingsOption({
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

  Widget _switchOption({
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
}
