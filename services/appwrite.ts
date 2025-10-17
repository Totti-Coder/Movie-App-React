// Rastrear las búsquedas realizadas por un usuario
import { Client, Databases, Query, ID } from "react-native-appwrite"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID! // ! Le explica a TypeScript que confie en que existen los datos
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!

// Crea la conexion con la base de datos
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // Buscar si ya existe un documento con esta búsqueda
    const result = await database.listDocuments(
      DATABASE_ID,
      TABLE_ID,
      [Query.equal("searchQuery", query)]
    )

    // Verificar si ya existe un registro de esa búsqueda
    if (result.documents.length > 0) {
      const existingDoc = result.documents[0]
      const newCount = (existingDoc.count || 0) + 1


      const updated = await database.updateDocument(
        DATABASE_ID,
        TABLE_ID,
        existingDoc.$id,
        {
          count: newCount,
        }
      )
      return updated;

    } else {
      const newDocument = {
        searchQuery: query,
        count: 1,
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }

      const created = await database.createDocument(
        DATABASE_ID,
        TABLE_ID,
        ID.unique(), 
        newDocument
      )
      return created;

    }
  } catch (error: any) {
    console.error(" Error detallado:");
    console.error("Tipo:", error.type);
    console.error("Código:", error.code);
    console.error("Mensaje:", error.message);
    console.error("Response:", error.response);
    throw error
  }
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      TABLE_ID,
      [
        Query.orderDesc("count"),  // Ordenar por count de mayor a menor
        Query.limit(10)            // Limitar a las 10 más buscadas
      ]
    )
    return result.documents as unknown as TrendingMovie[]
    
  } catch (error) {
    console.log(error)
    return undefined
    
  }
}