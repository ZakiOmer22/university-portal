import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:university_portal/screens/home_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int currentIndex = 0;

  final List<Map<String, String>> pages = [
    {
      "title": "Welcome to UoH",
      "description":
          "Experience the University of Hargeisa Portal like never before!",
      "animation": "assets/animations/Welcome.json",
    },
    {
      "title": "Stay Connected",
      "description": "Access courses, attendance, and notifications on the go.",
      "animation": "assets/animations/Online Learning.json",
    },
    {
      "title": "Get Started",
      "description": "Let’s kickstart your journey to education excellence!",
      "animation": "assets/animations/Sign up.json",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA), // very soft background
      body: SafeArea(
        child: Column(
          children: [
            // Top Logo + Branding
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Column(
                children: [
                  Image.asset('assets/images/icon.png', width: 50, height: 50),
                  const SizedBox(height: 8),
                  // Text(
                  //   "University Portal",
                  //   style: TextStyle(
                  //     fontSize: 16,
                  //     fontWeight: FontWeight.w600,
                  //     color: Colors.grey[800],
                  //   ),
                  // ),
                ],
              ),
            ),

            // Onboarding pages
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: pages.length,
                onPageChanged: (index) => setState(() => currentIndex = index),
                itemBuilder: (_, index) {
                  final page = pages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Lottie.asset(
                          page['animation']!,
                          width: 300,
                          height: 300,
                        ),
                        const SizedBox(height: 24),
                        Text(
                          page['title']!,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          page['description']!,
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.black54,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Page indicators + buttons
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.blueAccent,
                    ),
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeShell()),
                      );
                    },
                    child: const Text("Skip"),
                  ),
                  SmoothPageIndicator(
                    controller: _pageController,
                    count: pages.length,
                    effect: const WormEffect(
                      dotColor: Colors.grey,
                      activeDotColor: Colors.blueAccent,
                      dotHeight: 10,
                      dotWidth: 10,
                    ),
                  ),
                  TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.blueAccent,
                    ),
                    onPressed: () {
                      if (currentIndex == pages.length - 1) {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const HomeShell()),
                        );
                      } else {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.easeInOut,
                        );
                      }
                    },
                    child: Text(
                      currentIndex == pages.length - 1 ? "Done" : "Next",
                    ),
                  ),
                ],
              ),
            ),

            // Branding footer (small & higher up)
            Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('assets/images/icon.png', width: 50, height: 50),
                  const SizedBox(height: 8),
                  Text(
                    "Powered by eALIF Team",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[800],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
