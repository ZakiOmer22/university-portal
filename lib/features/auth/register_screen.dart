import 'package:flutter/material.dart';
import 'widgets/auth_header.dart';
import 'widgets/oauth_buttons.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late final TextEditingController _fullNameCtrl;
  late final TextEditingController _studentIdCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _passwordCtrl;
  late final TextEditingController _confirmCtrl;
  bool _obscure1 = true;
  bool _obscure2 = true;
  String? _universityName;
  String? _logo;

  @override
  void initState() {
    super.initState();
    _fullNameCtrl = TextEditingController();
    _studentIdCtrl = TextEditingController();
    _emailCtrl = TextEditingController();
    _passwordCtrl = TextEditingController();
    _confirmCtrl = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    _universityName = args?['universityName'] as String?;
    _logo = args?['logo'] as String?;
  }

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _studentIdCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  void _register() {
    // TODO: integrate API
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Creating account...')));
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          children: [
            AuthHeader(
              title: 'Create your account',
              subtitle: 'Join your university portal',
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
              controller: _fullNameCtrl,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(
                labelText: 'Full name',
                prefixIcon: Icon(Icons.person_rounded),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _studentIdCtrl,
              decoration: const InputDecoration(
                labelText: 'Student ID',
                prefixIcon: Icon(Icons.badge_rounded),
              ),
            ),
            const SizedBox(height: 12),
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
              obscureText: _obscure1,
              decoration: InputDecoration(
                labelText: 'Password',
                prefixIcon: const Icon(Icons.lock_rounded),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscure1
                        ? Icons.visibility_rounded
                        : Icons.visibility_off_rounded,
                  ),
                  onPressed: () => setState(() => _obscure1 = !_obscure1),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _confirmCtrl,
              obscureText: _obscure2,
              decoration: InputDecoration(
                labelText: 'Confirm password',
                prefixIcon: const Icon(Icons.lock_outline_rounded),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscure2
                        ? Icons.visibility_rounded
                        : Icons.visibility_off_rounded,
                  ),
                  onPressed: () => setState(() => _obscure2 = !_obscure2),
                ),
              ),
            ),

            const SizedBox(height: 16),
            FilledButton(
              onPressed: _register,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Create Account'),
            ),

            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Already have an account? '),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Login'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
