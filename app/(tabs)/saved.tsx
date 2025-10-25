import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import MovieCard from "@/components/MovieCard";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, removeFromFavorites } from "@/services/favorites";
import { getUserId } from "@/services/auth";

const saved = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Obtener el ID del usuario al montar el componente
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      // Esto actualizará el estado a string (logueado) o null (anónimo)
      setCurrentUserId(id);
    };
    fetchUserId();
  }, []);

  // Cargar películas guardadas cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadSavedMovies(currentUserId);
    }, [currentUserId]) // Dependencia clave: carga al cambiar el estado de login
  );

  // Función de carga modificada para usar Appwrite y el userId
  const loadSavedMovies = async (userId: string | null) => {
    // Si no hay userId (usuario anónimo), no se hace la llamada a Appwrite.
    if (!userId) {
      setLoading(false);
      setSavedMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Llama a la nueva función de Appwrite, que filtra por userId
      const movies = await getFavorites(userId);

      setSavedMovies(movies);
    } catch (err) {
      // Este catch atrapará errores de conexión, pero no errores de permisos si se hizo el chequeo arriba
      console.error("Error al cargar películas guardadas de Appwrite:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Función de eliminación modificada
  const handleRemoveMovie = async (movieId: number) => {
    if (!currentUserId) {
      // Este error nunca debería ocurrir si se usa el botón de eliminar solo cuando está logueado
      console.error("No se puede eliminar: Usuario no logueado.");
      return;
    }

    try {
      await removeFromFavorites(movieId, currentUserId);

      // Actualizar la lista localmente
      setSavedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error("Error al eliminar película de Appwrite:", err);
    }
  };

  const isUserLoggedIn = !!currentUserId;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.fondo}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Header */}
      <View className="px-5 pt-12 pb-6">
        <View className="flex-row items-center justify-center mb-4">
          <Image source={icons.logo} className="w-10 h-10" />
        </View>

        <Text className="text-3xl text-white font-bold text-center">
          Mis Películas
        </Text>
        <Text className="text-light-100 text-center text-sm mt-2">
          {isUserLoggedIn
            ? `${savedMovies.length} ${savedMovies.length === 1 ? "película guardada" : "películas guardadas"}`
            : "Inicia sesión para ver tus favoritos"}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ab8bff" className="flex-1" />
      ) : error ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-red-500 text-center text-lg mb-4">
            Error al cargar películas
          </Text>
          <TouchableOpacity
            onPress={() => loadSavedMovies(currentUserId)}
            className="bg-accent px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : savedMovies.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8 mb-32">
          {isUserLoggedIn ? (
            // Mensaje si está logueado pero la lista está vacía
            <>
              <Text className="text-white text-center text-2xl font-bold mb-3">
                No hay películas guardadas
              </Text>
              <Text className="text-light-100 text-center text-base leading-6">
                Las películas que marques como favoritas{"\n"}
                aparecerán aquí
              </Text>
            </>
          ) : (
            // Mensaje si NO está logueado
            <>
              <Text className="text-white text-center text-2xl font-bold mb-3">
                Inicia Sesión
              </Text>
              <Text className="text-light-100 text-center text-base leading-6">
                Para acceder a tus películas favoritas{"\n"}
                debes iniciar sesión o registrarte.
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => (
            <MovieCard
              {...item}
              onLongPress={() => handleRemoveMovie(item.id)}
              showDeleteButton={true}
              onDelete={() => handleRemoveMovie(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          className="px-5"
          numColumns={3}
          key="saved-movies-grid-3"
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 16,
            marginVertical: 16,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={9}
          windowSize={5}
          refreshing={loading}
          onRefresh={() => loadSavedMovies(currentUserId)}
        />
      )}
    </View>
  );
};

export default saved;
