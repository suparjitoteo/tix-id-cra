import React from 'react'
import { useParams } from 'react-router'

export default function Theater() {
  const { id } = useParams()
  return (
    <div>
      Theater ID: {id}
    </div>
  )
}
