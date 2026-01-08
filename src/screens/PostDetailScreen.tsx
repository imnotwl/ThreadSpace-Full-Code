import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import {
  addComment,
  deleteComment,
  deletePost,
  getComments,
  getPostById,
} from "../api/endpoints";
import type { CommentDto, PostDto } from "../types";
import { useAuth } from "../auth/AuthContext";
import { Button, Card, Field, H1, Loading, Muted, Screen } from "../ui/components";
import { colors } from "../ui/theme";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetail">;

export default function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { user } = useAuth();

  const [post, setPost] = useState<PostDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const isOwner = useMemo(() => {
    if (!user || !post) return false;
    return post.authorUsername === user.username;
  }, [user, post]);

  async function load() {
    setBusy(true);
    try {
      const [p, c] = await Promise.all([getPostById(postId), getComments(postId)]);
      setPost(p);
      setComments(c);
      navigation.setOptions({ title: p.title });
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to load post";
      Alert.alert("Error", String(msg));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function onAddComment() {
    if (!body.trim()) {
      Alert.alert("Comment required", "Write something first.");
      return;
    }
    setBusy(true);
    try {
      const created = await addComment(postId, { body: body.trim() });
      setComments((prev) => [created, ...prev]);
      setBody("");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to add comment";
      Alert.alert("Error", String(msg));
    } finally {
      setBusy(false);
    }
  }

  async function onDeletePost() {
    Alert.alert("Delete post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            navigation.goBack();
          } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "Failed to delete post";
            Alert.alert("Error", String(msg));
          }
        },
      },
    ]);
  }

  async function onDeleteComment(commentId?: number) {
    if (!commentId) return;
    Alert.alert("Delete comment?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComment(postId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
          } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "Failed to delete comment";
            Alert.alert("Error", String(msg));
          }
        },
      },
    ]);
  }

  if (busy && !post) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  const header = (
    <View style={{ marginTop: 6 }}>
      {post ? (
        <Card>
          <H1>{post.title}</H1>
          <Muted style={{ marginTop: 4 }}>{post.description}</Muted>

          <View style={{ marginTop: 12 }}>
            <Text style={{ color: colors.text, lineHeight: 20 }}>{post.content}</Text>
          </View>

          <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {post.authorUsername ? `@${post.authorUsername}` : "—"}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </Text>
          </View>

          {isOwner ? (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <Button title="Edit" variant="secondary" onPress={() => navigation.navigate("EditPost", { post })} />
              <Button title="Delete" variant="danger" onPress={onDeletePost} />
            </View>
          ) : null}
        </Card>
      ) : null}

      <View style={{ marginTop: 12, marginBottom: 12 }}>
        <Card>
          <Muted>Add a comment</Muted>
          <Field
            label="Comment"
            value={body}
            onChangeText={setBody}
            multiline
            inputStyle={{ minHeight: 90 }}
          />
          <Button
            title={busy ? "Please wait..." : "Post Comment"}
            onPress={onAddComment}
            disabled={busy}
            style={{ marginTop: 16 }}
          />
        </Card>
      </View>


      <View
        style={{
          marginTop: 2,
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <H1 style={{ fontSize: 20 }}>Comments</H1>
        <Muted style={{ fontSize: 14 }}>{comments.length} total</Muted>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <Screen scroll={false} safeTop={false}>
        <FlatList
          data={comments}
          keyExtractor={(c) => String(c.id)}
          ListHeaderComponent={header}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 24,
            gap: 10,
          }}
          ListEmptyComponent={
            <Card>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
                No comments yet
              </Text>
              <Muted style={{ marginTop: 6 }}>
                Be the first to comment on this post.
              </Muted>
            </Card>
          }
          renderItem={({ item }) => {
            const canDelete = user && item.authorUsername === user.username;
            return (
              <Card>
                <Text style={{ color: colors.text, lineHeight: 20 }}>{item.body}</Text>

                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {item.authorUsername ? `@${item.authorUsername}` : "—"}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </Text>
                </View>

                {canDelete ? (
                  <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "flex-end" }}>
                    <Button title="Delete" variant="danger" onPress={() => onDeleteComment(item.id)} />
                  </View>
                ) : null}
              </Card>
            );
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
