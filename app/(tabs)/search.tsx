import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "expo-router";
import { fetchPopularMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch solo cuando hay texto en searchQuery
  useEffect(() => {
    const fetchMovies = async () => {
      // Si no hay búsqueda, no hacer nada
      if (searchQuery === "") {
        setMovies([]);
        return;
      }
      
      // Búsqueda con query
      setLoading(true);
      try {
        const data = await fetchPopularMovies({ query: searchQuery });
        setMovies(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
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
            ""
          ) : (
            <>
              Resultados para:{" "}
              <Text className="text-accent">{searchQuery.toUpperCase()}</Text>
            </>
          )}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ab8bff" className="flex-1" />

      ) : error ? (
        <Text className="text-red-500 text-center px-5 my-3">
          Error: {error?.message}
        </Text>


      ) : searchQuery !== "" && movies.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8 mb-32">
          <Image
            source={images.cruz}
            className="mb-6"
            resizeMode="contain"
          />
          <Text className="text-white text-center text-2xl font-bold mb-3">
            Sin resultados
          </Text>
          <Text className="text-light-100 text-center text-base leading-6">
            No encontramos películas o series con{"\n"}
            <Text className="text-accent font-semibold">"{searchQuery}"</Text>
          </Text>
          <Text className="text-light-200 text-center text-sm mt-4">
            Intenta con otro nombre
          </Text>
        </View>

      ) : searchQuery === "" ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-light-100 text-center text-lg mb-32">
            Escribe en la barra de busqueda para encontrar películas o series
          </Text>
        </View>
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