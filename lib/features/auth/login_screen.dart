import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'widgets/auth_header.dart';
import 'widgets/oauth_buttons.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late final TextEditingController _emailCtrl;
  late final TextEditingController _passwordCtrl;
  bool _obscure = true;
  bool _rememberMe = true;

  String? _universityName;
  String? _logo;

  final List<String> emails = [
    'student@mail.com',
    'admin@mail.com',
    'teacher@mail.com',
    'parent@mail.com',
    'user5@mail.com',
    'user6@mail.com',
    'user7@mail.com',
    'user8@mail.com',
  ];

  final String password = '12345678';

  final Map<String, String> roles = {
    'student@mail.com': 'student',
    'admin@mail.com': 'admin',
    'teacher@mail.com': 'teacher',
    'parent@mail.com': 'parent',
    'user5@mail.com': 'student',
    'user6@mail.com': 'teacher',
    'user7@mail.com': 'admin',
    'user8@mail.com': 'parent',
  };

  @override
  void initState() {
    super.initState();
    _emailCtrl = TextEditingController();
    _passwordCtrl = TextEditingController();
    _checkIfAlreadyLoggedIn();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    _universityName = args?['universityName'] as String?;
    _logo = args?['logo'] as String?;
  }

  Future<void> _checkIfAlreadyLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final loggedIn = prefs.getBool('logged_in') ?? false;
    final savedRole = prefs.getString('role');
    final savedUniversity = prefs.getString('universityName');
    final savedLogo = prefs.getString('logo');

    if (loggedIn && savedRole != null) {
      _navigateToDashboard(savedRole);
    } else if (_universityName == null && savedUniversity != null) {
      setState(() {
        _universityName = savedUniversity;
        _logo = savedLogo;
      });
    }
  }

  void _navigateToDashboard(String role) {
    String route = '/dashboard';
    switch (role) {
      case 'student':
        route = '/students/home';
        break;
      case 'teacher':
        route = '/teacher/home';
        break;
      case 'admin':
        route = '/admin/home';
        break;
      case 'parent':
        route = '/parent/home';
        break;
    }
    Navigator.pushReplacementNamed(context, route);
  }

  Future<void> _signIn() async {
    final email = _emailCtrl.text.trim();
    final pass = _passwordCtrl.text.trim();

    if (email.isEmpty || pass.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in both fields')),
      );
      return;
    }

    if (emails.contains(email) && pass == password) {
      final role = roles[email];

      if (_rememberMe) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('logged_in', true);
        await prefs.setString('role', role!);
        if (_universityName != null) {
          await prefs.setString('universityName', _universityName!);
        }
        if (_logo != null) {
          await prefs.setString('logo', _logo!);
        }
      }

      _navigateToDashboard(role!);
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Invalid credentials')));
    }
  }

  void _gotoRegister() {
    Navigator.pushNamed(
      context,
      '/register',
      arguments: {'universityName': _universityName, 'logo': _logo},
    );
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                children: [
                  AuthHeader(
                    title: 'Welcome back',
                    subtitle: 'Log in to continue',
                    universityName: _universityName,
                    logoAsset: _logo,
                  ),
                  const SizedBox(height: 24),

                  OAuthButtons(
                    onGoogle: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Google OAuth tapped')),
                      );
                    },
                    onMicrosoft: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Microsoft OAuth tapped')),
                      );
                    },
                    onApple: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Apple OAuth tapped')),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  TextField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email address',
                      prefixIcon: Icon(Icons.alternate_email_rounded),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passwordCtrl,
                    obscureText: _obscure,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: const Icon(Icons.lock_rounded),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscure
                              ? Icons.visibility_rounded
                              : Icons.visibility_off_rounded,
                        ),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Checkbox(
                        value: _rememberMe,
                        onChanged: (v) =>
                            setState(() => _rememberMe = v ?? true),
                      ),
                      const Text('Remember me'),
                      const Spacer(),
                      TextButton(
                        onPressed: () {
                          // forgot password
                        },
                        child: const Text('Forgot password?'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: _signIn,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Sign In'),
                  ),

                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Don't have an account? "),
                      TextButton(
                        onPressed: _gotoRegister,
                        child: const Text('Register'),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Container(
              padding: const EdgeInsets.all(12),
              alignment: Alignment.center,
              child: Text(
                'Powered by eALIF Services',
                style: TextStyle(
                  color: cs.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
