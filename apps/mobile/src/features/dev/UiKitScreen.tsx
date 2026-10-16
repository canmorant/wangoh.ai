import { useState } from "react";
import { View } from "react-native";

import { spacing } from "@/theme";
import {
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  EmptyState,
  ErrorState,
  Header,
  Icon,
  Input,
  ListRow,
  LoadingView,
  RemoteImage,
  Screen,
  SectionHeader,
  Skeleton,
  SkeletonList,
  Text,
} from "@/ui";

/** Geliştirici galerisi: arayüz kitaplığındaki her bileşen tek ekranda. Yayında kapalıdır (config.showUiKit). */
export function UiKitScreen() {
  const [chip, setChip] = useState("europe");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Screen
      onRefresh={() => new Promise((resolve) => setTimeout(resolve, 800))}
      header={<Header title="Bileşenler" subtitle="Arayüz kitaplığı galerisi" back />}
    >
      <SectionHeader title="Metin" />
      <Text variant="display">Display başlık</Text>
      <Text variant="title">Title başlık</Text>
      <Text variant="heading">Heading başlık</Text>
      <Text variant="subheading">Subheading</Text>
      <Text variant="body">Gövde metni: Ağrı Dağı'ndan Çanakkale'ye şehir rehberleri.</Text>
      <Text variant="small" color="textSecondary">Küçük ikincil metin</Text>
      <Text variant="caption" color="textMuted">Dipnot metni</Text>

      <SectionHeader title="Düğmeler" actionLabel="Tümü" onActionPress={() => undefined} />
      <View style={{ gap: spacing.md }}>
        <Button title="Birincil" onPress={() => undefined} />
        <Button title="İkincil" variant="secondary" onPress={() => undefined} />
        <Button title="Hesabı sil" variant="danger" onPress={() => undefined} />
        <Button title="Metin düğmesi" variant="ghost" onPress={() => undefined} />
        <Button title={loading ? "Gönderiliyor" : "Yükleniyor durumunu dene"} loading={loading} onPress={toggleLoading} />
        <Button title="Devre dışı" disabled onPress={() => undefined} />
        <Button title="Simgeli" icon={<Icon name="play" size={18} color="onGold" />} onPress={() => undefined} />
      </View>

      <SectionHeader title="Form" />
      <View style={{ gap: spacing.lg }}>
        <Input
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          placeholder="ad@ornek.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Parola"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          hint="En az 8 karakter"
          autoComplete="password"
        />
        <Input label="Görünen ad" value="" onChangeText={() => undefined} error="Bu alan boş bırakılamaz." />
      </View>

      <SectionHeader title="Rozet ve çip" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        <Badge label="Taslak" />
        <Badge label="Yayında" tone="success" />
        <Badge label="Yönetici" tone="gold" />
        <Badge label="Hata" tone="danger" />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
        {[
          ["europe", "Avrupa"],
          ["asia", "Asya"],
          ["africa", "Afrika"],
        ].map(([id, label]) => (
          <Chip key={id} label={label} selected={chip === id} onPress={() => setChip(id)} />
        ))}
      </View>

      <SectionHeader title="Kart ve liste" />
      <Card>
        <Text variant="subheading">Kart başlığı</Text>
        <Text variant="small" color="textSecondary">Kartlar bilgiyi yüzey rengiyle gruplar.</Text>
      </Card>
      <View style={{ marginTop: spacing.md }}>
        <ListRow title="Dokunulabilir satır" subtitle="Alt başlık burada" onPress={() => undefined} />
        <Divider />
        <ListRow title="Sağında rozet olan satır" trailing={<Badge label="Yeni" tone="gold" />} onPress={() => undefined} />
        <Divider />
        <ListRow title="Dokunulmaz satır" subtitle="Yalnız bilgi" />
      </View>

      <SectionHeader title="Görsel" />
      <RemoteImage uri={null} alt="Görsel yok yer tutucusu" aspectRatio={16 / 9} />

      <SectionHeader title="Yükleniyor" />
      <Skeleton height={20} width="60%" />
      <View style={{ height: spacing.md }} />
      <SkeletonList count={2} itemHeight={56} />
      <Card padded={false} style={{ marginTop: spacing.md }}>
        <LoadingView message="Rehber yükleniyor…" />
      </Card>

      <SectionHeader title="Boş durum" />
      <Card padded={false}>
        <EmptyState title="Sonuç bulunamadı" message="Aramanı değiştirip tekrar dene." actionLabel="Aramayı temizle" onAction={() => undefined} />
      </Card>

      <SectionHeader title="Hata durumu" />
      <Card padded={false}>
        <ErrorState error={{ status: 0, code: "NETWORK_ERROR", message: "Sunucuya ulaşılamadı." }} onRetry={() => undefined} />
      </Card>
    </Screen>
  );
}
