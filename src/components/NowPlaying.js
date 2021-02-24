import React from 'react'
import { getNowPlaying } from "../utils/api/tixid";

export default function NowPlaying () {
  const [ nowPlaying, setNowPlaying] = React.useState()

  React.useEffect(() => {
    getNowPlaying('973818511182794752')
      .then(data => setNowPlaying(data))
  }, [])

  if (!nowPlaying) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>{ JSON.stringify(nowPlaying) }</p>
    </div>
  )
}