import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const storage = {
  async getItem(key: string) {
    if (Platform.OS === "web") {
      return AsyncStorage.getItem(key);
    } else {
      return SecureStore.getItemAsync(key);
    }
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      return AsyncStorage.setItem(key, value);
    } else {
      return SecureStore.setItemAsync(key, value);
    }
  },
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      return AsyncStorage.removeItem(key);
    } else {
      return SecureStore.deleteItemAsync(key);
    }
  },
};
