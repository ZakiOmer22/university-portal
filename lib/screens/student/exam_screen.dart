import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class ExamScheduleScreen extends StatefulWidget {
  const ExamScheduleScreen({super.key});

  @override
  State<ExamScheduleScreen> createState() => _ExamScheduleScreenState();
}

class _ExamScheduleScreenState extends State<ExamScheduleScreen> {
  bool _isLoading = true;
  int _currentIndex = 0;

  bool examsAvailable = true; // Toggle for testing

  final List<Map<String, String>> exams = const [
    {
      "course": "Mathematics 101",
      "code": "MATH101",
      "date": "2025-12-01",
      "time": "09:00 AM",
      "location": "Room 201",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
    },
    {
      "course": "Physics 201",
      "code": "PHYS201",
      "date": "2025-12-03",
      "time": "11:00 AM",
      "location": "Room 105",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
    },
    {
      "course": "Chemistry 101",
      "code": "CHEM101",
      "date": "2025-12-05",
      "time": "01:00 PM",
      "location": "Lab 3",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
    },
  ];

  final List<Widget> _pages = const [MessagesPage(), ProfilePage(), MorePage()];

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

    final nextExam = examsAvailable && exams.isNotEmpty
        ? exams.first
        : {
            "course": "N/A",
            "date": "-",
            "time": "-",
            "location": "-",
            "avatarUrl": "",
          };

    return Scaffold(
      appBar: CustomAppBar(
        title: "Student Dashboard",
        onAvatarMenu: _onAvatarMenu,
      ),
      drawer: CustomDrawer(contextRef: context),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
          if (index > 0 && index - 1 < _pages.length) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => _pages[index - 1]),
            );
          }
        },
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _handleRefresh,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: examsAvailable
                    ? _buildExamAvailableUI(cs, nextExam)
                    : _buildExamPassedUI(cs),
              ),
            ),
    );
  }

  Widget _buildExamAvailableUI(ColorScheme cs, Map<String, String> nextExam) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Announcement
        Card(
          color: cs.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: cs.primary.withOpacity(0.2)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.campaign_rounded, color: cs.primary, size: 36),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    "Reminder: Check your upcoming exams and be prepared!",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: cs.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        // Next Exam Card
        Card(
          color: cs.background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: cs.primary.withOpacity(0.2)),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundImage: NetworkImage(nextExam['avatarUrl'] ?? ''),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Next Exam: ${nextExam['course']}",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: cs.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text("Date: ${nextExam['date']}"),
                      Text("Time: ${nextExam['time']}"),
                      Text("Location: ${nextExam['location']}"),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        // Exams Table
        Expanded(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columnSpacing: 24,
              headingRowColor: MaterialStateProperty.all(
                cs.primary.withOpacity(0.15),
              ),
              columns: const [
                DataColumn(label: Text("Course Code")),
                DataColumn(label: Text("Course Title")),
                DataColumn(label: Text("Date")),
                DataColumn(label: Text("Time")),
                DataColumn(label: Text("Location")),
              ],
              rows: exams
                  .map(
                    (exam) => DataRow(
                      cells: [
                        DataCell(Text(exam["code"]!)),
                        DataCell(Text(exam["course"]!)),
                        DataCell(Text(exam["date"]!)),
                        DataCell(Text(exam["time"]!)),
                        DataCell(Text(exam["location"]!)),
                      ],
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildExamPassedUI(ColorScheme cs) {
    return Center(
      child: Card(
        color: cs.background,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: cs.primary.withOpacity(0.2)),
        ),
        elevation: 0,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Lottie.asset(
                'assets/animations/no_exam.json',
                width: 150,
                height: 150,
              ),
              const SizedBox(height: 16),
              Text(
                "Exam period has passed.",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: cs.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
