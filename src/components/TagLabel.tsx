import React from 'react'

export default function TagLabel({ 
  bgColor = 'bg-blue-200', 
  textColor = 'text-blue-700', 
  text = 'Text Here' 
}) {
  return (
    <div className={`flex justify-center px-3 py-1 my-1 md:my-2 mx-1 min-w-0 text-xs font-bold leading-sm uppercase ${bgColor} ${textColor} rounded-lg`}>
      {text}
    </div>
  )
}