import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useEffect } from 'react';

export default function LogScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestTrackingPermissionsAsync();
    Location.requestForegroundPermissionsAsync();
  }, []);

  if (!permission?.granted) {
    requestPermission();
    return null;
  }
  return <CameraView style={{ flex: 1 }} facing="back" />;
}
