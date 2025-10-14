// API CONFIGURATION
export const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    HEADERS:{
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchPopularMovies = async ({query}: { query: string}) => {
    const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`


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


