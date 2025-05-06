import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserAuthTheme } from "../contexts/AuthThemeContext";


export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useUserAuthTheme();

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      try {
        const res = await fetch("http://10.0.0.220:3000/users/me", {
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

  const fields = [
{label: "Email", value: user.email },
{label: "Genre", value: user.favoriteGenre },
{label: "Artist", value: user.favoriteArtist || "Not set"},
{label: "Anthem", value: user.personalAnthem || "Not set" },
{label: "What gender I'm attracted to", value: user.lookingForGenre || "Not set" },
{label: "Relation Type", value: user.relationType || "Not set" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, {color:colors.text}]}>👋 Welcome, {user.name}!</Text>
      {fields.map((field, index) => (
        <Text key={index} style={[styles.text, { color: colors.text }]}>
          {field.label}: {field.value}
        </Text>
      ))}
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
    backgroundColor: "#cbe7aa", // default background color
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  text:{
    fontSize:18,
    marginBottom:10
  },
  background: {
    backgroundColor: "#f5s50", // default background color
  },
});
