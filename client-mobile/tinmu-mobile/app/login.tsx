// app/login.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserAuthTheme } from "../contexts/AuthThemeContext";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [user, setUser] = useState(null);
const { colors, setThemeTempo } = useUserAuthTheme();



const handleLogin = async () => {
  try {
    const res = await fetch("http://10.0.0.220:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    console.log("✅ Logged in:", data.token);
    await AsyncStorage.setItem("token", data.token);

    // 🟢 FETCH USER AFTER LOGIN
    const userRes = await fetch("http://10.0.0.220:3000/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok) throw new Error("Failed to fetch user");

    console.log("👤 Got user data:", userData);

    // 🔥 NOW you have userData → set theme
    setThemeTempo(userData.personalThemeTempo || "slow");
    await AsyncStorage.setItem("themeTempo", userData.personalThemeTempo || "slow");

    // ✅ Now safe to navigate
    router.push("/home");
  } catch (err: any) {
    Alert.alert("❌ Login Failed", err.message);
  }
};


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Log In</Text>

      <Text style={[styles.userInfo, { color: colors.text }]}>User : frontend1@test.com</Text>
      <Text style={[styles.userInfo, { color: colors.text }]}>Password : test1234</Text>
      <Text style={[styles.userInfo, { color: colors.text }]}>User : frontend2@test.com</Text>
      <Text style={[styles.userInfo, { color: colors.text }]}>Password : test5678</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[styles.input, { color: colors.text, backgroundColor: colors.backgroundColorInput }]}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { color: colors.text, backgroundColor: colors.backgroundColorInput }]}

      />

      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userInfo: {fontSize: 16, margin: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
});
