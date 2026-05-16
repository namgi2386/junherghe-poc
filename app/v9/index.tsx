import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  ViroARSceneNavigator, ViroARScene, ViroARPlane,
  Viro3DObject, ViroAmbientLight,
} from '@reactvision/react-viro';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

function AR3DScene() {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroARPlane minHeight={0.1} minWidth={0.1} alignment="Horizontal">
        <Viro3DObject
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../assets/models/character.glb')}
          position={[0, 0, 0]}
          scale={[10, 10, 10]}
          rotation={[0, 0, 0]}
          type="GLB"
        />
      </ViroARPlane>
    </ViroARScene>
  );
}

function FPSOverlay() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTime.current) / 1000;
      setFps(Math.round(frameCount.current / elapsed));
      frameCount.current = 0;
      lastTime.current = now;
    }, 1000);

    // requestAnimationFrame loop to count frames
    let animId: number;
    const tick = () => {
      frameCount.current += 1;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <View style={styles.fpsBox}>
      <Text style={styles.fpsText}>FPS: {fps}</Text>
    </View>
  );
}

export default function V9Screen() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // GPS 동시 구동 (실사용 시나리오 재현)
    let subscription: Location.LocationSubscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 1 },
          () => {}
        );
      }
    })();

    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);

    return () => {
      subscription?.remove();
      clearInterval(timer);
    };
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator initialScene={{ scene: AR3DScene }} style={StyleSheet.absoluteFill} />
      <FPSOverlay />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <View style={styles.timer}>
        <Text style={styles.timerText}>경과: {mins}:{secs.toString().padStart(2, '0')}</Text>
        <Text style={styles.timerSub}>GPS + 카메라 + 3D 동시 구동 중</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', top: 56, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backText: { color: '#fff', fontSize: 14 },
  fpsBox: { position: 'absolute', top: 56, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  fpsText: { color: '#30d158', fontSize: 14, fontWeight: '700' },
  timer: { position: 'absolute', bottom: 48, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  timerText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  timerSub: { color: '#8e8e93', fontSize: 12, marginTop: 2 },
});
