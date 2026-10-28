import AVFoundation
import UIKit

/// A route: photograph trail signs, export the map to Photos.
final class RouteViewController: UIViewController {
    private let session = AVCaptureSession()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = NSLocalizedString("route.title", comment: "")
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: NSLocalizedString("account.title", comment: ""),
            primaryAction: UIAction { [weak self] _ in
                self?.navigationController?.pushViewController(AccountViewController(), animated: true)
            })
    }

    func photographSign() {
        guard let camera = AVCaptureDevice.default(for: .video),
              let input = try? AVCaptureDeviceInput(device: camera) else { return }
        session.addInput(input)
        session.startRunning()
    }

    func export(map: UIImage) {
        UIImageWriteToSavedPhotosAlbum(map, nil, nil, nil)
    }
}
