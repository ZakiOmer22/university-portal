import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/widgets/teacher/TeacherAppBar.dart';
import 'package:university_portal/widgets/teacher/TeacherDrawer.dart';

class TeacherProfile extends StatefulWidget {
  const TeacherProfile({super.key});

  @override
  State<TeacherProfile> createState() => _TeacherProfileState();
}

class _TeacherProfileState extends State<TeacherProfile> {
  bool _loading = false;
  bool _editMode = false;
  int _selectedIndex = 0;

  final Map<String, String> _profileData = {
    "name": "Dr. Ahmed Ali",
    "email": "ahmed.ali@university.edu",
    "phone": "+252 61 234 5678",
    "role": "Senior Lecturer",
    "department": "Computer Science",
  };

  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _roleController;
  late TextEditingController _departmentController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: _profileData["name"]);
    _emailController = TextEditingController(text: _profileData["email"]);
    _phoneController = TextEditingController(text: _profileData["phone"]);
    _roleController = TextEditingController(text: _profileData["role"]);
    _departmentController = TextEditingController(
      text: _profileData["department"],
    );
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
    }
  }

  void _toggleEditMode() {
    setState(() {
      _editMode = !_editMode;
    });
  }

  void _saveProfile() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _profileData["name"] = _nameController.text;
        _profileData["email"] = _emailController.text;
        _profileData["phone"] = _phoneController.text;
        _profileData["role"] = _roleController.text;
        _profileData["department"] = _departmentController.text;
        _editMode = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profile updated successfully")),
      );
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Expanded(
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: color,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
          child: Column(
            children: [
              Text(
                title,
                style: const TextStyle(color: Colors.white, fontSize: 14),
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: "Teacher Profile",
        onAvatarMenu: _handleAvatarMenu,
      ),
      drawer: TeacherDrawer(contextRef: context),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Stats Row
                  Row(
                    children: [
                      _buildStatCard("Classes", "12", Colors.blue),
                      const SizedBox(width: 8),
                      _buildStatCard("Students", "240", Colors.green),
                      const SizedBox(width: 8),
                      _buildStatCard("Exams", "8", Colors.orange),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Profile Avatar
                  Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundImage: const NetworkImage(
                            "https://i.pravatar.cc/150?img=3",
                          ), // replace with actual avatar
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.blue,
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: const Icon(
                                Icons.edit,
                                color: Colors.white,
                                size: 18,
                              ),
                              onPressed: _toggleEditMode,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Profile Form
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _nameController,
                          decoration: const InputDecoration(
                            labelText: "Full Name",
                          ),
                          readOnly: !_editMode,
                          validator: (value) =>
                              value!.isEmpty ? "Name cannot be empty" : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(labelText: "Email"),
                          readOnly: !_editMode,
                          validator: (value) =>
                              value!.isEmpty ? "Email cannot be empty" : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(labelText: "Phone"),
                          readOnly: !_editMode,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _roleController,
                          decoration: const InputDecoration(labelText: "Role"),
                          readOnly: !_editMode,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _departmentController,
                          decoration: const InputDecoration(
                            labelText: "Department",
                          ),
                          readOnly: !_editMode,
                        ),
                        const SizedBox(height: 24),
                        if (_editMode)
                          ElevatedButton.icon(
                            icon: const Icon(Icons.save),
                            label: const Text("Save Changes"),
                            onPressed: _saveProfile,
                          ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.lock),
                          label: const Text("Change Password"),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text("Navigate to change password"),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
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
