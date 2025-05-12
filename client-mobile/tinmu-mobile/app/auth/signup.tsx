import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useUserAuthTheme } from "../../contexts/AuthThemeContext";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { storage } from "@/utils/storage";

export default function Welcome() {
  const { colors, setThemeTempo } = useUserAuthTheme();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [gender, setGender] = useState("");
  const [lookingForGender, setLookingForGender] = useState("");
  const [relationType, setRelationType] = useState("");
  const [favoriteArtist, setFavoriteArtist] = useState("");

  const handleRegistration = async () => {
    try {
      const res = await fetch("http://10.0.0.220:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          favoriteGenre,
          gender,
          lookingForGender,
          relationType,
        }),
      });
      handleLogin();
    } catch (err: any) {
      Alert.alert("❌ Login Failed", err.message);
    }
  };

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
      await storage.setItem("token", data.token);

      // 🟢 FETCH USER AFTER LOGIN
      const userRes = await fetch("http://10.0.0.220:3000/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const userData = await userRes.json();

      if (!userRes.ok) throw new Error("Failed to fetch user");

      console.log("👤 Got user data:", userData);

      // 🔥 NOW you have userData → set theme
      setThemeTempo(userData.personalThemeTempo || "slow");
      await storage.setItem(
        "themeTempo",
        userData.personalThemeTempo || "slow"
      );

      // ✅ Now safe to navigate
      router.push("/profile");
    } catch (err: any) {
      Alert.alert("❌ Login Failed", err.message);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textColor }]}>
        🎵 Welcome to TINMU
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />
      <TextInput
        placeholder="name"
        value={name}
        onChangeText={setName}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />
      <TextInput
        placeholder="Favorite Genre"
        value={favoriteGenre}
        onChangeText={setFavoriteGenre}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />
      <TextInput
        placeholder="Favorite Artist"
        value={favoriteArtist}
        onChangeText={setFavoriteArtist}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />
      <RNPickerSelect
        onValueChange={setLookingForGender}
        value={lookingForGender}
        placeholder={{
          label: "What gender are you interested in ?",
          value: null,
        }}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "It", value: "it" },
        ]}
        style={{
          inputIOS: {
            color: colors.text,
            padding: 12,
          },
          inputAndroid: {
            color: colors.text,
            padding: 12,
          },
          placeholder: {
            color: "#999",
            backgroundColor: colors.inputButtonBackground,
          },
          viewContainer: {
            backgroundColor: colors.inputButtonBackground,
            height: 45,
            borderRadius: 6,
            marginBottom: 12,
            width: "35%", // ✅ match TextInput width
            alignSelf: "center", // ✅ center it
          },
        }}
      />

      <RNPickerSelect
        onValueChange={setGender}
        value={gender}
        placeholder={{ label: "Select Gender", value: null }}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "It", value: "it" },
        ]}
        style={{
          inputIOS: {
            color: colors.text,
            padding: 12,
          },
          inputAndroid: {
            color: colors.text,
            padding: 12,
          },
          placeholder: {
            color: "#999",
            backgroundColor: colors.inputButtonBackground,
          },
          viewContainer: {
            backgroundColor: colors.inputButtonBackground,
            height: 45,
            borderRadius: 6,
            marginBottom: 12,
            width: "35%", // ✅ match TextInput width
            alignSelf: "center", // ✅ center it
          },
        }}
      />

      <TextInput
        placeholder="What relation type are you looking for?"
        value={relationType}
        onChangeText={setRelationType}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.inputButtonBackground },
        ]}
      />

      <Button title="Sign Up" onPress={handleRegistration} color="#FF5C5C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    // borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    width: "35%",
    backgroundColor: "#f0f0f0",
  },
});
