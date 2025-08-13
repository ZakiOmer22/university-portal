import 'package:flutter/material.dart';
import 'package:university_portal/screens/onboarding_screen.dart';
import 'package:university_portal/widgets/footer.dart';
import 'dart:async';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  double _progress = 0.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();

    // Logo animation
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _scaleAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
    _controller.repeat(reverse: true);

    // Progress animation for 60 seconds
    const totalDuration = 30; // seconds
    int elapsed = 0;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        elapsed++;
        _progress = elapsed / totalDuration;
      });

      if (elapsed >= totalDuration) {
        timer.cancel();
        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const OnboardingScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF4A00E0), Color(0xFF8E2DE2)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 300),
            ScaleTransition(
              scale: _scaleAnimation,
              child: const Icon(Icons.school, size: 140, color: Colors.white),
            ),
            const SizedBox(height: 30),
            const Text(
              'University Portal',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Connecting to your university',
              style: TextStyle(fontSize: 18, color: Colors.white70),
            ),
            const SizedBox(height: 20),
            // Continuous circular progress
            const CircularProgressIndicator(
              strokeWidth: 6,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            const Spacer(),
            const Footer(),
          ],
        ),
      ),
    );
  }
}
