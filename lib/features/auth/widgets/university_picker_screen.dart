import 'package:flutter/material.dart';

class University {
  final String id;
  final String name;
  final String city;
  final String logoAsset;
  University({
    required this.id,
    required this.name,
    required this.city,
    required this.logoAsset,
  });
}

class UniversityPickerScreen extends StatefulWidget {
  const UniversityPickerScreen({super.key});

  @override
  State<UniversityPickerScreen> createState() => _UniversityPickerScreenState();
}

class _UniversityPickerScreenState extends State<UniversityPickerScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  final List<University> _universities = [
    University(
      id: 'uoh',
      name: 'University of Hargeisa',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/uoh.png',
    ),
    University(
      id: 'uob',
      name: 'University of Burao',
      city: 'Burao',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'uos',
      name: 'Somaliland University',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'admas',
      name: 'Admas University',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'gid',
      name: 'Gollis University',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'eduhub',
      name: 'Edna Adan University',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'amoud',
      name: 'Amoud University',
      city: 'Borama',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'nugaal',
      name: 'Nugaal University',
      city: 'Laascaanood',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'hargeisa_med',
      name: 'Hargeisa University of Medicine',
      city: 'Hargeisa',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'hope',
      name: 'Hope University',
      city: 'Mogadishu',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'mog',
      name: 'University of Mogadishu',
      city: 'Mogadishu',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'benadir',
      name: 'Benadir University',
      city: 'Mogadishu',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'kis',
      name: 'Kismayo University',
      city: 'Kismayo',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'som',
      name: 'Somali National University',
      city: 'Mogadishu',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
    University(
      id: 'beder',
      name: 'Beder University',
      city: 'Mogadishu',
      logoAsset: 'assets/images/universities/placeholder.png',
    ),
  ];

  String _query = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final filtered = _universities
        .where(
          (u) =>
              u.name.toLowerCase().contains(_query.toLowerCase()) ||
              u.city.toLowerCase().contains(_query.toLowerCase()),
        )
        .toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Choose Your University')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (v) => setState(() => _query = v),
              decoration: const InputDecoration(
                hintText: 'Search university by name or city',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                Icon(Icons.school_rounded, color: cs.primary),
                const SizedBox(width: 8),
                Text(
                  'Select your institution to continue',
                  style: TextStyle(color: Colors.grey.shade700),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, i) {
                final u = filtered[i];
                return InkWell(
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      '/login',
                      arguments: {
                        'universityId': u.id,
                        'universityName': u.name,
                        'logo': u.logoAsset,
                      },
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0x11000000)),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x14000000),
                          blurRadius: 12,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundColor: cs.primaryContainer,
                          backgroundImage: AssetImage(u.logoAsset),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                u.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                u.city,
                                style: TextStyle(color: Colors.grey.shade700),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios_rounded, size: 18),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
