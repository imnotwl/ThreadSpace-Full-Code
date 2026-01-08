import { api } from "./client";
import type {
  JWTAuthResponse,
  LoginDto,
  RegisterDto,
  UserDto,
  PostDto,
  PostResponse,
  CommentDto,
  CategoryDto,
} from "../types";

// Auth
export async function login(payload: LoginDto): Promise<JWTAuthResponse> {
  const res = await api.post<JWTAuthResponse>("/api/auth/login", payload);
  return res.data;
}

export async function register(payload: RegisterDto): Promise<string> {
  const res = await api.post<string>("/api/auth/register", payload);
  return res.data;
}

// User
export async function getMe(): Promise<UserDto> {
  const res = await api.get<UserDto>("/api/users/me");
  return res.data;
}

export async function getMyPosts(params?: {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<PostResponse> {
  const res = await api.get<PostResponse>("/api/users/me/posts", { params });
  return res.data;
}

// Posts
export async function getPosts(params?: {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<PostResponse> {
  const res = await api.get<PostResponse>("/api/posts", { params });
  return res.data;
}

export async function getPostsByCategory(categoryId: number): Promise<PostDto[]> {
  const res = await api.get<PostDto[]>(`/api/posts/category/${categoryId}`);
  return res.data;
}

export async function getPostById(id: number): Promise<PostDto> {
  const res = await api.get<PostDto>(`/api/posts/${id}`);
  return res.data;
}

export async function createPost(payload: {
  title: string;
  description: string;
  content: string;
  categoryId?: number | null;
}): Promise<PostDto> {
  const res = await api.post<PostDto>("/api/posts", payload);
  return res.data;
}

export async function updatePost(
  id: number,
  payload: {
    title: string;
    description: string;
    content: string;
    categoryId?: number | null;
  }
): Promise<PostDto> {
  const res = await api.put<PostDto>(`/api/posts/${id}`, payload);
  return res.data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/api/posts/${id}`);
}

// Categories
export async function getCategories(): Promise<CategoryDto[]> {
  const res = await api.get<CategoryDto[]>("/api/v1/categories");
  return res.data;
}

// Comments
export async function getComments(postId: number): Promise<CommentDto[]> {
  const res = await api.get<CommentDto[]>(`/api/posts/${postId}/comments`);
  return res.data;
}

export async function addComment(
  postId: number,
  payload: { body: string }
): Promise<CommentDto> {
  const res = await api.post<CommentDto>(`/api/posts/${postId}/comments`, payload);
  return res.data;
}

export async function updateComment(
  postId: number,
  commentId: number,
  payload: { body: string }
): Promise<CommentDto> {
  const res = await api.put<CommentDto>(
    `/api/posts/${postId}/comments/${commentId}`,
    payload
  );
  return res.data;
}

export async function deleteComment(
  postId: number,
  commentId: number
): Promise<void> {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`);
}
