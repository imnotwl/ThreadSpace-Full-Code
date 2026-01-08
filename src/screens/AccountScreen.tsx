import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { deletePost, getMyPosts } from "../api/endpoints";
import type { PostDto } from "../types";
import { useAuth } from "../auth/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { Button, Card, H1, Loading, Muted, Screen } from "../ui/components";
import { colors } from "../ui/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const nav = useNavigation<Nav>();
  const { user, signOut, refreshMe } = useAuth();

  const [items, setItems] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await getMyPosts({
      pageNo: 0,
      pageSize: 50,
      sortBy: "createdAt",
      sortDir: "desc",
    });
    setItems(res.content ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
        await load();
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? e?.message ?? "Failed to load account";
        Alert.alert("Error", String(msg));
      } finally {
        setLoading(false);
      }
    })();
  }, [load, refreshMe]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refreshMe();
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  async function onDelete(postId: number) {
    Alert.alert("Delete post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            setItems((prev) => prev.filter((p) => p.id !== postId));
          } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "Failed to delete post";
            Alert.alert("Error", String(msg));
          }
        },
      },
    ]);
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
      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 3 }}>
            <H1>Account</H1>

            <Card>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
                {user?.name ?? "—"}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>
                {user?.username ? `@${user.username}` : ""}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>{user?.email ?? ""}</Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                <Button title="Create Post" variant="secondary" onPress={() => nav.navigate("EditPost")} />
                <Button title="Sign out" variant="danger" onPress={signOut} />
              </View>
            </Card>

            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <H1 style={{ fontSize: 20 }}>My Posts</H1>
              <Muted>{items.length} total</Muted>
            </View>

          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>{item.description}</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Button title="Open" onPress={() => nav.navigate("PostDetail", { postId: item.id })} />
              <Button title="Edit" variant="secondary" onPress={() => nav.navigate("EditPost", { post: item })} />
              <Button title="Delete" variant="danger" onPress={() => onDelete(item.id)} />
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}
