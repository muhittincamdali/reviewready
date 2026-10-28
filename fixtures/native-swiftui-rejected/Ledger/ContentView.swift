import CoreLocation
import SwiftUI

struct ContentView: View {
    @State private var showScanner = false
    private let location = CLLocationManager()

    var body: some View {
        NavigationStack {
            List {
                Button("Scan a receipt") { showScanner = true }
                Button("Tag with my location") { location.requestWhenInUseAuthorization() }
                NavigationLink("Sign up") { SignUpView() }
            }
            .navigationTitle("Ledger")
            .sheet(isPresented: $showScanner) { ScannerView() }
        }
    }
}
