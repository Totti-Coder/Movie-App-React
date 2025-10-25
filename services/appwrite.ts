import { Client, Databases, Query, ID } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!; 

// Configuración de Cliente 
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

/**
 * @param userId - El ID del usuario loggueado.
 */
export const updateSearchCount = async (
  query: string,
  movie: Movie,
) => {
  try {
    // Buscar si ya existe un documento con esta búsqueda
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal("searchQuery", query),
    ]); 

    if (result.documents.length > 0) {
      const existingDoc = result.documents[0];
      const newCount = (existingDoc.count || 0) + 1;
      await database.updateDocument(DATABASE_ID, TABLE_ID, existingDoc.$id, {
        count: newCount,
      });
    } else {
      const newDocument = {
        searchQuery: query,
        count: 1,
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      };
      await database.createDocument(
        DATABASE_ID,
        TABLE_ID,
        ID.unique(),
        newDocument
      );
    } 

  } catch (error: any) {
    console.error(" Error detallado al guardar búsqueda:");
    console.error("Mensaje:", error.message);
    throw error;
  }
};

/* Obtiene las 10 películas más buscadas a nivel global. */
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.orderDesc("count"),
      Query.limit(10),
    ]); 
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log("Error al obtener tendencias:", error);
    return undefined;
  }
};
