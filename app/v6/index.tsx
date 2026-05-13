import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  ViroARSceneNavigator, ViroARScene, ViroARPlane,
  Viro3DObject, ViroAmbientLight, ViroSpotLight,
} from '@reactvision/react-viro';
import { useRouter } from 'expo-router';

function AR3DScene() {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroSpotLight
        position={[0, 3, 0]}
        direction={[0, -1, 0]}
        color="#ffffff"
        intensity={300}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        castsShadow={true}
      />
      <ViroARPlane alignment="Horizontal">
        <Viro3DObject
          source={require('../../assets/models/character.glb')}
          position={[0, 0, 0]}
          scale={[0.5, 0.5, 0.5]}
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
