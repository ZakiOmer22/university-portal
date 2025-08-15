class User {
  final String id;
  final String email;
  final String fullName;
  final String role;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['\$id'],
      email: map['email'],
      fullName: map['fullName'],
      role: map['role'],
    );
  }
}
