import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
} from "@reactvision/react-viro";
import { useRouter } from "expo-router";

const TARGET = {
  lat: 35.17983545861589,
  lon: 126.91230458988187,
  label: "Home",
};

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 거리별 단계 정의
type Zone = "far" | "r30" | "r20" | "r10";

function getZone(d: number): Zone {
  if (d <= 10) return "r10";
  if (d <= 20) return "r20";
  if (d <= 30) return "r30";
  return "far";
}

const ZONE_CONFIG: Record<Zone, { color: string; label: string; bg: string }> =
  {
    far: { color: "#8e8e93", label: "탐색 중", bg: "#0f0f0f" },
    r30: { color: "#ffd60a", label: "30m 반경 진입", bg: "#1a1600" },
    r20: { color: "#ff9f0a", label: "20m 반경 진입", bg: "#1a0e00" },
    r10: { color: "#ff453a", label: "10m — AR 활성화", bg: "#1a0000" },
  };

function ARMissionScene() {
  return (
    <ViroARScene>
      <ViroText
        text="Mission Active"
        position={[0, 0, -2]}
        style={{ fontSize: 20, color: "#ffff00" }}
      />
    </ViroARScene>
  );
}

export default function V3Screen() {
  const router = useRouter();
  const [distance, setDistance] = useState<number | null>(null);
  const [zone, setZone] = useState<Zone>("far");

  useEffect(() => {
    let subscription: Location.LocationSubscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 3 },
        (loc) => {
          const d = getDistanceMeters(
            loc.coords.latitude,
            loc.coords.longitude,
            TARGET.lat,
            TARGET.lon,
          );
          setDistance(Math.round(d));
          setZone(getZone(d));
        },
      );
    })();
    return () => {
      subscription?.remove();
    };
  }, []);

  // 10m 이내 → AR 화면 (거리는 항상 표시)
  if (zone === "r10") {
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
          initialScene={{ scene: ARMissionScene }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.arOverlay}>
          <Text style={styles.arDistance}>
            {distance !== null ? `${distance}m` : "..."}
          </Text>
          <Text style={styles.arLabel}>10m — AR Active</Text>
        </View>
      </View>
    );
  }

  const cfg = ZONE_CONFIG[zone];

  return (
    <View style={[styles.container, { backgroundColor: cfg.bg }]}>
      <TouchableOpacity style={styles.backDark} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>V3 GPS Trigger</Text>
      <Text style={[styles.target, { color: cfg.color }]}>{TARGET.label}</Text>
      <Text style={[styles.distance, { color: cfg.color }]}>
        {distance !== null ? `${distance}m` : "..."}
      </Text>
      <Text style={[styles.zoneLabel, { color: cfg.color }]}>{cfg.label}</Text>

      {/* 반경 인디케이터 */}
      <View style={styles.radii}>
        {([30, 20, 10] as const).map((r) => {
          const active = distance !== null && distance <= r;
          const zoneKey = getZone(r - 1);
          return (
            <View
              key={r}
              style={[styles.radiusRow, active && styles.radiusRowActive]}
            >
              <View
                style={[
                  styles.dot,
                  active && { backgroundColor: ZONE_CONFIG[zoneKey].color },
                ]}
              />
              <Text
                style={[
                  styles.radiusText,
                  active && { color: ZONE_CONFIG[zoneKey].color },
                ]}
              >
                {r}m {active ? "✓ 진입" : ""}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  back: {
    position: "absolute",
    top: 56,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backDark: {
    position: "absolute",
    top: 56,
    left: 16,
    backgroundColor: "#1c1c1e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: { color: "#fff", fontSize: 14 },
  arOverlay: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    backgroundColor: "rgba(255,69,58,0.85)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  arDistance: { color: "#fff", fontSize: 36, fontWeight: "700" },
  arLabel: { color: "#fff", fontSize: 13, marginTop: 2 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 24 },
  target: { fontSize: 18, marginBottom: 8 },
  distance: { fontSize: 64, fontWeight: "700", marginBottom: 4 },
  zoneLabel: { fontSize: 16, fontWeight: "600", marginBottom: 32 },
  radii: { gap: 12, width: "100%" },
  radiusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1c1c1e",
  },
  radiusRowActive: { backgroundColor: "#2c2c2e" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#3a3a3c" },
  radiusText: { color: "#8e8e93", fontSize: 15 },
});
