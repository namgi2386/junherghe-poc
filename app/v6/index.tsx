import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  ViroARSceneNavigator, ViroARScene, ViroARPlane,
  Viro3DObject, ViroAmbientLight,
} from '@reactvision/react-viro';
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

export default function V6Screen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: AR3DScene }}
        style={StyleSheet.absoluteFill}
        {...({ semanticMaskingEnabled: true } as any)}
      />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <View style={styles.hint}>
        <Text style={styles.hintText}>Semantic Masking ON — 사람/사물 뒤로 가려지는지 확인</Text>
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
