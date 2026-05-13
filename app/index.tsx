import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ITEMS = [
  { route: '/v2', label: 'V2', desc: '기본 AR Scene 렌더링' },
  { route: '/v3', label: 'V3', desc: 'GPS 기반 AR 미션 트리거' },
  { route: '/v4', label: 'V4', desc: '마커리스 평면 감지' },
  { route: '/v5', label: 'V5', desc: '3D 오브젝트 렌더링 (GLB)' },
  { route: '/v6', label: 'V6', desc: 'Semantic Masking' },
  { route: '/v7', label: 'V7', desc: 'AR 오브젝트 터치 인터랙션' },
  { route: '/v9', label: 'V9', desc: '성능 측정 (FPS)' },
];

export default function VerificationHub() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AR 기술검증</Text>
      <View style={styles.v1}>
        <Text style={styles.v1Text}>V1 — 빌드 성공 (이 화면이 보이면 통과)</Text>
      </View>
      {ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.cardLabel}>{item.label}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, backgroundColor: '#0f0f0f', minHeight: '100%', gap: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  v1: { backgroundColor: '#1a3a1a', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2d6a2d' },
  v1Text: { color: '#5cdd5c', fontSize: 14 },
  card: { backgroundColor: '#1c1c1e', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#2c2c2e', flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardLabel: { color: '#0a84ff', fontWeight: '700', fontSize: 16, width: 32 },
  cardDesc: { color: '#ebebf5', fontSize: 14, flex: 1 },
});
