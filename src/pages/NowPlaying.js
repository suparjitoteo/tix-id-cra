import React from 'react'
import { getNowPlaying } from "../utils/api/tixid";

function Card({ movie }) {
  return (
    <div className='p-2 w-2/4 md:w-1/3 transform hover:scale-105 transition ease-in-out duration-150'>
      <div className='p-0 shadow-lg container rounded-md bg-white flex justify-between items-center mx-auto flex-col h-full'>
        <img className='rounded-md w-full' src={movie.poster_path} alt={movie.title} />
        <p className='h-20 m-2 text-xs md:text-base'>{movie.title}</p>
        <div className='flex'>
          <div className='my-2 mx-1 text-xs items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-lg'>
            CGV
          </div>
          <div className='my-2 mx-1 text-xs items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-lg'>
            XXI
          </div>
        </div>        
      </div>
    </div>
  )
}

export default function NowPlaying ({ city }) {
  const [ nowPlaying, setNowPlaying] = React.useState()

  React.useEffect(() => {
    getNowPlaying(city.id)
      .then(data => setNowPlaying(data))
  }, [city])

  if (!nowPlaying) {
    return <p>Loading...</p>
  }

  return (
    <div className='flex flex-wrap'>
      { nowPlaying.map(movie => (
        <Card
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>  
  )
}