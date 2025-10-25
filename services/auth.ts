import { Client, Account, ID } from "react-native-appwrite";

// --- Configuración ---
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); 

const account = new Account(client);

export interface User {
  $id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

/* Registra un nuevo usuario y crea automáticamente una sesión.*/
export const register = async ({
  email,
  password,
  name,
}: RegisterCredentials): Promise<User> => {
  try {
    await account.create(
      ID.unique(), // ID único de Appwrite
      email,
      password,
      name
    );
    // Inicia sesión inmediatamente con las credenciales
    await login({ email, password });

    // Devuelve los datos del usuario logueado
    const loggedInUser = await getCurrentUser();
    if (!loggedInUser)
      throw new Error("No se pudo obtener el usuario después del registro.");

    return loggedInUser;
  } catch (error) {
    console.error("Error en el registro de Appwrite:", error);
    throw error;
  }
};

/*  Inicia sesión con credenciales de email y contraseña. */
export const login = async ({
  email,
  password,
}: LoginCredentials): Promise<User> => {
  try {
    // Crea una sesión de email/contraseña
    await account.createEmailPasswordSession(email, password);

    // Obtiene y devuelve el usuario actual
    const loggedInUser = await getCurrentUser();
    if (!loggedInUser)
      throw new Error(
        "Inicio de sesión exitoso, pero no se pudo obtener el perfil de usuario."
      );

    return loggedInUser;
  } catch (error) {
    console.error("Error en el inicio de sesión de Appwrite:", error);
    throw error;
  }
};

/* Obtiene los detalles del usuario actualmente logueado. */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return user as User;
  } catch (error) {
    return null;
  }
};

/* Obtiene el ID del usuario actualmente logueado.*/
export const getUserId = async (): Promise<string | null> => {
  try {
    const user = await account.get();
    if (user && user.$id) {
      return user.$id; // Devuelve solo el ID del usuario
    }
    return null;
  } catch (error) {
    // No hay sesión activa
    return null;
  }
};

/* Cierra la sesión del usuario actual.*/
export const logout = async (): Promise<void> => {
  try {
    // Elimina la sesión actual
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error al cerrar sesión de Appwrite:", error);
    throw error;
  }
};
