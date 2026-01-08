export type JWTAuthResponse = {
  accessToken: string;
  tokenType?: string; // "Bearer"

  // included by backend on /api/auth/login
  userId: number;
  username: string;
  name: string;
  email: string;
};

export type LoginDto = {
  usernameOrEmail: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type UserDto = {
  id: number;
  username: string;
  name: string;
  email: string;
};

export type CommentDto = {
  id?: number;
  body: string;

  createdAt?: string;
  updatedAt?: string;

  authorId?: number;
  authorUsername?: string;
  authorName?: string;
};

export type PostDto = {
  id: number;
  title: string;
  description: string;
  content: string;

  createdAt?: string;
  updatedAt?: string;

  authorId?: number;
  authorUsername?: string;
  authorName?: string;

  categoryId?: number | null;
  comments?: CommentDto[];
};

export type PostResponse = {
  content: PostDto[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type CategoryDto = {
  id: number;
  name: string;
  description?: string;
};
