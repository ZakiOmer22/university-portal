import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherDashboard extends StatefulWidget {
  const TeacherDashboard({super.key});

  @override
  State<TeacherDashboard> createState() => _TeacherDashboardState();
}

class _TeacherDashboardState extends State<TeacherDashboard> {
  int _selectedIndex = 0;
  bool _loading = false;

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _loading = false);
  }

  final List<String> _pageTitles = [
    "Dashboard Overview",
    "Students List",
    "Attendance Tracking",
    "Settings",
  ];

  final List<Widget> _pages = [];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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

  @override
  void initState() {
    super.initState();
    _pages.addAll([
      _buildDashboardOverview(),
      Center(
        child: Text("Students List Page", style: const TextStyle(fontSize: 18)),
      ),
      Center(
        child: Text(
          "Attendance Tracking Page",
          style: const TextStyle(fontSize: 18),
        ),
      ),
      Center(
        child: Text("Settings Page", style: const TextStyle(fontSize: 18)),
      ),
    ]);
  }

  Widget _buildDashboardOverview() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          // Page title inside content
          Text(
            _pageTitles[0],
            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          // First three cards stacked horizontally
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildCard(
                icon: Icons.people,
                title: "Total Students",
                value: "120",
                color: Colors.blue.shade700,
              ),
              const SizedBox(width: 12),
              _buildCard(
                icon: Icons.check_circle,
                title: "Attendance Today",
                value: "95%",
                color: Colors.green.shade700,
              ),
              const SizedBox(width: 12),
              _buildCard(
                icon: Icons.schedule,
                title: "Upcoming Classes",
                value: "3",
                color: Colors.orange.shade700,
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Next Lecture",
            child: Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: ListTile(
                leading: const Icon(Icons.book, size: 40, color: Colors.indigo),
                title: const Text("Advanced Mathematics"),
                subtitle: const Text("Tomorrow, 10:00 AM - 11:30 AM"),
                trailing: const Icon(Icons.arrow_forward_ios),
              ),
            ),
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Recent Comments",
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.comment, color: Colors.grey),
                  title: Text("Student A submitted assignment"),
                  subtitle: Text("2 hours ago"),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.comment, color: Colors.grey),
                  title: Text("Student B asked a question"),
                  subtitle: Text("5 hours ago"),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.comment, color: Colors.grey),
                  title: Text("Student C submitted homework"),
                  subtitle: Text("1 day ago"),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Upcoming Sections",
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.calendar_today, color: Colors.purple),
                  title: Text("Physics Lab"),
                  subtitle: Text("Monday, 2:00 PM"),
                ),
                ListTile(
                  leading: Icon(Icons.calendar_today, color: Colors.purple),
                  title: Text("Chemistry Lecture"),
                  subtitle: Text("Wednesday, 11:00 AM"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(
          color: color, // solid background
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        child: Column(
          children: [
            Icon(icon, size: 40, color: Colors.white),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontSize: 16, color: Colors.white),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: _pageTitles[_selectedIndex], // AppBar unchanged
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _pages[_selectedIndex],
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
