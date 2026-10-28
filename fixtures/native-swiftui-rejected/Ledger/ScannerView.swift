import AVFoundation
import SwiftUI

/// Reads receipts with the camera.
final class ReceiptScanner {
    let session = AVCaptureSession()

    func start() {
        guard let camera = AVCaptureDevice.default(for: .video),
              let input = try? AVCaptureDeviceInput(device: camera) else { return }
        session.addInput(input)
        session.startRunning()
    }
}

struct ScannerView: View {
    private let scanner = ReceiptScanner()

    var body: some View {
        Text("Point the camera at a receipt")
            .onAppear { scanner.start() }
    }
}
