import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      try {
        const res = await fetch("http://172.26.64.1:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) setUser(data);
        else console.warn("Failed to fetch user:", data);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!user) return <Text>Failed to load user 😢</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome, {user.name}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>Genre: {user.favoriteGenre}</Text>
      <Text>Artist: {user.favoriteArtist || "N/A"}</Text>
      <Text>Anthem: {user.personalAnthem || "🎵 Not set"}</Text>

      <Button title="Logout" onPress={handleLogout} color="#FF5C5C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
});
