import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
    <StatusBar hidden={true} translucent={true}/>
    
      <Stack screenOptions={{ headerShown: false }}> 
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  )
}