import React, { useState } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Button, Card, Field, H1, Muted, Screen } from "../ui/components";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onRegister() {
    if (!name || !username || !email || !password) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    setBusy(true);
    try {
      await signUp({ name, username, email, password });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Registration failed";
      Alert.alert("Registration failed", String(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ marginTop: 24 }}>
        <H1>Create account</H1>
        <Muted style={{ marginTop: 4 }}>
          Join and start interacting with posts.
        </Muted>
      </View>

      <Card style={{ marginTop: 16 }}>
        <Field
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
        />
        <Field
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Pick a username"
          autoCapitalize="none"
        />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Button
          title={busy ? "Creating…" : "Sign Up"}
          onPress={onRegister}
          disabled={busy}
          style={{ marginTop: 16 }}
        />

        <Button
          title="Back to login"
          variant="ghost"
          onPress={() => navigation.navigate("Login")}
          disabled={busy}
          style={{ marginTop: 16 }}
        />
      </Card>
    </Screen>
  );
}
