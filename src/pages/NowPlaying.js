import React from 'react'
import Card from '../components/Card'
import useNowPlaying from '../hooks/useNowPlaying'
import { Link } from 'react-router-dom'
import MerchantTag from '../components/MerchantTag'
import Loading from './Loading'

export default function NowPlaying ({ city }) {
  const { response: nowPlaying, loading} = useNowPlaying(city.id)

  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex flex-wrap items-start'>
      { nowPlaying.map(movie => (
        <Link className='flex w-2/4 md:w-1/3 lg:w-1/4' key={movie.id} to={`/movie/${movie.id}`}>
          <Card>
            {/*<div className='h-56 sm:h-h100 md:h-72 w-full'>*/}
            <img className='object-cover h-full rounded-t-lg w-full' src={movie.poster_path} alt={movie.title} />
            <p className='h-20 m-2 text-xs md:text-base'>{movie.title}</p>
            <div className='flex w-full justify-center'>
              { movie.merchant.map(({ merchant_name }, index) => (
                <MerchantTag key={index} merchant_name={merchant_name} />  
              ))}
            </div>        
          </Card>
        </Link>
      ))}
    </div>  
  )
}