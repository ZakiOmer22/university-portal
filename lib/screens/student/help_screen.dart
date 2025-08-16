import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';

class HelpSupportPage extends StatefulWidget {
  const HelpSupportPage({super.key});

  @override
  State<HelpSupportPage> createState() => _HelpSupportPageState();
}

class _HelpSupportPageState extends State<HelpSupportPage> {
  bool _isLoading = true;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  Future<void> _handleRefresh() async {
    await Future.delayed(const Duration(seconds: 1));
    setState(() {});
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
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _handleRefresh,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Text(
                    "Frequently Asked Questions",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: cs.primary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _faqExpansion(
                    question: "How do I reset my password?",
                    answer:
                        "Go to your profile page, tap 'Change Password', and follow the instructions.",
                    cs: cs,
                  ),
                  _faqExpansion(
                    question: "How do I contact my instructor?",
                    answer:
                        "Send a message via the internal messaging system or find their email in course details.",
                    cs: cs,
                  ),
                  _faqExpansion(
                    question: "Where can I check my grades?",
                    answer:
                        "Navigate to 'Grades & Transcripts' from the sidebar.",
                    cs: cs,
                  ),
                  const SizedBox(height: 24),
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
                      if (await canLaunchUrl(emailUri)) launchUrl(emailUri);
                    },
                    cs: cs,
                  ),
                  _supportOption(
                    icon: Icons.phone_rounded,
                    title: "Call Support",
                    detail: "+252 61 1234567",
                    onTap: () async {
                      final Uri phoneUri = Uri(
                        scheme: 'tel',
                        path: '+252611234567',
                      );
                      if (await canLaunchUrl(phoneUri)) launchUrl(phoneUri);
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
                  Text(
                    "Additional Help",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: cs.primary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _additionalCard(
                    cs,
                    Icons.book_rounded,
                    "User Guide",
                    "View the complete student guide.",
                  ),
                  _additionalCard(
                    cs,
                    Icons.video_library_rounded,
                    "Video Tutorials",
                    "Watch how-to videos.",
                  ),
                ],
              ),
            ),
    );
  }

  ExpansionTile _faqExpansion({
    required String question,
    required String answer,
    required ColorScheme cs,
  }) {
    return ExpansionTile(
      title: Text(
        question,
        style: TextStyle(fontWeight: FontWeight.bold, color: cs.primary),
      ),
      children: [
        Padding(padding: const EdgeInsets.all(8), child: Text(answer)),
      ],
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
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: cs.primary.withOpacity(0.2)),
      ),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        leading: Icon(icon, color: cs.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(detail),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: onTap,
      ),
    );
  }

  Card _additionalCard(
    ColorScheme cs,
    IconData icon,
    String title,
    String subtitle,
  ) {
    return Card(
      color: cs.background,
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
        onTap: () {},
      ),
    );
  }
}
