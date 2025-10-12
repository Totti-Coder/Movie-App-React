import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter() // hook que permite que nos podamos mover entre diferentes paginas o pantallas
  return (
    <View className="flex-1 bg-primary">

      <ScrollView className="flex-1 px-5"
      showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"/>


        <View className="flex-1 mt-5">
          <SearchBar
  onPress={()=> router.push("/search")}
  placeholder="Busca una pelicula"
/>
        </View>

      </ScrollView>

    </View>
  );
}
