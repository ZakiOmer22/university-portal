import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class AttendancePage extends StatefulWidget {
  const AttendancePage({super.key});

  @override
  State<AttendancePage> createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  int _currentIndex = 1;
  bool _isLoading = true;

  final List<Map<String, dynamic>> attendanceData = [
    {
      "title": "Mathematics 101",
      "code": "MATH101",
      "avatarUrl": "https://i.pravatar.cc/150?img=1",
      "attendance": 85,
      "credits": 3,
      "missed": 2,
    },
    {
      "title": "Physics 201",
      "code": "PHYS201",
      "avatarUrl": "https://i.pravatar.cc/150?img=2",
      "attendance": 92,
      "credits": 4,
      "missed": 1,
    },
    {
      "title": "Chemistry 101",
      "code": "CHEM101",
      "avatarUrl": "https://i.pravatar.cc/150?img=3",
      "attendance": 76,
      "credits": 3,
      "missed": 5,
    },
    {
      "title": "English 101",
      "code": "ENG101",
      "avatarUrl": "https://i.pravatar.cc/150?img=4",
      "attendance": 88,
      "credits": 2,
      "missed": 1,
    },
  ];

  final List<Widget> _pages = const [MessagesPage(), ProfilePage(), MorePage()];

  @override
  void initState() {
    super.initState();
    // simulate loading
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) setState(() => _isLoading = false);
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
    final cs = Theme.of(context).colorScheme;

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
          : Padding(
              padding: const EdgeInsets.all(20),
              child: ListView(
                children: [
                  const Text(
                    "Attendance",
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 16),
                  ...attendanceData.map((course) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 28,
                              backgroundImage: NetworkImage(
                                course['avatarUrl'],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "${course['title']} (${course['code']})",
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    "Attendance: ${course['attendance']}% • Missed: ${course['missed']} classes",
                                    style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: LinearProgressIndicator(
                                      value:
                                          (course['attendance'] as int) / 100,
                                      minHeight: 8,
                                      backgroundColor: cs.primary.withOpacity(
                                        0.1,
                                      ),
                                      color: cs.primary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                  const SizedBox(height: 24),
                  const Text(
                    "Credits Attended",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  _buildCreditTable(attendanceData),
                ],
              ),
            ),
    );
  }

  Widget _buildCreditTable(List<Map<String, dynamic>> data) {
    return Table(
      border: TableBorder.all(color: Colors.grey.shade300),
      columnWidths: const {
        0: FlexColumnWidth(3),
        1: FlexColumnWidth(1),
        2: FlexColumnWidth(1),
      },
      children: [
        const TableRow(
          decoration: BoxDecoration(color: Color(0xFFE0E0E0)),
          children: [
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Course",
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Credits",
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Missed",
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
        ...data.map((course) {
          return TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text("${course['title']} (${course['code']})"),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(course['credits'].toString()),
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(course['missed'].toString()),
              ),
            ],
          );
        }).toList(),
      ],
    );
  }
}
