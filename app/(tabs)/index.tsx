import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchPopularMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";


export default function Index() {
  const router = useRouter(); // hook que permite que nos podamos mover entre diferentes paginas o pantallas

  const { data: movies,
    loading: moviesLoading,
    error: moviesError } = useFetch(() => fetchPopularMovies({
      query: "" // Si la query esta vacia nos devuelve las peliculas mas populares
    }))


  return (
    <View className="flex-1 bg-primary">
      <Image source={images.fondo} className="absolute w-full z-0"/>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-10 h-10 mt-10 mb-5 mx-auto" />
        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError ? (
          <Text>Error: {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Busca una pelicula"
            />

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">Ultimas Peliculas</Text>
              
              <FlatList
              // Pasamos el array de movies como data a la Flatlist
                data={movies}
                // Como va a renderizar cada pelicula
                renderItem={({ item }) => (
                  <MovieCard
                  {...item}
                  />
                )}
                // Ayuda a react native a saber cuantos elementos son y donde estan posicionados
                keyExtractor={(item) => item.id.toString()}
                // Se ven en tres diferentes columnas
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10
                }}
                className="mt-2 pb-32"
                scrollEnabled= {false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
