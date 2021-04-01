import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center h-96'>
      <p className='text-9xl font-bold m-10'>404</p>
      <p className='text-xl m-2 text-center'>Looks like the page you were looking for is no longer here.</p>
      <p className='text-xl text-center'>Let's go <Link to='/' className='text-gray-800 font-bold underline hover:text-blue-900'>home</Link> and try from there.</p>
    </div>
  )
}
