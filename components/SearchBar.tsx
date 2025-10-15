import { View, TextInput, Image } from "react-native"; // ¡Añade TouchableOpacity!
import React from "react";
import { icons } from "@/constants/icons";

// DEFINICIÓN DE LA INTERFAZ DE PROPS
interface Props {
  onPress?: () => void;
  placeholder: string;
  
}

// Aplico la interfaz al componente
const SearchBar = ({ onPress, placeholder }: Props) => {
  return (
    // Utilizo el prop onPress con TouchableOpacity
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
        <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="ab8bff"/>
        <TextInput
        onPress={onPress}
          placeholder={placeholder}
          value=""
          className="flex-1 ml-2 text-white"
          onChangeText={() => {}}
          placeholderTextColor="#a8b5db"
        />
      </View>
  );
};

export default SearchBar;



