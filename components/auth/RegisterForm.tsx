import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { RegisterCredentials } from "@/services/auth"; 

interface RegisterFormProps {
  // El onSubmit espera el tipo RegisterCredentials (que incluye 'name', 'email', 'password')
  onSubmit: (credentials: RegisterCredentials) => void; 
  onSwitch: () => void; // Para cambiar a la vista de login
  isLoading: boolean;
}

const RegisterForm = ({ onSubmit, onSwitch, isLoading }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Validaciones básicas antes de enviar
    if (name.trim() && email.trim() && password.trim()) {
      onSubmit({ name, email, password });
    }
  };

  return (
    <View className="w-full">
      <Text className="text-2xl text-white font-bold text-center mb-8">
        Crear Cuenta
      </Text>

      {/* Input de Nombre */}
      <TextInput
        placeholder="Nombre Completo"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        className="w-full bg-light-100/10 text-white p-4 rounded-lg mb-4 border border-light-100/20"
        editable={!isLoading}
      />

      {/* Input de Email */}
      <TextInput
        placeholder="Correo Electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full bg-light-100/10 text-white p-4 rounded-lg mb-4 border border-light-100/20"
        editable={!isLoading}
      />

      {/* Input de Contraseña */}
      <TextInput
        placeholder="Contraseña (Mín. 8 caracteres)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full bg-light-100/10 text-white p-4 rounded-lg mb-8 border border-light-100/20"
        editable={!isLoading}
      />

      {/* Botón de Registro */}
      <TouchableOpacity
        onPress={handleSubmit}
        className={`bg-accent px-6 py-4 rounded-lg ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-center text-lg">
            Registrarme
          </Text>
        )}
      </TouchableOpacity>

      {/* Enlace para cambiar a Login */}
      <TouchableOpacity onPress={onSwitch} className="mt-10" disabled={isLoading}>
        <Text className="text-light-100 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Text className="text-accent font-semibold">Iniciar Sesión</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;