import 'package:flutter/material.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/features/auth/register_screen.dart';
import 'package:university_portal/features/splash/splash_screen.dart';
import 'package:university_portal/screens/notifications_screen.dart';
import 'package:university_portal/screens/student/attendance_screen.dart';
import 'package:university_portal/screens/student/calender_screen.dart';
import 'package:university_portal/screens/student/community_screen.dart';
import 'package:university_portal/screens/student/courses_screen.dart';
import 'package:university_portal/screens/student/exam_screen.dart';
import 'package:university_portal/screens/student/finance_screen.dart';
import 'package:university_portal/screens/student/grades_screen.dart';
import 'package:university_portal/screens/student/help_screen.dart';
import 'package:university_portal/screens/student/home_screen.dart';
import 'package:university_portal/screens/student/course_retake.dart';
import 'package:university_portal/screens/student/settings_screen.dart';

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
        visualDensity: VisualDensity.adaptivePlatformDensity,
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Colors.black87, fontSize: 16),
          titleLarge: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.indigo,
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 2,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
            foregroundColor: Colors.white,
            textStyle: const TextStyle(fontWeight: FontWeight.bold),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8)),
            ),
          ),
        ),
      ),
      initialRoute: '/splash',
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/notifications': (context) => const NotificationsPage(),
        '/login': (context) => const LoginScreen(),
        '/students/home': (context) => const HomeShell(),
        '/register': (_) => const RegisterScreen(),

        // ? ---------------- STUDENT ROUTES ----------------
        '/students/home': (context) => const HomeShell(),
        '/students/courses': (context) => const CoursesPage(),
        // '/students/course-registration': (context) =>
        //     const CourseRegistrationPage(),
        '/students/course-retake': (context) => const CourseRetakePage(),
        '/students/schedule': (context) => const ScheduleScreen(),
        '/students/settings': (context) => const SettingsPage(),
        // '/students/messages': (context) => const MessagesPage(),
        // '/students/assignments': (context) => const AssignmentsPage(),
        '/students/grades': (context) => const GradesScreen(),
        // '/students/analytics': (context) => const ProgressAnalyticsPage(),
        '/students/support': (context) => const HelpSupportPage(),
        // '/students/profile': (context) => const StudentProfilePage(),
        // '/students/transcript': (context) => const TranscriptPage(),
        '/students/exam-report': (context) => const ExamScheduleScreen(),
        // '/students/fees': (context) => const FeesPaymentsPage(),
        // '/students/library': (context) => const LibraryPage(),
        '/students/announcements': (context) => const CommunityPage(),
        // '/students/career': (context) => const CareerServicesPage(),
        '/students/attendance': (context) => const AttendancePage(),
        '/students/finance': (context) => const FinanceScreen(),
      },
    );
  }
}
