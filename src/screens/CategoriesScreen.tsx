import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCategories } from "../api/endpoints";
import type { CategoryDto } from "../types";
import { RootStackParamList } from "../navigation/types";
import { Card, H1, Loading, Muted, Screen } from "../ui/components";
import { colors } from "../ui/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CategoriesScreen() {
  const nav = useNavigation<Nav>();
  const [cats, setCats] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getCategories();
      setCats(res ?? []);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Failed to load categories";
      Alert.alert("Error", String(msg));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={cats}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 8 }}>
            <H1>Categories</H1>
            <Muted>Pick one to browse posts.</Muted>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              Alert.alert("Category", `Selected: ${item.name}`);
            }}
          >
            <Card>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
                {item.name}
              </Text>
              {item.description ? (
                <Text style={{ color: colors.muted, marginTop: 6 }}>
                  {item.description}
                </Text>
              ) : null}
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
