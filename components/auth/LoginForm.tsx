import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { LoginCredentials } from "@/services/auth";

interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => void;
    onSwitch: () => void; // Para cambiar a la vista de registro
    isLoading: boolean;
}

const LoginForm = ({ onSubmit, onSwitch, isLoading }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleSubmit = () => {
        if (email.trim() && password.trim()) {
            onSubmit({ email, password });
        }
    };

    return (
        <View className="w-full">
            {" "}
            <Text className="text-2xl text-white font-bold text-center mb-8">
                Iniciar Sesión      {" "}
            </Text>
            {/* Input de Email */}
            {" "}
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
            {/* Contenedor para el Input de Contraseña y el Ícono */}     {" "}
            <View className="w-full bg-light-100/10 rounded-lg mb-8 border border-light-100/20 flex-row items-center">
                <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible} // Utiliza el estado
                    className="flex-1 text-white p-4" 
                    editable={!isLoading}
                />

                {/* Ícono para alternar la visibilidad */}
                <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="p-4"
                    disabled={isLoading}
                >
                    <Text className="text-light-100 text-lg">
                        {isPasswordVisible ? "👁️" : "🔒"}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Botón de Iniciar Sesión */}     {" "}
            <TouchableOpacity
                onPress={handleSubmit}
                className={`bg-accent px-6 py-4 rounded-lg ${isLoading ? "opacity-50" : ""
                    }`}
                disabled={isLoading}
            >
                {" "}
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text className="text-white font-bold text-center text-lg">
                        Entrar          {" "}
                    </Text>
                )}
                {" "}
            </TouchableOpacity>
            {/* Enlace para cambiar a Registro */}     {" "}
            <TouchableOpacity
                onPress={onSwitch}
                className="mt-10"
                disabled={isLoading}
            >
                {" "}
                <Text className="text-light-100 text-center">
                    ¿No tienes cuenta?          {" "}
                    <Text className="text-accent font-semibold">Regístrate</Text>
                    {" "}
                </Text>
                {" "}
            </TouchableOpacity>
            {" "}
        </View>
    );
};

export default LoginForm;
