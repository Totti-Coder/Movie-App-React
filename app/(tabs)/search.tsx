import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "expo-router";
import { fetchPopularMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";

const search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch solo cuando cambia searchQuery después de presionar Enter
  useEffect(() => {
    const fetchMovies = async () => {
      if (searchQuery === "") {
        // Si no hay búsqueda, mostrar populares
        setLoading(true);
        try {
          const data = await fetchPopularMovies({ query: "" });
          setMovies(data);
          setError(null);
        } catch (err) {
          setError(error);
        } finally {
          setLoading(false);
        }
        return;
      }
      // Búsqueda con query
      setLoading(true);
      try {
        const data = await fetchPopularMovies({ query: searchQuery });
        setMovies(data);
        setError(null);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]); // Solo se ejecuta cuando searchQuery cambia

  const handleSearch = () => {
    // Esto dispara el useEffect
    setSearchQuery(searchQuery);
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.fondo}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <Image source={icons.logo} className="w-10 h-10 mt-10 mb-5 mx-auto" />

      <View className="px-5 pt-12 pb-4 mb-5">
        <SearchBar
          placeholder="Buscar películas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Título dinámico */}
      <View className="px-5 mb-3">
        <Text className="text-lg text-white font-bold">
          {searchQuery === "" ? (
            "Resultados para:"
          ) : (
            <>
              Resultados para:{" "}
              <Text className="text-[#ab8bff]">{searchQuery.toUpperCase()}</Text>
            </>
          )}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ab8bff" className="flex-1" />
      ) : error ? (
        <Text className="text-white text-center mt-5 px-5">
          Error: {error?.message}
        </Text>
      ) : (
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
        />
      )}
    </View>
  );
};

export default search;
