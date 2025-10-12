import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'config/routes.dart';

class CanteenApp extends StatelessWidget {
  const CanteenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Canteen Ordering System',
      theme: appTheme,
      initialRoute: '/',
      routes: appRoutes,
      debugShowCheckedModeBanner: false,
    );
  }
}
