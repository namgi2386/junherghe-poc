import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  ViroARSceneNavigator, ViroARScene, ViroARPlane,
  ViroBox, ViroMaterials, ViroAmbientLight,
} from '@reactvision/react-viro';
import { useRouter } from 'expo-router';

ViroMaterials.createMaterials({
  green: { diffuseColor: '#00ff00' },
});

function ARPlaneScene() {
  const [detected, setDetected] = useState(false);
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroARPlane
        minHeight={0.1}
        minWidth={0.1}
        alignment="Horizontal"
        onAnchorFound={() => setDetected(true)}
      >
        <ViroBox
          position={[0, 0.1, 0]}
          scale={[0.2, 0.2, 0.2]}
          materials={['green']}
        />
      </ViroARPlane>
    </ViroARScene>
  );
}

export default function V4Screen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator initialScene={{ scene: ARPlaneScene }} style={StyleSheet.absoluteFill} />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <View style={styles.hint}>
        <Text style={styles.hintText}>바닥을 비추면 초록 박스가 배치됩니다</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', top: 56, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backText: { color: '#fff', fontSize: 14 },
  hint: { position: 'absolute', bottom: 48, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  hintText: { color: '#fff', fontSize: 14 },
});
