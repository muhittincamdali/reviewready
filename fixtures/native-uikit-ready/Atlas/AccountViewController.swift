import AuthenticationServices
import FirebaseAuth
import GoogleSignIn
import UIKit

/// Sign up with e-mail, Google or Apple; delete the account from the same screen.
final class AccountViewController: UIViewController, ASAuthorizationControllerDelegate {
    func signUp(email: String, password: String) async throws {
        _ = try await Auth.auth().createUser(withEmail: email, password: password)
    }

    func signInWithGoogle() {
        GIDSignIn.sharedInstance.signIn(withPresenting: self) { _, _ in }
    }

    func signInWithApple() {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.performRequests()
    }

    func deleteAccount() async throws {
        try await Auth.auth().currentUser?.delete()
    }
}
