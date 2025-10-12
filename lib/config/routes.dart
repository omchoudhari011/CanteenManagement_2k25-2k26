import 'package:flutter/material.dart';
import '../views/auth/login_screen.dart';
import '../views/student/home_screen.dart';

final Map<String, WidgetBuilder> appRoutes = {
  '/': (context) => const LoginScreen(),
  '/home': (context) => const HomeScreen(),
};
