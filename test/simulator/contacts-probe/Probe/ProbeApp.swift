import Contacts
import SwiftUI

/// Asks for the contacts as soon as it opens: what happens depends only on whether the Info.plist
/// has NSContactsUsageDescription.
@main
struct ProbeApp: App {
    var body: some Scene {
        WindowGroup {
            Text("Invite friends from your contacts")
                .font(.title2)
                .multilineTextAlignment(.center)
                .padding()
                .task {
                    _ = try? await CNContactStore().requestAccess(for: .contacts)
                }
        }
    }
}
