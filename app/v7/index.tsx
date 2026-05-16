import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  ViroARSceneNavigator, ViroARScene, ViroARPlane,
  Viro3DObject, ViroAmbientLight, ViroText,
} from '@reactvision/react-viro';
import { useRouter } from 'expo-router';

function ARInteractionScene() {
  const [tapCount, setTapCount] = useState(0);
  const [collected, setCollected] = useState(false);

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroARPlane minHeight={0.1} minWidth={0.1} alignment="Horizontal">
        {!collected ? (
          <Viro3DObject
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('../../assets/models/character.glb')}
            position={[0, 0, 0]}
            scale={[10, 10, 10]}
            rotation={[0, 0, 0]}
            type="GLB"
            onClick={() => {
              const next = tapCount + 1;
              setTapCount(next);
              if (next >= 3) setCollected(true);
            }}
          />
        ) : (
          <ViroText
            text="Collected!"
            position={[0, 0.5, 0]}
            style={{ fontSize: 20, color: '#ffff00' }}
          />
        )}
      </ViroARPlane>
      {!collected && (
        <ViroText
          text={`Tap ${tapCount}/3`}
          position={[0, 0.8, -2]}
          style={{ fontSize: 16, color: '#ffffff' }}
        />
      )}
    </ViroARScene>
  );
}

export default function V7Screen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator initialScene={{ scene: ARInteractionScene }} style={StyleSheet.absoluteFill} />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <View style={styles.hint}>
        <Text style={styles.hintText}>캐릭터를 3번 탭하면 수집 완료</Text>
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
