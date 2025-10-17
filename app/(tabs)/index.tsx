import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import useFetch from "@/services/useFetch";
import { fetchPopularMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { getTrendingMovies } from "@/services/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchPopularMovies({
      query: "",
    })
  );

  const handleSearchFocus = () => {
    router.push("/search");
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.fondo} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-10 h-10 mt-10 mb-5 mx-auto" />
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text className="text-white">
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5 ">
            <SearchBar
              placeholder="Buscar películas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
            />

            <>
              {trendingMovies && (
                <SafeAreaView className="mt-6">
                  <Text className="text-lg text-white font-bold ">
                    Peliculas mas vistas
                  </Text>
                </SafeAreaView>
              )}

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return <View className="w-4" />;
                }}
                className="mb-4 mt-2"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  < TrendingCard movie={item} index={index}/>
                )}
                keyExtractor={(item) => item.movie_id.toString()}
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Ultimas Peliculas
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "center",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
