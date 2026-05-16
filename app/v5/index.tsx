import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlane,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import { useRouter } from "expo-router";

// 스타터킷 AutoPlaneScene과 동일한 패턴
const ARScene = () => {
  const [planeFound, setPlaneFound] = useState(false);

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroARPlane
        minHeight={0.1}
        minWidth={0.1}
        onAnchorFound={() => setPlaneFound(true)}
      >
        <Viro3DObject
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require("../../assets/models/character.glb")}
          position={[0, 0, 0]}
          scale={[10, 10, 10]}
          rotation={[0, 0, 0]}
          type="GLB"
          animation={{
            name: "Armature|Skill_01|baselayer",
            run: true,
            loop: true,
            onStart: () => console.log("[V5] animation onStart fired"),
            onFinish: () => console.log("[V5] animation onFinish fired"),
          }}
        />
      </ViroARPlane>
    </ViroARScene>
  );
};

export default function V5Screen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← 돌아가기</Text>
      </TouchableOpacity>
      <View style={styles.hint}>
        <Text style={styles.hintText}>
          바닥을 비추면 character.glb가 배치됩니다 (scale 50)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 56,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: { color: "#fff", fontSize: 14 },
  hint: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hintText: { color: "#fff", fontSize: 14 },
});
