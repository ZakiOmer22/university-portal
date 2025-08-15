import 'dart:io' show Platform;
import 'package:flutter/material.dart';

class OAuthButtons extends StatelessWidget {
  final VoidCallback onGoogle;
  final VoidCallback onMicrosoft;
  final VoidCallback? onApple; // Only on iOS

  const OAuthButtons({
    super.key,
    required this.onGoogle,
    required this.onMicrosoft,
    this.onApple,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onGoogle,
                icon: const Icon(Icons.g_mobiledata_rounded, size: 28),
                label: const Text('Continue with Google'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onMicrosoft,
                icon: const Icon(Icons.workspaces_rounded),
                label: const Text('Continue with Microsoft'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
        if (onApple != null &&
            (Theme.of(context).platform == TargetPlatform.iOS ||
                Platform.isIOS)) ...[
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onApple,
                  icon: const Icon(Icons.apple),
                  label: const Text('Continue with Apple'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black87,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: Divider(color: cs.outlineVariant)),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Text('or', style: TextStyle(fontWeight: FontWeight.w600)),
            ),
            Expanded(child: Divider(color: cs.outlineVariant)),
          ],
        ),
      ],
    );
  }
}
