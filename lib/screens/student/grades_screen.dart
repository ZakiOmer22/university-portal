import 'package:flutter/material.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class GradesScreen extends StatefulWidget {
  const GradesScreen({super.key});

  @override
  State<GradesScreen> createState() => _GradesScreenState();
}

class _GradesScreenState extends State<GradesScreen> {
  bool _isLoading = true;
  int _currentIndex = 0;
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

    await Printing.layoutPdf(onLayout: (format) async => pdf.save());
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
          : RefreshIndicator(
              onRefresh: _handleRefresh,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  // Grades Overview
                  const Text(
                    "Grades Overview",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  DropdownButton<String>(
                    value: selectedSemester,
                    onChanged: (value) {
                      if (value != null)
                        setState(() => selectedSemester = value);
                    },
                    items: semesters
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                  ),
                  const SizedBox(height: 12),
                  SingleChildScrollView(
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
                  const SizedBox(height: 16),
                  Text(
                    "Total Credit Hours: ${gradesData.where((g) => g['semester'] == selectedSemester).fold(0, (sum, g) => sum + g['creditHours'] as int)}",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    "Transcript Overview",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ...transcriptData.map((t) {
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
                ],
              ),
            ),
    );
  }
}
