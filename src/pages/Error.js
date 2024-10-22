import React from 'react'

export default function Error({ message }) {
  return (
    <div className='flex justify-center h-56 items-center'>
      <p className='text-3xl text-center'>{message}</p>
    </div>
  )
}
