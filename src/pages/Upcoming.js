import React from 'react'
import Card from '../components/Card'
import MerchantTag from '../components/MerchantTag'
import useUpcoming from '../hooks/useUpcoming'
import { Link } from 'react-router-dom'

export default function Upcoming ({city}) {
  const { response: upcoming, loading } = useUpcoming(city.id)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className='flex flex-wrap'>
      {upcoming.map(movie => (
        <Link className='flex w-2/4 md:w-1/3 lg:w-1/4' key={movie.id} to={`/movie/${movie.id}`}>
          <Card
            key={movie.id}
          >
            <img className='rounded-md w-full' src={movie.poster_path} alt={movie.title}/>
            <p className='h-20 m-2 text-xs md:text-base'>{movie.title}</p>
            <div className='flex'>
              {movie.merchant.map(({ merchant_name }, index) => (
                <MerchantTag key={index} merchant_name={merchant_name} />  
              ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}