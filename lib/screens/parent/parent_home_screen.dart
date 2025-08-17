import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  int _selectedIndex = 0;
  bool _loading = false;

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _loading = false);
  }

  final List<String> _pageTitles = [
    "Dashboard Overview",
    "My Children",
    "Attendance",
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
        child: Text("My Children Page", style: const TextStyle(fontSize: 18)),
      ),
      Center(
        child: Text("Attendance Page", style: const TextStyle(fontSize: 18)),
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
          // Text(
          //   _pageTitles[0],
          //   style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          // ),
          // const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildCard(
                icon: Icons.person,
                title: "Total Children",
                value: "2",
                colors: [const Color(0xFF00897B), const Color(0xFF26A69A)],
              ),
              const SizedBox(width: 12),
              _buildCard(
                icon: Icons.check_circle,
                title: "Attendance Today",
                value: "90%",
                colors: [const Color(0xFF00796B), const Color(0xFF26A69A)],
              ),
              const SizedBox(width: 12),
              _buildCard(
                icon: Icons.school,
                title: "Upcoming Classes",
                value: "4",
                colors: [const Color(0xFF004D40), const Color(0xFF00796B)],
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Next Class",
            child: Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: ListTile(
                leading: const Icon(
                  Icons.book,
                  size: 40,
                  color: Color(0xFF00897B),
                ),
                title: const Text("Physics Lecture"),
                subtitle: const Text("Tomorrow, 10:00 AM - 11:30 AM"),
                trailing: const Icon(Icons.arrow_forward_ios),
              ),
            ),
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Recent Grades",
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.grade, color: Color(0xFF26A69A)),
                  title: Text("Child A: Math - A"),
                  subtitle: Text("1 day ago"),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.grade, color: Color(0xFF26A69A)),
                  title: Text("Child B: Science - B+"),
                  subtitle: Text("2 days ago"),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildSection(
            title: "Upcoming Exams",
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.calendar_today, color: Color(0xFF00897B)),
                  title: Text("Math Exam"),
                  subtitle: Text("Monday, 9:00 AM"),
                ),
                ListTile(
                  leading: Icon(Icons.calendar_today, color: Color(0xFF00897B)),
                  title: Text("English Exam"),
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
    required List<Color> colors,
  }) {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: colors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
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
      appBar: ParentAppBar(
        title: _pageTitles[_selectedIndex],
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: ParentDrawer(contextRef: context),
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
        selectedItemColor: const Color(0xFF00897B),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: "Dashboard",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: "Children"),
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
