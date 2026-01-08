import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCategories, getPostsByCategory } from "../api/endpoints";
import type { CategoryDto, PostDto } from "../types";
import { RootStackParamList } from "../navigation/types";
import { Card, H1, Loading, Muted, Screen, Button } from "../ui/components";
// import { CategoryPickerModal } from "../ui/CategoryPickerModal";
import { colors } from "../ui/theme";
import CategoryPickerModal from "../ui/CategoryPickerModal";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function FeedScreen() {
  const nav = useNavigation<Nav>();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  const [items, setItems] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  function pickDefaultCategoryId(cats: CategoryDto[]): number | null {
    const general = cats.find((c) => c.name?.toLowerCase() === "general");
    return (general ?? cats[0])?.id ?? null;
  }

  const load = useCallback(async (categoryId?: number | null) => {
    try {
      const cats = await getCategories();
      setCategories(cats);

      const nextCategoryId = categoryId ?? selectedCategoryId ?? pickDefaultCategoryId(cats);
      setSelectedCategoryId(nextCategoryId);

      if (nextCategoryId == null) {
        setItems([]);
        return;
      }

      const posts = await getPostsByCategory(nextCategoryId);
      setItems(posts);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load feed.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    load();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load(selectedCategoryId);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <CategoryPickerModal
        visible={pickerOpen}
        categories={categories}
        selectedId={selectedCategoryId}
        title="Browse a category"
        onClose={() => setPickerOpen(false)}
        onSelect={(c) => {
          setPickerOpen(false);
          setSelectedCategoryId(c.id);
          setLoading(true);
          load(c.id);
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <H1 style={{ fontSize: 20 }}>Feed</H1>

              <Muted style={{ fontSize: 14 }}>
                Showing: {selectedCategory?.name ?? "All"}
              </Muted>
            </View>


            <View style={{ height: 10 }} />

            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Button
                title={selectedCategory ? selectedCategory.name : "Choose Category"}
                onPress={() => setPickerOpen(true)}
              />
              <Pressable onPress={() => nav.navigate("EditPost", undefined)}>
                <Text style={{ color: colors.primary, fontWeight: "700" }}>+ Create Post</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card>
            <Text style={{ color: colors.text, fontWeight: "700" }}>No posts yet</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>
              Be the first to post in {selectedCategory?.name ?? "this category"}.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => nav.navigate("PostDetail", { postId: item.id })}>
            <Card>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
                {item.title}
              </Text>
              {item.description ? (
                <Text style={{ color: colors.muted, marginTop: 6 }}>{item.description}</Text>
              ) : null}

              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {item.authorUsername ? `@${item.authorUsername}` : "—"}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
