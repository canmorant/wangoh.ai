import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router/js-tabs";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/auth";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Etkin sekmede dolu, etkin olmayanda çizgili simge; renk (altın / soluk) gezintiden gelir. */
function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
  };
}

export default function TabsLayout() {
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        // Varsayılan yükseklik (49) 12 pt etiketle taşar ve etiket kırpılır; içerik alanı 54 pt kalacak
        // biçimde yükseltilir, alt güvenli alan (ana ekran çubuğu) elle eklenir.
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom + 4,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="(explore)" options={{ title: "Keşfet", tabBarIcon: tabIcon("compass", "compass-outline") }} />
      <Tabs.Screen name="blog" options={{ title: "Blog", tabBarIcon: tabIcon("newspaper", "newspaper-outline") }} />
      <Tabs.Screen name="games" options={{ title: "Oyunlar", tabBarIcon: tabIcon("game-controller", "game-controller-outline") }} />
      <Tabs.Screen name="profile" options={{ title: "Profil", tabBarIcon: tabIcon("person", "person-outline") }} />
      {/* Yönetim sekmesi yalnız yöneticide görünür; `href: null` sekmeyi çubuktan gizler. Yetkiyi asıl API denetler. */}
      <Tabs.Screen
        name="admin"
        options={{
          title: "Yönetim",
          href: isAdmin ? undefined : null,
          tabBarIcon: tabIcon("shield-checkmark", "shield-checkmark-outline"),
        }}
      />
    </Tabs>
  );
}
