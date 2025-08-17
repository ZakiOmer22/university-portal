import 'package:flutter/material.dart';
import 'package:university_portal/features/auth/login_screen.dart';
import 'package:university_portal/features/auth/register_screen.dart';
import 'package:university_portal/features/splash/splash_screen.dart';
import 'package:university_portal/screens/notifications_screen.dart';
import 'package:university_portal/screens/parent/parent_attandace_screen.dart';
import 'package:university_portal/screens/parent/parent_fees_screen.dart';
import 'package:university_portal/screens/parent/parent_grades_screen.dart';
import 'package:university_portal/screens/parent/parent_home_screen.dart';
import 'package:university_portal/screens/parent/parent_progress_screen.dart';
import 'package:university_portal/screens/parent/parent_scedule_screen.dart';
import 'package:university_portal/screens/parent/parent_teacher_message.dart';
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
import 'package:university_portal/screens/teacher/teacher_annoucements.dart';
import 'package:university_portal/screens/teacher/teacher_classroom_screen.dart';
import 'package:university_portal/screens/teacher/teacher_consuling_screen.dart';
import 'package:university_portal/screens/teacher/teacher_courses_screen.dart';
import 'package:university_portal/screens/teacher/home_screen.dart';
import 'package:university_portal/screens/teacher/teacher_exams_records_screen.dart';
import 'package:university_portal/screens/teacher/teacher_gradebook_screen.dart';
import 'package:university_portal/screens/teacher/teacher_leave_req_screen.dart';
import 'package:university_portal/screens/teacher/teacher_library_screen.dart';
import 'package:university_portal/screens/teacher/teacher_payments_screen.dart';
import 'package:university_portal/screens/teacher/teacher_profile.dart';
import 'package:university_portal/screens/teacher/teacher_scedule_screen.dart';
import 'package:university_portal/screens/teacher/teacher_student_submsions.dart';
import 'package:university_portal/screens/teacher/teacher_support_screen.dart';
import 'package:university_portal/screens/teacher/teaher_messages_screen.dart';
import 'package:university_portal/screens/teacher/teacher_exam_screen.dart';

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
      // Always start with splash
      home: const SplashScreen(),
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/notifications': (context) => const NotificationsPage(),
        '/login': (context) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),

        // ? ---------------- STUDENT ROUTES ----------------
        '/students/home': (context) => const HomeShell(),
        '/students/courses': (context) => const CoursesPage(),
        '/students/course-retake': (context) => const CourseRetakePage(),
        '/students/schedule': (context) => const ScheduleScreen(),
        '/students/settings': (context) => const SettingsPage(),
        '/students/grades': (context) => const GradesScreen(),
        '/students/support': (context) => const HelpSupportPage(),
        '/students/exam-report': (context) => const ExamScheduleScreen(),
        '/students/announcements': (context) => const CommunityPage(),
        '/students/attendance': (context) => const AttendancePage(),
        '/students/finance': (context) => const FinanceScreen(),

        // ! ---------------- TEACHER ROUTES ----------------
        '/teacher/home': (context) => const TeacherDashboard(),
        '/dashboard/teacher/courses': (context) => TeacherCoursesPage(),
        '/dashboard/teacher/messages': (context) => const TeacherMessagesPage(),
        '/dashboard/teacher/exam-records': (context) =>
            const TeacherExamRecordsPage(),
        // '/dashboard/teacher/attendance': (context) => const TeacherAttendance(),
        '/dashboard/teacher/submissions': (context) =>
            const StudentSubmissionsPage(),
        '/dashboard/teacher/payments': (context) => const TeacherSalaryPage(),
        '/dashboard/teacher/announcements': (context) =>
            const AnnouncementsPage(),
        '/dashboard/teacher/schedule': (context) => const TeacherSchedule(),
        '/dashboard/teacher/grades': (context) => const TeacherGrades(),
        '/dashboard/teacher/leave-requests': (context) =>
            const TeacherLeaveRequests(),
        '/dashboard/teacher/counseling': (context) => const TeacherCounseling(),
        '/dashboard/teacher/classroom': (context) =>
            const TeacherClassroomManagement(),
        '/dashboard/teacher/resources': (context) => const TeacherLibrary(),
        '/dashboard/teacher/exams': (context) => const TeacherExams(),
        '/dashboard/teacher/support': (context) => const TeacherSupport(),
        '/dashboard/teacher/profile': (context) => const TeacherProfile(),

        // * ---------------- PARENT ROUTES ----------------
        '/parent/home': (context) => const ParentDashboard(),
        '/dashboard/parent/fees': (context) => const FeesPaymentsPage(),
        '/dashboard/parent/schedule': (context) => const AcademicSchedulePage(),
        '/dashboard/parent/messages': (context) => const ParentMessagesPage(),
        '/dashboard/parent/attendance': (context) =>
            const ParentAttendancePage(),
        '/dashboard/parent/progress': (context) => const ParentProgressPage(),
        '/dashboard/parent/grades': (context) => const ParentGradesPage(),
      },
    );
  }
}
