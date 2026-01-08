import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen, Card, Field, Button, H1, Muted } from "../ui/components";
import { createPost, getCategories, updatePost } from "../api/endpoints";
import type { CategoryDto } from "../types";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../ui/theme";
import CategoryPickerModal from "../ui/CategoryPickerModal";

type Props = NativeStackScreenProps<RootStackParamList, "EditPost">;

export default function EditPostScreen({ route, navigation }: Props) {
  const post = route.params?.post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(
    post?.categoryId ?? null
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId]
  );

  function pickDefaultCategoryId(cats: CategoryDto[]): number | null {
    const general = cats.find((c) => c.name?.toLowerCase() === "general");
    return (general ?? cats[0])?.id ?? null;
  }

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (categoryId == null) setCategoryId(pickDefaultCategoryId(cats));
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load categories.");
      }
    })();
  }, []);

  async function onSave() {
    if (!title.trim())
      return Alert.alert("Missing title", "Please add a title.");
    if (!content.trim())
      return Alert.alert("Missing content", "Please add some content.");
    if (categoryId == null)
      return Alert.alert("Missing category", "Please choose a category.");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        categoryId,
      };

      if (post) {
        await updatePost(post.id, payload as any);
        Alert.alert("Saved", "Post updated.");
      } else {
        await createPost(payload as any);
        Alert.alert("Posted", "Your post is live.");
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.message ?? e?.message ?? "Failed to save post."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <CategoryPickerModal
        visible={pickerOpen}
        categories={categories}
        selectedId={categoryId}
        title="Choose a category for this post"
        onClose={() => setPickerOpen(false)}
        onSelect={(c) => {
          setPickerOpen(false);
          setCategoryId(c.id);
        }}
      />

      <Screen safeTop={false}>
        <H1>{post ? "Edit Post" : "Create Post"}</H1>
        <Card style={{ marginTop: 16 }}>
          <View style={{ marginBottom: 3 }}>
            <Text
              style={{
                color: colors.muted,
                fontWeight: "400",
                marginBottom: 6,
              }}
            >
              Category
            </Text>

            <Pressable
              onPress={() => setPickerOpen(true)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                {selectedCategory
                  ? selectedCategory.name
                  : "Choose a category"}
              </Text>

              {selectedCategory?.description ? (
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  {selectedCategory.description}
                </Text>
              ) : null}
            </Pressable>
          </View>

          <Field label="Title" value={title} onChangeText={setTitle} />
          <Field
            label="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Field
            label="Content"
            value={content}
            onChangeText={setContent}
            multiline
            style={{ minHeight: 140 }}
          />

          <Button
            title={saving ? "Saving..." : "Save Post"}
            onPress={onSave}
            disabled={saving}
            style={{ marginTop: 16 }}
          />
        </Card>
      </Screen>
    </>
  );
}
