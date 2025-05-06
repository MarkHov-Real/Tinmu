// app/index.tsx
import { View, Text, Button, StyleSheet, } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useUserAuthTheme } from "../contexts/AuthThemeContext";


export default function Welcome() {
  const {colors } = useUserAuthTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        🎵 Welcome to TINMU
      </Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        Your music soulmate awaits.
      </Text>

      <Link href="/login" asChild>
        <Button title="Log In" />
      </Link>

      <Link href="/signup" asChild>
        <Button title="Sign Up" />
      </Link>
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
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});
