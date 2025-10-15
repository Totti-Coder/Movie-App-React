import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "expo-router";
import { fetchPopularMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState()
  // Función requerida por la interfaz SearchBarProps
  const handleSearch = () => {
    // Aquí iría la lógica para activar la búsqueda
    console.log("Búsqueda activada por el botón.");
  };

  const {
    data: movies,
    loading,
    error
  } = useFetch(() =>
    fetchPopularMovies({
      query: "",
    })
  );

  // NOTA: El término de búsqueda debe ser una variable de estado, no una cadena fija.
  const searchTerm = "TERMINOS DE BUSQUEDA"; // DEBE SER REEMPLAZADO POR UN ESTADO

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.fondo} className="flex-1 absolute w-full z-0" />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar 
                placeholder="Busca la pelicula..." 
                onPress={handleSearch} 
              />
            </View>
            
            {loading && (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
                className="my-3"
              />
            )}
            
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {/* Muestra el texto de resultados solo si NO está cargando, NO hay error y HAY películas. */}
            {!loading && !error && searchTerm.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold px-5">
                Resultados para:{" "}
                <Text className="text-accent">{searchTerm}</Text>
              </Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default Search;