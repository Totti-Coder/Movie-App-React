import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import md5 from 'md5'; 
import { images } from "@/constants/images"; 
import { icons } from "@/constants/icons"; 
import LoginForm from "@/components/auth/LoginForm"; 
import RegisterForm from "@/components/auth/RegisterForm"; 
import {
  getCurrentUser,
  login,
  register,
  logout,
  User, 
  LoginCredentials,
  RegisterCredentials,
} from "@/services/auth";

// Tipos para el estado de la interfaz de usuario
type AuthState = "login" | "register" | "profile";

// Función para generar la URL de Gravatar
const getGravatarUrl = (email: string | undefined): string => {
  if (!email) {
    // Avatar por defecto de Gravatar si no hay email 
    return 'https://www.gravatar.com/avatar/?d=mp'; 
  }
  // Hashear el email en minúsculas
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=96`;
};


const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>("profile"); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verificar el estado de la sesión al cargar la pantalla
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const currentUser = await getCurrentUser(); 
      
      if (currentUser) {
        setUser(currentUser);
        setAuthState("profile");
      } else {
        setUser(null);
        setAuthState("login"); // Si no hay usuario, mostrar el login
      }
    } catch (error) {
      console.error("Error al verificar estado de autenticación:", error);
      setUser(null);
      setAuthState("login");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el inicio de sesión
  const handleLogin = async (credentials: LoginCredentials) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const loggedInUser = await login(credentials);
      setUser(loggedInUser);
      setAuthState("profile");
    } catch (error: any) {
      setAuthError(error.message || "Error al iniciar sesión. Verifica tu email y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el registro
  const handleRegister = async (credentials: RegisterCredentials) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const registeredUser = await register(credentials);
      setUser(registeredUser);
      setAuthState("profile");
    } catch (error: any) {
      setAuthError(error.message || "Error al registrarse. Intenta con otro email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setAuthState("login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // Muestra un indicador de carga mientras se verifica la sesión
  if (isLoading && authState === "profile") {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ab8bff" />
      </View>
    );
  }

  // Vista de Perfil Logueado
  const renderProfileView = () => (
    <View className="flex-1 items-center px-5 pt-12 pb-6">
      <Image
        source={{ uri: getGravatarUrl(user?.email) }} 
        className="w-24 h-24 rounded-full mb-6"
        resizeMode="cover"
      />
      
      <Text className="text-3xl text-white font-bold mb-2">
        ¡Hola, {user?.name || "Usuario"}!
      </Text>
      <Text className="text-light-100 text-center text-base mb-8">
        {user?.email}
      </Text>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-lg w-full max-w-xs mt-4"
        disabled={isLoading}
      >
        <Text className="text-white font-semibold text-center">
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Vistas de Autenticación (Login/Register)
  const renderAuthView = () => (
    <View className="flex-1 px-5 pt-12 pb-6 justify-center">
      <Image source={icons.logo} className="w-16 h-16 mb-8 mx-auto" />
      
      {authError && (
        <Text className="text-red-500 text-center mb-4">
          {authError}
        </Text>
      )}
      
      {isLoading && (
        <ActivityIndicator size="small" color="#ab8bff" className="mb-4" />
      )}

      {authState === "login" ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitch={() => setAuthState("register")}
          isLoading={isLoading}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onSwitch={() => setAuthState("login")}
          isLoading={isLoading}
        />
      )}
    </View>
  );

  // Vista Principal
  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.fondo} // Fondo
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {user && authState === "profile" ? renderProfileView() : renderAuthView()}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;