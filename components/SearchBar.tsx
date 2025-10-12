import { View, TextInput, TouchableOpacity } from "react-native"; // ¡Añade TouchableOpacity!
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

// DEFINICIÓN DE LA INTERFAZ DE PROPS
interface SearchBarProps {
  onPress: () => void;
  placeholder: string;
}

// Aplico la interfaz al componente
const SearchBar: React.FC<SearchBarProps> = ({ onPress, placeholder }) => {
  const iconColor = "#ab8bff";
  const placeholderColor = "#a8b5db";

  return (
    // Utilizo el prop onPress con TouchableOpacity
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 space-x-4">
        <AntDesign name="search" size={20} color={iconColor} />

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          className="flex-1 ml-2 text-white font-pregular text-base"
          editable={false}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;



