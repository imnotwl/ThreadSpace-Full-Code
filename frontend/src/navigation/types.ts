import type { PostDto } from "../types";

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  PostDetail: { postId: number };
  EditPost: { post?: PostDto } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabsParamList = {
  Feed: undefined;
  Account: undefined;
};
