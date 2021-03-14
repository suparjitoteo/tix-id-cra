import React from 'react'

export default function TagLabel({ 
  bgColor = 'bg-blue-200', 
  textColor = 'text-blue-700', 
  text = 'Text Here' 
}) {
  return (
    <div className={`my-1 md:my-2 mx-1 text-xs items-center font-bold leading-sm uppercase px-3 py-1 ${bgColor} ${textColor} rounded-lg`}>
      {text}
    </div>
  )
}