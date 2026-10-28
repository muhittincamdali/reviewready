import 'package:camera/camera.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

void main() => runApp(const HarvestApp());

/// Harvest: photograph what you picked, invite friends from your contacts.
class HarvestApp extends StatelessWidget {
  const HarvestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoApp(title: 'Harvest', home: SignUpPage());
  }
}

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();

  Future<void> _createAccount() async {
    await FirebaseAuth.instance.createUserWithEmailAndPassword(
      email: _email.text,
      password: _password.text,
    );
  }

  Future<void> _continueWithGoogle() async {
    await GoogleSignIn.instance.authenticate();
  }

  Future<void> _photographHarvest() async {
    final cameras = await availableCameras();
    final controller = CameraController(cameras.first, ResolutionPreset.high);
    await controller.initialize();
  }

  Future<void> _pickFromLibrary() async {
    await ImagePicker().pickImage(source: ImageSource.gallery);
  }

  Future<void> _inviteFriends() async {
    await Permission.contacts.request();
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text('Create account')),
      child: SafeArea(
        child: ListView(
          children: [
            CupertinoTextField(controller: _email, placeholder: 'E-mail'),
            CupertinoTextField(controller: _password, placeholder: 'Password', obscureText: true),
            CupertinoButton(onPressed: _createAccount, child: const Text('Sign up')),
            CupertinoButton(onPressed: _continueWithGoogle, child: const Text('Continue with Google')),
            CupertinoButton(onPressed: _photographHarvest, child: const Text('Photograph your harvest')),
            CupertinoButton(onPressed: _pickFromLibrary, child: const Text('Choose a photo')),
            CupertinoButton(onPressed: _inviteFriends, child: const Text('Invite friends')),
          ],
        ),
      ),
    );
  }
}
