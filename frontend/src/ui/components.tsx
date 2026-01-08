import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { SafeAreaView } from "react-native-safe-area-context";

function c(key: string, fallback: string) {
  return (colors as any)[key] ?? fallback;
}

export function Screen({
  children,
  scroll = true,
  safeTop = true,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  safeTop?: boolean; 
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const edges = safeTop ? (["top", "left", "right"] as const) : (["left", "right"] as const);

  if (!scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={[{ flex: 1, backgroundColor: colors.bg }, style]}
      >
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[{ padding: 16 }, contentStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function H1({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text style={[{ color: colors.text, fontSize: 22, fontWeight: "900" }, style]}>
      {children}
    </Text>
  );
}

export function Muted({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[{ color: colors.muted, fontSize: 13 }, style]}>{children}</Text>;
}

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  title,
  onPress,
  disabled,
  variant = "primary",
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}) {
  const primary = colors.primary;
  const danger = colors.danger;

  // fallbacks that don't require theme.ts changes
  const secondary = c("secondary", colors.card2);
  const disabledBg = c("disabled", colors.border);

  const bg =
    variant === "danger"
      ? danger
      : variant === "secondary"
      ? secondary
      : variant === "ghost"
      ? "transparent"
      : primary;

  const borderColor = variant === "ghost" ? colors.border : "transparent";

  const textColor = variant === "ghost" ? colors.text : "#fff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? disabledBg : bg,
          borderColor,
          borderWidth: variant === "ghost" ? 1 : 0,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  containerStyle,
  inputStyle,
  ...props
}: {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
} & TextInputProps) {
  const inputBg = c("inputBg", colors.card2);

  return (
    <View style={[{ gap: 6, marginTop: 12 }, containerStyle]}>
      <Text style={{ color: colors.muted, fontSize: 13 }}>{label}</Text>

      <TextInput
        {...props}
        style={[
          {
            backgroundColor: inputBg,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: colors.text,
          },
          props.multiline ? ({ textAlignVertical: "top" } as any) : null,
          inputStyle,
          props.style, 
        ]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}
