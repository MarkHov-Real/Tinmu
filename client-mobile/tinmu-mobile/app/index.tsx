// app/index.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Welcome to TINMU</Text>
      <Text style={styles.subtitle}>Your music soulmate awaits.</Text>

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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
});
