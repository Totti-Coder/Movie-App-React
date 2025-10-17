import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableNativeFeedbackComponent,
  TouchableOpacity,
} from "react-native"; // <-- ¡Añade Image aquí!
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <SafeAreaView className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </SafeAreaView>
);
const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <SafeAreaView>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </SafeAreaView>
        <SafeAreaView className="flex-col items-start justify-center px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size 4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votos)
            </Text>
          </View>
          <MovieInfo label="Resumen" value={movie?.overview} />
          <MovieInfo
            label="Generos"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />
          <SafeAreaView className="flex flex-row justify-between gap-x-8">
            <MovieInfo
              label="Coste"
              value={`$${(movie?.budget ?? 0) / 1_000_000} millones`}
            />
            <MovieInfo
              label="Ganancias"
              value={`$${((movie?.revenue ?? 0) / 1_000_000).toFixed(2)} millones`}
            />
          </SafeAreaView>

          <MovieInfo
            label="Empresas de produccion"
            value={
              movie?.production_companies?.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </SafeAreaView>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 margin-x-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MovieDetails;
