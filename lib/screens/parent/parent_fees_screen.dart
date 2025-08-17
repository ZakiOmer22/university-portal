import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/parent/ParentAppBar.dart';
import 'package:university_portal/widgets/parent/ParentDrawer.dart';

class FeesPaymentsPage extends StatefulWidget {
  const FeesPaymentsPage({super.key});

  @override
  State<FeesPaymentsPage> createState() => _FeesPaymentsPageState();
}

class _FeesPaymentsPageState extends State<FeesPaymentsPage> {
  bool _loading = false;
  int _currentIndex = 0;

  final List<Map<String, dynamic>> _feesList = [
    {
      "child": "Child A",
      "feeType": "Tuition Fee",
      "amount": 200,
      "dueDate": "2025-08-20",
      "paid": false,
    },
    {
      "child": "Child B",
      "feeType": "Library Fee",
      "amount": 50,
      "dueDate": "2025-08-25",
      "paid": true,
    },
    {
      "child": "Child A",
      "feeType": "Lab Fee",
      "amount": 80,
      "dueDate": "2025-08-28",
      "paid": false,
    },
  ];

  final List<Map<String, dynamic>> _recentPayments = [
    {
      "child": "Child A",
      "feeType": "Tuition Fee",
      "amount": 200,
      "date": "2025-08-01",
    },
    {
      "child": "Child B",
      "feeType": "Library Fee",
      "amount": 50,
      "date": "2025-08-05",
    },
  ];

  double get _currentBalance => _feesList
      .where((fee) => !fee["paid"])
      .fold(0, (sum, fee) => sum + fee["amount"]);

  Future<void> _refreshPage() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(seconds: 1));
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

  void _handlePayment(int index) {
    setState(() {
      _feesList[index]["paid"] = true;
      _recentPayments.add({
        "child": _feesList[index]["child"],
        "feeType": _feesList[index]["feeType"],
        "amount": _feesList[index]["amount"],
        "date": DateTime.now().toString().substring(0, 10),
      });
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("${_feesList[index]["feeType"]} paid successfully!"),
      ),
    );
  }

  Widget _buildFeeCard(Map<String, dynamic> fee, int index) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(
          fee["paid"] ? Icons.check_circle : Icons.payment,
          color: fee["paid"] ? Colors.green : Colors.orange,
          size: 40,
        ),
        title: Text("${fee["child"]} - ${fee["feeType"]}"),
        subtitle: Text("Amount: \$${fee["amount"]} | Due: ${fee["dueDate"]}"),
        trailing: fee["paid"]
            ? const Text(
                "Paid",
                style: TextStyle(
                  color: Colors.green,
                  fontWeight: FontWeight.bold,
                ),
              )
            : ElevatedButton(
                onPressed: () => _handlePayment(index),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text("Pay Now"),
              ),
      ),
    );
  }

  Widget _buildRecentPaymentsTable() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Recent Payments",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: const [
                  DataColumn(label: Text("Child")),
                  DataColumn(label: Text("Fee Type")),
                  DataColumn(label: Text("Amount")),
                  DataColumn(label: Text("Date")),
                ],
                rows: _recentPayments
                    .map(
                      (payment) => DataRow(
                        cells: [
                          DataCell(Text(payment["child"])),
                          DataCell(Text(payment["feeType"])),
                          DataCell(Text("\$${payment["amount"]}")),
                          DataCell(Text(payment["date"])),
                        ],
                      ),
                    )
                    .toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: ListTile(
        leading: const Icon(
          Icons.account_balance_wallet,
          size: 40,
          color: Color(0xFF00897B),
        ),
        title: const Text("Current Balance"),
        subtitle: Text("\$$_currentBalance"),
      ),
    );
  }

  void _onNavBarTapped(int index) {
    setState(() => _currentIndex = index);
    // Here, you can handle navigation to other pages if needed
    // For now, just showing a SnackBar
    final labels = ["Dashboard", "Children", "Attendance", "Settings"];
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text("Navigated to ${labels[index]}")));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ParentAppBar(
        title: "Fees & Payments",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: ParentDrawer(contextRef: context),
      body: RefreshIndicator(
        onRefresh: _refreshPage,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  ..._feesList.asMap().entries.map(
                    (entry) => _buildFeeCard(entry.value, entry.key),
                  ),
                  const SizedBox(height: 24),
                  _buildBalanceCard(),
                  _buildRecentPaymentsTable(),
                ],
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onNavBarTapped,
        selectedItemColor: const Color(0xFF00897B),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
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
