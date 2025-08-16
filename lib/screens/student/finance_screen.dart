import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';
import 'package:university_portal/widgets/messages_page.dart';
import 'package:university_portal/widgets/profile_page.dart';
import 'package:university_portal/widgets/more_page.dart';

class FinanceScreen extends StatefulWidget {
  const FinanceScreen({super.key});

  @override
  State<FinanceScreen> createState() => _FinanceScreenState();
}

class _FinanceScreenState extends State<FinanceScreen> {
  bool _isLoading = true;
  int _currentIndex = 1;

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

  final List<Widget> _pages = const [MessagesPage(), ProfilePage(), MorePage()];

  @override
  void initState() {
    super.initState();
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

    int totalDue = fees.fold(0, (prev, e) => prev + (e['amount'] as int));
    int totalPaid = payments.fold(0, (prev, e) => prev + (e['amount'] as int));
    int balance = totalDue - totalPaid;

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
                        "\$$totalDue",
                        cs.primary,
                        Icons.receipt,
                      ),
                      _summaryCard(
                        "Total Paid",
                        "\$$totalPaid",
                        cs.secondary,
                        Icons.payment,
                      ),
                      _summaryCard(
                        "Balance",
                        "\$$balance",
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
}
