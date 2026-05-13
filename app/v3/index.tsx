import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { ViroARSceneNavigator, ViroARScene, ViroText } from '@reactvision/react-viro';
import { useRouter } from 'expo-router';

const TARGET = { lat: 33.4589, lon: 126.9426, label: '성산일출봉' };
const TRIGGER_RADIUS = 50;

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ARMissionScene() {
  return (
    <ViroARScene>
      <ViroText text="미션 활성화!" position={[0, 0, -2]} style={{ fontSize: 20, color: '#ffff00' }} />
    </ViroARScene>
  );
}

export default function V3Screen() {
  const router = useRouter();
  const [distance, setDistance] = useState<number | null>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let subscription: Location.LocationSubscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          const d = getDistanceMeters(loc.coords.latitude, loc.coords.longitude, TARGET.lat, TARGET.lon);
          setDistance(Math.round(d));
          setTriggered(d <= TRIGGER_RADIUS);
        }
      );
    })();
    return () => { subscription?.remove(); };
  }, []);

  if (triggered) {
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator initialScene={{ scene: ARMissionScene }} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backDark} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <Text style={styles.title}>V3 GPS 트리거</Text>
      <Text style={styles.target}>{TARGET.label}</Text>
      <Text style={styles.distance}>{distance !== null ? `${distance}m` : '위치 측정 중...'}</Text>
      <Text style={styles.radius}>트리거 반경: {TRIGGER_RADIUS}m</Text>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${Math.min(100, ((TRIGGER_RADIUS / (distance || 9999)) * 100))}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', padding: 24 },
  back: { position: 'absolute', top: 56, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backDark: { position: 'absolute', top: 56, left: 16, backgroundColor: '#1c1c1e', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backText: { color: '#fff', fontSize: 14 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 24 },
  target: { color: '#0a84ff', fontSize: 18, marginBottom: 8 },
  distance: { color: '#fff', fontSize: 48, fontWeight: '700', marginBottom: 4 },
  radius: { color: '#8e8e93', fontSize: 14, marginBottom: 24 },
  bar: { width: '100%', height: 8, backgroundColor: '#2c2c2e', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#30d158', borderRadius: 4 },
});
