import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const ICON_SIZE = 20; 

function Layout() {
  return (
    
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#333333',  
        },
        tabBarActiveTintColor: '#FFFFFF', 
        tabBarInactiveTintColor: '#888888', 
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Inicio", 
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar", 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search" color={color} size={ICON_SIZE } /> 
          ),
        }}
      />

      
      <Tabs.Screen
        name="saved"
        options={{
          title: "Guardados", 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="save" color={color} size={ICON_SIZE} /> 
          ),
        }}
      />
      

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={ICON_SIZE} /> 
          ),
        }}
      />
    </Tabs>
  );
}

export default Layout;