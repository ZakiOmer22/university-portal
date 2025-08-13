import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: 32,
        vertical: 16,
      ), // lifts from bottom
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        // color: Colors.indigo.shade50,
        borderRadius: BorderRadius.circular(12), // rounded edges
        // boxShadow: [
        //   BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 3)),
        // ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset('assets/images/icon.png', width: 40, height: 40),
          const SizedBox(width: 8),
          Text(
            'Powered by eALIF Team',
            style: TextStyle(color: const Color.fromARGB(255, 255, 255, 255)),
          ),
        ],
      ),
    );
  }
}
