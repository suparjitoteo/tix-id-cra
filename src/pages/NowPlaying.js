import React from 'react'
import { getNowPlaying } from "../utils/api/tixid";

function Card({ movie }) {
  return (
    <div className='p-2 w-2/4 md:w-1/3 transform hover:scale-105 transition ease-in-out duration-150'>
      <div className='p-0 shadow-lg container rounded-md bg-white flex items-center mx-auto flex-col h-full'>
        <img className='rounded-md w-full' src={movie.poster_path} alt={movie.title} />
        <p className='h-20 m-2 text-xs md:text-base'>{movie.title}</p>
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
    <div className='md:container flex flex-wrap'>
      { nowPlaying.map(movie => (
        <Card
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>  
  )
}