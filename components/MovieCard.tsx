import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    // Aseguro que poster_path sea una cadena de texto.
    const isValidPath = typeof poster_path === 'string' && poster_path;

    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-[30%] lg:max-w-xs'>
                <Image
                source={{
                    uri: isValidPath
                        ? `https://image.tmdb.org/t/p/w500${poster_path}`
                        : "https://placehold.co/600x900/1a1a1a/ffffff.png?text=No+Image" 
                }}
                className="w-full rounded-lg"
                style={{ aspectRatio: 2 / 3 }}
                resizeMode="cover"
                />
                
                <Text className='text-white text-sm font-bold mt-2' numberOfLines={2}>{title}</Text>
                
                <View className='flex-row items-center justify-start gap-x-1'>
                    <Image 
                        source={icons.star} 
                        className='size-4' 
                    />
                    <Text className='text-gray-300'>{Math.round(vote_average / 2)}/5</Text>
                </View>

                <View className='flex-row items-center justify-between'>
                  <Text className='text-light-300 text-xs font-medium mt-1'>
                    {release_date?.split("-")[0]}
                  </Text>

                  <Text className='text-xs font-medium text-light-300 uppercase'>
                    PELICULA
                  </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard