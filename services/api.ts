// API CONFIGURATION
export const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    HEADERS:{
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

const LANGUAGE_CODE = 'es-ES';

export const fetchPopularMovies = async ({query}: { query: string}) => {
    const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${LANGUAGE_CODE}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${LANGUAGE_CODE}`


    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.HEADERS,
    })

    if(!response.ok){
        throw new Error(`Failed to fetch the movies: ${response.statusText} (Status: ${response.status})`)
    }

    const data = await response.json()
    return data.results
}

export const fetchMovieDetails = async(movie_id: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movie_id}?api_key=${TMDB_CONFIG.API_KEY}&language=${LANGUAGE_CODE}`, {
            method: "GET",
            headers: TMDB_CONFIG.HEADERS
        })

        if(!response.ok) throw new Error("Ha fallado al cargar los detalles de las peliculas")

        const data = await response.json()

        return data

        
    } catch (error) {
        console.log(error)
        throw(error)
    }
}
