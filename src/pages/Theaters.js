import React from 'react'
import { Link } from 'react-router-dom'
import useTheaters from '../hooks/useTheater'
import Loading from './Loading'

export default function Theaters({ city }) {
  const { response: theaters, loading } = useTheaters(city.id)

  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex md:m-0 flex-wrap justify-between'>
      { theaters.map(({ id, name, address, contact }) => (
        <Link
          to={`/theaters/${id}`}
          key={id} 
          className='group md:px-2 mb-2 flex w-full md:w-1/3 transform hover:scale-105 transition ease-in-out duration-300 cursor-pointer'
        >
          <div className='group-hover:bg-gray-600 mt-2 p-4 w-full shadow-md group-hover:shadow-none rounded-lg border border-gray-100'>
            <h3 className='group-hover:text-white'>{name}</h3>
            <p className='group-hover:text-gray-300 text-xs'>{address}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
