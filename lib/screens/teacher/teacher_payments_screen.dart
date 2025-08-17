import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherSalaryPage extends StatefulWidget {
  const TeacherSalaryPage({super.key});

  @override
  State<TeacherSalaryPage> createState() => _TeacherSalaryPageState();
}

class _TeacherSalaryPageState extends State<TeacherSalaryPage> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, dynamic>> _salaries = [
    {
      "teacher": "John Doe",
      "month": "August 2025",
      "baseSalary": 2500.0,
      "bonus": 200.0,
      "deductions": 150.0,
      "netSalary": 2550.0,
    },
    {
      "teacher": "Jane Smith",
      "month": "August 2025",
      "baseSalary": 2700.0,
      "bonus": 150.0,
      "deductions": 100.0,
      "netSalary": 2750.0,
    },
    {
      "teacher": "Mark Wilson",
      "month": "August 2025",
      "baseSalary": 2300.0,
      "bonus": 100.0,
      "deductions": 50.0,
      "netSalary": 2350.0,
    },
    // Add more dummy salaries
  ];

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _loading = false);
  }

  Future<void> _handleAvatarMenu(String value) async {
    if (value == "logout") {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove("isLoggedIn");
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Selected: $value")));
      }
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  List<Map<String, dynamic>> get _filteredSalaries {
    if (_searchQuery.isEmpty) return _salaries;
    return _salaries.where((sal) {
      final query = _searchQuery.toLowerCase();
      return sal["teacher"].toLowerCase().contains(query) ||
          sal["month"].toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildSalaryCard(Map<String, dynamic> salary) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${salary["teacher"]} - ${salary["month"]}",
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Base Salary: \$${salary["baseSalary"].toStringAsFixed(2)}"),
            Text("Bonus: \$${salary["bonus"].toStringAsFixed(2)}"),
            Text("Deductions: \$${salary["deductions"].toStringAsFixed(2)}"),
            const Divider(height: 12, thickness: 1),
            Text(
              "Net Salary: \$${salary["netSalary"].toStringAsFixed(2)}",
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.print, color: Colors.blue),
          onPressed: () {
            // Placeholder for print functionality
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  "Printing salary receipt for ${salary["teacher"]}",
                ),
              ),
            );
          },
        ),
        onTap: () {
          // Placeholder for detailed view
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Viewing salary details for ${salary["teacher"]}"),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Teacher Salaries",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.search),
                        hintText: "Search by teacher or month",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: _filteredSalaries.isEmpty
                          ? const Center(child: Text("No salaries found"))
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredSalaries.length,
                              itemBuilder: (context, index) =>
                                  _buildSalaryCard(_filteredSalaries[index]),
                            ),
                    ),
                  ],
                ),
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: "Dashboard",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: "Students"),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: "Attendance",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Settings",
          ),
        ],
      ),
    );
  }
}
