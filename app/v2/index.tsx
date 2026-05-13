import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { ViroARSceneNavigator, ViroARScene, ViroText } from '@reactvision/react-viro';
import { useRouter } from 'expo-router';

function ARScene() {
  return (
    <ViroARScene>
      <ViroText
        text="AR 동작 확인"
        position={[0, 0, -2]}
        style={{ fontSize: 20, color: '#ffffff' }}
      />
    </ViroARScene>
  );
}

export default function V2Screen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: ARScene }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', top: 56, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backText: { color: '#fff', fontSize: 14 },
});
