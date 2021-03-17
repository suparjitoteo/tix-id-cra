import React from 'react'

export default function Card({ children }) {
  return (
    <div className='mt-2 p-2 w-full transform hover:scale-105 transition ease-in-out duration-300 cursor-pointer'>
      <div className='p-0 shadow-lg container rounded-md bg-white flex justify-between items-center flex-col h-full'>
        {children}
      </div>
    </div>
  )
}