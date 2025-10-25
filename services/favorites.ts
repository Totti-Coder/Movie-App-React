import { Client, Databases, Query, ID, Permission, Role } from "react-native-appwrite";

// Asegúrate de que estas variables de entorno están definidas:
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
// 🚨 ¡IMPORTANTE! Esta debe ser tu Colección/Tabla para las películas FAVORITAS
const FAVORITES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_ID!; 

// --- Configuración de Cliente ---
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

// -----------------------------------------------------------
// 1. FUNCIONES PARA GUARDAR Y ELIMINAR
// -----------------------------------------------------------

/**
 * 💾 Guarda una película en la base de datos de Appwrite, vinculándola al ID del usuario.
 * @param movie - Objeto de la película a guardar.
 * @param userId - El ID del usuario logueado. Si es null, lanza un error.
 */
export const saveMovieToUser = async (movie: Movie, userId: string | null): Promise<void> => {
    
    if (!userId) {
        throw new Error('Debe iniciar sesión para guardar favoritos.');
    }

    try {
        // 1. Verificar si ya está guardada para este usuario
        const existing = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            [
                Query.equal("movie_id", movie.id),
                Query.equal("user_id", userId),
            ]
        );

        if (existing.total > 0) {
            // No se lanza un error si ya existe, solo se ignora o se lanza un mensaje
            console.log('Esta película ya está en tus favoritos (Appwrite).');
            return;
        }

        // 2. Crear el documento con el vínculo (userId) y permisos
        const movieToSave = {
            movie_id: movie.id, 
            title: movie.title,
            poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            user_id: userId, // 👈 VÍNCULO CLAVE
        };

        await database.createDocument(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            ID.unique(),
            movieToSave,
            // 💡 Permisos de Appwrite: Solo el usuario que la creó puede leer/eliminar
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );

    } catch (error: any) {
        console.error('❌ Error al guardar película en Appwrite:', error);
        throw new Error(`Error al guardar: ${error.message}`);
    }
};

/**
 * 🗑️ Elimina una película de los favoritos del usuario en Appwrite.
 * Primero busca el ID del documento en Appwrite, luego lo elimina.
 */
export const removeFromFavorites = async (movieId: number, userId: string): Promise<void> => {
    try {
        // 1. Buscar el ID del documento en Appwrite usando movie_id y user_id
        const result = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            [
                Query.equal("movie_id", movieId),
                Query.equal("user_id", userId),
                Query.limit(1)
            ]
        );

        if (result.total === 0) {
            return; // No se encontró, no hace falta eliminar
        }

        const documentId = result.documents[0].$id;

        // 2. Eliminar el documento
        await database.deleteDocument(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            documentId
        );

    } catch (error: any) {
        console.error('❌ Error al eliminar película de Appwrite:', error);
        throw new Error(`Error al eliminar: ${error.message}`);
    }
};


// -----------------------------------------------------------
// 2. FUNCIONES PARA CONSULTAR
// -----------------------------------------------------------

/**
 * 📜 Obtiene todas las películas guardadas (favoritas) para un usuario específico.
 */
export const getFavorites = async (userId: string | null): Promise<Movie[]> => {
    
    if (!userId) {
        return []; // No hay usuario, no hay favoritos que buscar
    }

    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            [
                // 🚨 FILTRO CLAVE: Solo trae las películas con este userId
                Query.equal("user_id", userId), 
                Query.orderDesc("$createdAt"), 
            ]
        );

        // Mapear los documentos de Appwrite de vuelta a un formato Movie[]
        return result.documents.map(doc => ({
            id: doc.movie_id,
            title: doc.title,
            poster_path: doc.poster_url, 
            // Asegúrate de mapear cualquier otro campo que necesite tu MovieCard
        })) as Movie[];

    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return [];
    }
};

/**
 * ❓ Verifica si una película ya está guardada para el usuario actual.
 */
export const isMovieSaved = async (movieId: number, userId: string | null): Promise<boolean> => {
    if (!userId) {
        return false;
    }
    
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            FAVORITES_TABLE_ID,
            [
                Query.equal("movie_id", movieId),
                Query.equal("user_id", userId),
                Query.limit(1) // Solo necesitamos saber si existe uno
            ]
        );
        return result.total > 0;
    } catch (error) {
        console.error('Error al verificar película guardada:', error);
        return false;
    }
};