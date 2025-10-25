import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_MOVIES_KEY = '@saved_movies';

export const saveMovie = async (movie: Movie): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();
    
    const exists = savedMovies.some(m => m.id === movie.id);
    if (exists) {
      throw new Error('Esta película ya está en tus favoritos');
    }
    
    const movieToSave = {
      ...movie,
      savedAt: new Date().toISOString(),
    };
    
    const updatedMovies = [movieToSave, ...savedMovies];
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    
    console.log('✅ Película guardada:', movie.title);
  } catch (error) {
    console.error('❌ Error al guardar película:', error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<Movie[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    
    if (!data) {
      return [];
    }
    
    const movies = JSON.parse(data);
    return movies;
  } catch (error) {
    console.error('Error al obtener películas guardadas:', error);
    return [];
  }
};

export const removeFromSaved = async (movieId: number): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();
    const updatedMovies = savedMovies.filter(m => m.id !== movieId);
    
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    
  } catch (error) {
    console.error('Error al eliminar película:', error);
    throw error;
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.some(m => m.id === movieId);
  } catch (error) {
    console.error('Error al verificar película guardada:', error);
    return false;
  }
};

export const toggleSavedMovie = async (movie: Movie): Promise<boolean> => {
  try {
    const isSaved = await isMovieSaved(movie.id);
    
    if (isSaved) {
      await removeFromSaved(movie.id);
      return false;
    } else {
      await saveMovie(movie);
      return true;
    }
  } catch (error) {
    console.error('Error al alternar película guardada:', error);
    throw error;
  }
};

export const getSavedMoviesCount = async (): Promise<number> => {
  try {
    const movies = await getSavedMovies();
    return movies.length;
  } catch (error) {
    console.error('Error al obtener conteo:', error);
    return 0;
  }
};

export const clearAllSavedMovies = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SAVED_MOVIES_KEY)
  } catch (error) {
    console.error('Error al limpiar películas:', error);
    throw error;
  }
};