import 'package:flutter/material.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class GradesScreen extends StatefulWidget {
  const GradesScreen({super.key});

  @override
  State<GradesScreen> createState() => _GradesScreenState();
}

class _GradesScreenState extends State<GradesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String selectedSemester = 'Fall 2025';

  final List<String> semesters = [
    'Fall 2025',
    'Spring 2025',
    'Fall 2024',
    'Spring 2024',
  ];

  final List<Map<String, dynamic>> gradesData = const [
    {
      "courseCode": "MATH101",
      "courseTitle": "Mathematics 101",
      "creditHours": 3,
      "grade": "A",
      "semester": "Fall 2025",
      "instructor": "Dr. Ahmed",
      "status": "Completed",
    },
    {
      "courseCode": "PHYS201",
      "courseTitle": "Physics 201",
      "creditHours": 4,
      "grade": "B+",
      "semester": "Fall 2025",
      "instructor": "Prof. Samira",
      "status": "Completed",
    },
    {
      "courseCode": "CHEM101",
      "courseTitle": "Chemistry 101",
      "creditHours": 3,
      "grade": "A-",
      "semester": "Fall 2025",
      "instructor": "Dr. Ali",
      "status": "Completed",
    },
    {
      "courseCode": "CS101",
      "courseTitle": "Computer Science 101",
      "creditHours": 3,
      "grade": "A",
      "semester": "Spring 2025",
      "instructor": "Prof. Hussein",
      "status": "Completed",
    },
  ];

  final List<Map<String, dynamic>> transcriptData = const [
    {"semester": "Fall 2025", "gpa": 3.7, "totalCreditHours": 10},
    {"semester": "Spring 2025", "gpa": 3.8, "totalCreditHours": 3},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _generateAndOpenPDF(Map<String, dynamic> transcript) async {
    final pdf = pw.Document();

    final semesterGrades = gradesData
        .where((g) => g['semester'] == transcript['semester'])
        .toList();

    pdf.addPage(
      pw.Page(
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              'University of Hargeisa',
              style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold),
            ),
            pw.SizedBox(height: 10),
            pw.Text('Student: John Doe • ID: 2025001'),
            pw.Text('Semester: ${transcript['semester']}'),
            pw.Divider(),
            pw.Text('Grades:', style: pw.TextStyle(fontSize: 20)),
            pw.SizedBox(height: 8),
            pw.Table.fromTextArray(
              headers: [
                'Course Code',
                'Course Title',
                'Instructor',
                'Credit Hours',
                'Grade',
                'Status',
              ],
              data: semesterGrades.map((g) {
                return [
                  g['courseCode'],
                  g['courseTitle'],
                  g['instructor'],
                  g['creditHours'].toString(),
                  g['grade'],
                  g['status'],
                ];
              }).toList(),
            ),
            pw.SizedBox(height: 12),
            pw.Text('GPA: ${transcript['gpa']}'),
            pw.Text('Total Credit Hours: ${transcript['totalCreditHours']}'),
          ],
        ),
      ),
    );

    await Printing.layoutPdf(
      onLayout: (format) async => pdf.save(),
    ); // opens system PDF viewer
  }

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
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: "Grades"),
            Tab(text: "Transcript"),
          ],
        ),
      ),
      drawer: _buildDrawer(cs, context),
      bottomNavigationBar: _buildBottomNav(cs),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Grades Tab
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Grades Overview",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                DropdownButton<String>(
                  value: selectedSemester,
                  onChanged: (value) {
                    if (value != null) setState(() => selectedSemester = value);
                  },
                  items: semesters
                      .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                      .toList(),
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Builder(
                      builder: (context) {
                        final semesterGrades = gradesData
                            .where((g) => g['semester'] == selectedSemester)
                            .toList();

                        if (semesterGrades.isEmpty) {
                          return Center(
                            child: Text(
                              "No courses found for $selectedSemester",
                              style: TextStyle(color: Colors.grey.shade700),
                            ),
                          );
                        }

                        return DataTable(
                          columns: const [
                            DataColumn(label: Text("Course Code")),
                            DataColumn(label: Text("Course Title")),
                            DataColumn(label: Text("Instructor")),
                            DataColumn(label: Text("Credit Hours")),
                            DataColumn(label: Text("Grade")),
                            DataColumn(label: Text("Status")),
                          ],
                          rows: semesterGrades
                              .map(
                                (g) => DataRow(
                                  cells: [
                                    DataCell(Text(g['courseCode'])),
                                    DataCell(Text(g['courseTitle'])),
                                    DataCell(Text(g['instructor'])),
                                    DataCell(Text(g['creditHours'].toString())),
                                    DataCell(Text(g['grade'])),
                                    DataCell(Text(g['status'])),
                                  ],
                                ),
                              )
                              .toList(),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  "Total Credit Hours: ${gradesData.where((g) => g['semester'] == selectedSemester).fold(0, (sum, g) => sum + g['creditHours'] as int)}",
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          // Transcript Tab
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Transcript Overview",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView(
                    children: transcriptData.map((t) {
                      return Card(
                        elevation: 4,
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ListTile(
                          title: Text(
                            t['semester'],
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            "GPA: ${t['gpa']} • Total Credit Hours: ${t['totalCreditHours']}",
                          ),
                          trailing: const Icon(Icons.picture_as_pdf),
                          onTap: () => _generateAndOpenPDF(t),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ],
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
                        Navigator.pushNamed(context, '/students/announcements'),
                  ),
                  _drawerItem(
                    Icons.help_rounded,
                    "Help & Support",
                    onTap: () =>
                        Navigator.pushNamed(context, '/students/support'),
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
