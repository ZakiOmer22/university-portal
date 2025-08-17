import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherSupport extends StatefulWidget {
  const TeacherSupport({super.key});

  @override
  State<TeacherSupport> createState() => _TeacherSupportState();
}

class _TeacherSupportState extends State<TeacherSupport> {
  bool _loading = false;
  int _selectedIndex = 0;
  String _searchQuery = "";

  final List<Map<String, String>> _tickets = [
    {
      "student": "Ali Mohamed",
      "subject": "CS101 Issue",
      "query": "I cannot submit my assignment.",
      "status": "Pending",
      "date": "2025-08-12",
    },
    {
      "student": "Fatima Abdi",
      "subject": "ENG201 Clarification",
      "query": "Need help understanding essay topic.",
      "status": "Resolved",
      "date": "2025-08-10",
    },
    {
      "student": "Ahmed Yusuf",
      "subject": "MATH301 Question",
      "query": "I need guidance on problem 5.",
      "status": "Pending",
      "date": "2025-08-11",
    },
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

  List<Map<String, String>> get _filteredTickets {
    if (_searchQuery.isEmpty) return _tickets;
    return _tickets.where((ticket) {
      final query = _searchQuery.toLowerCase();
      return ticket["student"]!.toLowerCase().contains(query) ||
          ticket["subject"]!.toLowerCase().contains(query) ||
          ticket["status"]!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildTicketCard(Map<String, String> ticket) {
    Color statusColor;
    switch (ticket["status"]) {
      case "Pending":
        statusColor = Colors.orange;
        break;
      case "Resolved":
        statusColor = Colors.green;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(
          "${ticket["student"]} - ${ticket["subject"]}",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Query: ${ticket["query"]}"),
            Text("Date: ${ticket["date"]}"),
            Text(
              "Status: ${ticket["status"]}",
              style: TextStyle(fontWeight: FontWeight.bold, color: statusColor),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.visibility),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Viewing ${ticket["student"]}'s query")),
            );
            // Optional: navigate to detailed ticket view
          },
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Selected ticket: ${ticket["student"]}")),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Teacher Support",
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
                        hintText: "Search by student, subject, or status",
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
                      child: _filteredTickets.isEmpty
                          ? const Center(
                              child: Text("No support tickets found"),
                            )
                          : ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: _filteredTickets.length,
                              itemBuilder: (context, index) =>
                                  _buildTicketCard(_filteredTickets[index]),
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
