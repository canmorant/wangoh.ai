import { ScrollView, StyleSheet } from "react-native";

import { spacing } from "@/theme";
import { Chip } from "@/ui";

export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
}

export interface FilterChipsProps<T extends string> {
  options: ReadonlyArray<FilterChipOption<T>>;
  value: T | null;
  onChange: (value: T | null) => void;
  /** Süzgeci kapatan ilk çip ("Tümü"). */
  allLabel?: string;
  accessibilityLabel: string;
}

/** Yatay kaydırılan süzgeç çipleri. Seçili çipe yeniden dokunmak süzgeci kapatır. */
export function FilterChips<T extends string>({ options, value, onChange, allLabel = "Tümü", accessibilityLabel }: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
    >
      <Chip label={allLabel} selected={value === null} onPress={() => onChange(null)} />
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(value === option.value ? null : option.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { gap: spacing.sm, paddingVertical: spacing.xs, alignItems: "center" },
});
