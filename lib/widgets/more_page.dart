import 'package:flutter/material.dart';
import 'package:university_portal/widgets/CustomAppBar.dart';
import 'package:university_portal/widgets/CustomDrawer.dart';
import 'package:university_portal/widgets/CustomBottomNav.dart';

class MorePage extends StatefulWidget {
  const MorePage({super.key});

  @override
  State<MorePage> createState() => _MorePageState();
}

class _MorePageState extends State<MorePage> {
  int _currentIndex = 3; // More tab index

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
    return Scaffold(
      appBar: CustomAppBar(title: "More Options", onAvatarMenu: _onAvatarMenu),
      drawer: CustomDrawer(contextRef: context),
      body: Container(
        color: Colors.white,
        alignment: Alignment.center,
        child: const Text(
          'More Options Page',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onDestinationSelected: (index) {},
      ),
    );
  }
}
