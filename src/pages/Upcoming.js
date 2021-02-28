import React from 'react'
import { getUpcoming } from "../utils/api/tixid";

export default function Upcoming () {
  const [ upcoming, setUpcoming ] = React.useState()

  React.useEffect(() => {
    getUpcoming('973818511182794752')
      .then(data => setUpcoming(data))
  }, [])

  if (!upcoming) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>{ JSON.stringify(upcoming) }</p>
    </div>
  )
}