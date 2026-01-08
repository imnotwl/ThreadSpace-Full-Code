import React, { useState } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Button, Card, Field, H1, Muted, Screen } from "../ui/components";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onLogin() {
    if (!usernameOrEmail || !password) {
      Alert.alert(
        "Missing info",
        "Please enter your username/email and password."
      );
      return;
    }
    setBusy(true);
    try {
      await signIn({ usernameOrEmail, password });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Login failed";
      Alert.alert("Login failed", String(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ marginTop: 24 }}>
        <H1>Welcome back</H1>
        <Muted style={{ marginTop: 4 }}>
          Sign in to manage your blog and join discussions.
        </Muted>
      </View>

      <Card style={{ marginTop: 16 }}>
        <Field
          label="Username or Email"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
          placeholder="e.g. bryanwei or bryan@example.com"
          autoCapitalize="none"
        />

        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Button
          title={busy ? "Signing in…" : "Sign In"}
          onPress={onLogin}
          disabled={busy}
          style={{ marginTop: 16 }}
        />

        <Button
          title="Create an account"
          variant="ghost"
          onPress={() => navigation.navigate("Register")}
          disabled={busy}
          style={{ marginTop: 16 }}
        />
      </Card>
    </Screen>
  );
}
