import { Stack } from "expo-router";
import "./global.css"
import SafeScreen from "./components/SafeScreen"
export default function RootLayout() {
  return (
    <SafeScreen>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>

    </SafeScreen>
  );
}
