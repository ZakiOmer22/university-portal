import 'package:flutter/material.dart';

class AuthHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String? logoAsset;
  final String? universityName;

  const AuthHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.logoAsset,
    this.universityName,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Column(
      children: [
        const SizedBox(height: 8),
        CircleAvatar(
          radius: 36,
          backgroundColor: cs.primaryContainer,
          backgroundImage: logoAsset != null ? AssetImage(logoAsset!) : null,
          child: logoAsset == null
              ? Icon(Icons.school_rounded, color: cs.primary, size: 32)
              : null,
        ),
        const SizedBox(height: 12),
        if (universityName != null)
          Text(
            universityName!,
            style: TextStyle(
              color: Colors.grey.shade700,
              fontWeight: FontWeight.w600,
            ),
          ),
        const SizedBox(height: 10),
        Text(
          title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
          textAlign: TextAlign.center,
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 6),
          Text(
            subtitle!,
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ],
      ],
    );
  }
}
