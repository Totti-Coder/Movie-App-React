import { View, TextInput, Image } from "react-native"; 
import React from "react";
import { icons } from "@/constants/icons";


interface Props {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
  onFocus?: () => void
}

const SearchBar = ({ placeholder, value, onChangeText, onSubmitEditing, onFocus }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-100 rounded-full px-5 py-4">
      <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="ab8bff"/>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#a8b5db"
        returnKeyType="search" 
      />
    </View>
  );
};

export default SearchBar;