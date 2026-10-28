/**
 * Lens: scan documents with the camera.
 */
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

function App() {
  const device = useCameraDevice('back');

  useEffect(() => {
    request(PERMISSIONS.IOS.CAMERA);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {device ? (
        <Camera style={StyleSheet.absoluteFill} device={device} isActive photo />
      ) : (
        <Text>No camera</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});

export default App;
