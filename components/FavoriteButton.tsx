import {
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "@/constants/icons"
import {
  isMovieSaved as checkAppwriteSaved,
  removeFromFavorites,
  saveMovieToUser,
} from "@/services/favorites";
import { getUserId } from "@/services/auth"; 
interface FavoriteButtonProps {
  movie: Movie;
  size?: number;
  onToggle?: (isSaved: boolean) => void;
}
const FavoriteButton = ({
  movie,
  size = 24,
  onToggle,
}: FavoriteButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener el ID del usuario al montar el componente
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Verificar el estado de guardado CADA VEZ que la película o el userId cambien
  useEffect(() => {
    if (userId !== null || userId === null) {
      checkIfSaved();
    }
  }, [movie.id, userId]); 

  const checkIfSaved = async () => {

    try {
    
      const saved = await checkAppwriteSaved(movie.id, userId);
      setIsSaved(saved);
    } catch (error) {
      console.error("Error al verificar película guardada en Appwrite:", error);
      setIsSaved(false); // Asumimos que no está guardada si hay un error
    }
  };
    //Manejo si el usuario no se ha loggeado
  const handleToggle = async () => {
    if (!userId) {
      Alert.alert(
        "Acceso denegado",
        "Debes iniciar sesión para guardar películas favoritas."
      );
      return;
    }

    try {
      setLoading(true);
      let newSavedState: boolean;

      if (isSaved) {
        // Lógica para ELIMINAR de Appwrite
        await removeFromFavorites(movie.id, userId);
        newSavedState = false;
      } else {
        // Lógica para GUARDAR en Appwrite
        await saveMovieToUser(movie, userId);
        newSavedState = true;
      }

      setIsSaved(newSavedState);
      onToggle?.(newSavedState);

      Alert.alert(
        newSavedState ? "✅ Guardada" : "🗑️ Eliminada",
        newSavedState
          ? `"${movie.title}" se agregó a tus favoritos`
          : `"${movie.title}" se eliminó de tus favoritos`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      console.error("Error al cambiar estado de favorito:", error);
      // Muestra el mensaje de error de Appwrite (ej: "Esta película ya está en tus favoritos")
      Alert.alert("Error", error.message || "No se pudo guardar la película");
    } finally {
      setLoading(false);
    }
  }; // Si estamos cargando el estado inicial o realizando la acción

  if (loading || userId === undefined) {
    return (
      <View className="bg-accent/20 rounded-full p-2">
        <ActivityIndicator size="small" color="#ab8bff" />     {" "}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleToggle}
      className={`rounded-full p-2 ${isSaved ? "bg-accent" : "bg-white/10"}`}
      activeOpacity={0.7}
    >
      {" "}
      <Image
        source={icons.save}
        style={{ width: size, height: size }} 
        tintColor={isSaved ? "#ffffff" : "#ab8bff"}
      />
      {" "}
    </TouchableOpacity>
  );
};

export default FavoriteButton;
