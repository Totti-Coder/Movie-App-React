import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { fetchPopularMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { updateSearchCount } from "@/services/appwrite";

const search = () => {
  const [searchQuery, setSearchQuery] = useState(""); //Lo que escribe cada usuario
  const [submittedQuery, setSubmittedQuery] = useState(""); // Lo que se muestra después de darle a enter
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSavedQuery, setLastSavedQuery] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch con debounce cuando searchQuery cambia
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchMovies = async () => {
        if (searchQuery.trim() === "") {
          if (isMounted.current) {
            setMovies([]);
          }
          return;
        }       
  
        if (isMounted.current) {
          setLoading(true);
        }
        
        try {
          const data = await fetchPopularMovies({ query: searchQuery });
          console.log("Películas recibidas:", data.length);
          
          if (isMounted.current) {
            setMovies(data);
            setError(null);
          }
        } catch (err) {
          console.error("Error al buscar películas:", err);
          if (isMounted.current) {
            setError(err as Error);
          }
        } finally {
          if (isMounted.current) {
            setLoading(false);
          }
        }
      };
      fetchMovies();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Guardar en Appwrite solo cuando se presiona Enter
  const handleSearch = async () => {
    const query = searchQuery.trim();
    
    // Actualizar el query que se muestra
    setSubmittedQuery(query);
    
    if (query !== "" && movies.length > 0 && movies[0] && query !== lastSavedQuery) {
      
      try {
        await updateSearchCount(query, movies[0]);
        if (isMounted.current) {
          setLastSavedQuery(query);
        }
      } catch (err) {
        console.error("Error al guardar en la base de datos:", err);
      }
    }
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
          {submittedQuery === "" ? (
            ""
          ) : (
            <>
              Resultados para:{" "}
              <Text className="text-accent">{submittedQuery.toUpperCase()}</Text>
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
            <Text className="text-accent font-semibold">"{submittedQuery}"</Text>
          </Text>
          <Text className="text-light-200 text-center text-sm mt-4">
            Intenta con otro nombre
          </Text>
        </View>
      ) : searchQuery === "" ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-light-100 text-center text-lg mb-32">
            Escribe en la barra de búsqueda para encontrar películas o series
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          className="px-5"
          numColumns={3}
          key="movie-grid-3"
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 16,
            marginVertical: 16,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={9}
          windowSize={5}
        />
      )}
    </View>
  );
};

export default search;