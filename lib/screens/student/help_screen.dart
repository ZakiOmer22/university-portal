import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpSupportPage extends StatelessWidget {
  const HelpSupportPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Student Dashboard",
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
            // FAQ / Common Questions Section
            Text(
              "Frequently Asked Questions",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            _faqCard(
              question: "How do I reset my password?",
              answer:
                  "Go to your profile page, tap 'Change Password', and follow the instructions to reset your password securely.",
              cs: cs,
            ),
            _faqCard(
              question: "How do I contact my instructor?",
              answer:
                  "You can send them a message via the internal messaging system or find their email in the course details page.",
              cs: cs,
            ),
            _faqCard(
              question: "Where can I check my grades?",
              answer:
                  "Navigate to 'Grades & Transcripts' from the sidebar to view your exam and assignment results.",
              cs: cs,
            ),
            const SizedBox(height: 24),
            // Contact Support Section
            Text(
              "Contact Support",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 12),
            _supportOption(
              icon: Icons.email_rounded,
              title: "Email Support",
              detail: "support@university.edu",
              onTap: () async {
                final Uri emailUri = Uri(
                  scheme: 'mailto',
                  path: 'support@university.edu',
                  query: 'subject=Help%20Request',
                );
                if (await canLaunchUrl(emailUri)) {
                  launchUrl(emailUri);
                }
              },
              cs: cs,
            ),
            _supportOption(
              icon: Icons.phone_rounded,
              title: "Call Support",
              detail: "+252 61 1234567",
              onTap: () async {
                final Uri phoneUri = Uri(scheme: 'tel', path: '+252611234567');
                if (await canLaunchUrl(phoneUri)) {
                  launchUrl(phoneUri);
                }
              },
              cs: cs,
            ),
            _supportOption(
              icon: Icons.chat_rounded,
              title: "Live Chat",
              detail: "Start a chat with our support team",
              onTap: () {
                // Navigate to live chat page
              },
              cs: cs,
            ),
            const SizedBox(height: 24),
            // Additional Help
            Text(
              "Additional Help",
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
                leading: const Icon(Icons.book_rounded),
                title: const Text("User Guide"),
                subtitle: const Text("View the complete student guide."),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () {
                  // Open user guide
                },
              ),
            ),
            const SizedBox(height: 8),
            Card(
              color: cs.background,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: cs.primary.withOpacity(0.2)),
              ),
              child: ListTile(
                leading: const Icon(Icons.video_library_rounded),
                title: const Text("Video Tutorials"),
                subtitle: const Text("Watch how-to videos."),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () {
                  // Open video tutorials
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Card _faqCard({
    required String question,
    required String answer,
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: cs.primary,
              ),
            ),
            const SizedBox(height: 6),
            Text(answer),
          ],
        ),
      ),
    );
  }

  Card _supportOption({
    required IconData icon,
    required String title,
    required String detail,
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
        title: Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(detail),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: onTap,
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
                    onTap: () => Navigator.pop(context),
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
