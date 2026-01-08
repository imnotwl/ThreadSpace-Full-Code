import React from "react";
import {
  Modal,
  Pressable,
  FlatList,
  Text,
  View,
} from "react-native";
import type { CategoryDto } from "../types";
import { colors } from "./theme";
import { Card, Muted } from "./components";

export default function CategoryPickerModal({
  visible,
  categories,
  selectedId,
  title = "Select a category",
  onSelect,
  onClose,
}: {
  visible: boolean;
  categories: CategoryDto[];
  selectedId?: number | null;
  title?: string;
  onSelect: (category: CategoryDto) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View style={{ maxHeight: "75%" }}>
          <Card>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
              {title}
            </Text>
            <Muted style={{ marginTop: 4 }}>
              You can only post in one of the preset categories.
            </Muted>

            <View style={{ height: 12 }} />

            <FlatList
              data={categories}
              keyExtractor={(c) => String(c.id)}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => {
                const isSelected = selectedId != null && item.id === selectedId;
                return (
                  <Pressable
                    onPress={() => onSelect(item)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : "rgba(255,255,255,0.10)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>
                      {item.name}
                    </Text>
                    {item.description ? (
                      <Text style={{ color: colors.muted, marginTop: 4 }}>
                        {item.description}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />

            <View style={{ height: 12 }} />

            <Pressable
              onPress={onClose}
              style={{
                alignSelf: "flex-end",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>Close</Text>
            </Pressable>
          </Card>
        </View>
      </View>
    </Modal>
  );
}
