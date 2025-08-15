import 'package:flutter/material.dart';

class FinanceScreen extends StatefulWidget {
  const FinanceScreen({super.key});

  @override
  State<FinanceScreen> createState() => _FinanceScreenState();
}

class _FinanceScreenState extends State<FinanceScreen> {
  final List<Map<String, dynamic>> fees = [
    {
      "id": "INV001",
      "title": "Tuition Fee",
      "dueDate": "2025-09-10",
      "amount": 500,
      "status": "Pending",
      "avatarUrl": "https://i.pravatar.cc/100?img=3",
    },
    {
      "id": "INV002",
      "title": "Library Fee",
      "dueDate": "2025-09-15",
      "amount": 50,
      "status": "Paid",
      "avatarUrl": "https://i.pravatar.cc/100?img=4",
    },
    {
      "id": "INV003",
      "title": "Lab Fee",
      "dueDate": "2025-09-20",
      "amount": 120,
      "status": "Pending",
      "avatarUrl": "https://i.pravatar.cc/100?img=5",
    },
  ];

  final List<Map<String, dynamic>> payments = [
    {
      "id": "PAY001",
      "title": "Tuition Payment",
      "date": "2025-09-05",
      "amount": 200,
      "avatarUrl": "https://i.pravatar.cc/100?img=6",
    },
    {
      "id": "PAY002",
      "title": "Library Payment",
      "date": "2025-09-06",
      "amount": 50,
      "avatarUrl": "https://i.pravatar.cc/100?img=7",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    int totalDue = fees.fold(
      0,
      (previousValue, element) => previousValue + (element['amount'] as int),
    );
    int totalPaid = payments.fold(
      0,
      (previousValue, element) => previousValue + (element['amount'] as int),
    );
    int balance = totalDue - totalPaid;

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
      drawer: _buildDrawer(cs),
      bottomNavigationBar: _buildBottomNav(cs),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              "Finance Overview",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _summaryCard(
                  "Total Due",
                  "\$${totalDue}",
                  cs.primary,
                  Icons.receipt,
                ),
                _summaryCard(
                  "Total Paid",
                  "\$${totalPaid}",
                  cs.secondary,
                  Icons.payment,
                ),
                _summaryCard(
                  "Balance",
                  "\$${balance}",
                  cs.error,
                  Icons.account_balance_wallet,
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              "Invoices",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            ...fees.map((invoice) => _invoiceCard(invoice, cs)).toList(),
            const SizedBox(height: 24),
            const Text(
              "Payment History",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            _paymentTable(),
          ],
        ),
      ),
    );
  }

  Future<void> _handleRefresh() async {
    await Future.delayed(const Duration(seconds: 1));
    setState(() {});
  }

  Widget _summaryCard(String title, String value, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(fontWeight: FontWeight.w600, color: color),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _invoiceCard(Map<String, dynamic> invoice, ColorScheme cs) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(invoice['avatarUrl']),
        ),
        title: Text(
          invoice['title'],
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
        subtitle: Text(
          "Due: ${invoice['dueDate']} • Status: ${invoice['status']}",
        ),
        trailing: Text(
          "\$${invoice['amount']}",
          style: TextStyle(fontWeight: FontWeight.w700, color: cs.primary),
        ),
        onTap: () {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text(invoice['title']),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Invoice ID: ${invoice['id']}"),
                  Text("Due Date: ${invoice['dueDate']}"),
                  Text("Amount: \$${invoice['amount']}"),
                  Text("Status: ${invoice['status']}"),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Close"),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _paymentTable() {
    return Table(
      border: TableBorder.all(color: Colors.grey.shade300),
      columnWidths: const {
        0: FlexColumnWidth(2),
        1: FlexColumnWidth(2),
        2: FlexColumnWidth(1),
      },
      children: [
        const TableRow(
          decoration: BoxDecoration(color: Colors.black12),
          children: [
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Title",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Date",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Text(
                "Amount",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        ...payments.map((p) {
          return TableRow(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(p['title']),
              ),
              Padding(padding: const EdgeInsets.all(8), child: Text(p['date'])),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text("\$${p['amount']}"),
              ),
            ],
          );
        }).toList(),
      ],
    );
  }

  Drawer _buildDrawer(ColorScheme cs) {
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
