import GoogleSignIn
import SwiftUI

/// Account creation: e-mail and password against the app's backend, or Google.
struct SignUpView: View {
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        Form {
            TextField("E-mail", text: $email)
            SecureField("Password", text: $password)
            Button("Create account") { Task { try? await AccountService.shared.createUser(withEmail: email, password: password) } }
            Button("Continue with Google") { signInWithGoogle() }
        }
    }

    private func signInWithGoogle() {
        guard let root = UIApplication.shared.connectedScenes
            .compactMap({ ($0 as? UIWindowScene)?.keyWindow?.rootViewController }).first else { return }
        GIDSignIn.sharedInstance.signIn(withPresenting: root) { _, _ in }
    }
}

/// The app's own account API.
actor AccountService {
    static let shared = AccountService()

    func createUser(withEmail email: String, password: String) async throws {
        var request = URLRequest(url: URL(string: "https://api.example.com/v1/accounts")!)
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(["email": email, "password": password])
        _ = try await URLSession.shared.data(for: request)
    }
}
