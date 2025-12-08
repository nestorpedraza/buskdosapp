import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="likes" />
      <Stack.Screen name="map" />
      <Stack.Screen name="nav" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="desingresponsive" />
    </Stack>
  );
}
