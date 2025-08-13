import 'package:flutter/material.dart';
import 'package:university_portal/features/splash/splash_screen.dart';

void main() {
  runApp(const UoHApp());
}

class UoHApp extends StatelessWidget {
  const UoHApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'University Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: Colors.white,
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Colors.black87),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
