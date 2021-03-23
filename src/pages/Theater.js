import React from 'react'
import { useParams, Switch, Route, useRouteMatch, Redirect } from 'react-router'
import TagLabel from '../components/TagLabel'
import useTheaters, { useSchedulesByTheater, useShowtimesByTheater } from '../hooks/useTheater'
import Loading from './Loading'
import MovieSchedule from './MovieSchedule'

import dayjs from 'dayjs'

export default function Theater({ city }) {
  const { id } = useParams()
  const { url } = useRouteMatch()

  const { response: schedules, loading } = useSchedulesByTheater(id)
  const { response: theaters, loading: loadingTheaters } = useTheaters(city.id)
  const { response: showtimes, loading: loadingShowtimes } = useShowtimesByTheater(id)

  if (loading || loadingTheaters || loadingShowtimes) {
    return <Loading />
  }

  const theater = theaters.find(x => x.id === id)

  return (
    <div className='flex flex-col'>
      <header className='flex flex-col mx-4 my-4'>
        <h1>{theater.name}</h1>
        <p className='text-xs'>{theater.address}</p>
      </header>
      
      { schedules.length ? (
        <React.Fragment>
          <MovieSchedule schedule={schedules} />
          <Switch>
            <Route path={`${url}/:date`}>
              <Showtime showtimes={showtimes}/>
            </Route>
            <Route path='*'>
              <Redirect to={`${url}/${schedules[0].date}`} />
            </Route>
          </Switch>
        </React.Fragment>

      ) : (
          <p className='text-3xl text-center'>No schedules available !</p>
      )}
    </div>
  )
}


function Showtime ({ showtimes }) {
  const { date } = useParams()
  const dateUnix = dayjs.utc(date).unix()

  const { merchant_type: merchantType, schedules } = showtimes
  const showtime = schedules.find(x => x.show_date === dateUnix)

  return (
    <ShowtimeTable schedules={showtime.schedules} />
  )
}

function ShowtimeTable({ schedules }) {
  if ((schedules?.length ?? 0) === 0) {
    return null
  }

  const now = dayjs().unix()

  return (
    schedules.map(movie => {
      return (
        <div 
          key={movie.id}
          className='flex flex-col p-4 shadow-lg rounded-lg mb-4 border border-gray-100'
        >
          <div className='flex flex-col'>
            <h3>{movie.movie_name}</h3>
            <div className='flex'>
              <TagLabel bgColor='bg-gray-400' textColor='text-white' text={movie.age_category} />
              <TagLabel bgColor='bg-gray-400' textColor='text-white' text={`${movie.duration} Minutes`} />
              <TagLabel bgColor='bg-gray-400' textColor='text-white' text={`${movie.genre_ids.map(x => x.name).join(', ')}`} />
            </div>
          </div>
          { movie.movie_time.map((studioType, index) => {
            return (
              <React.Fragment key={index}>
                <div className='flex my-2 items-center'>
                  <h4>{studioType.category}</h4>
                  <p className='text-xs ml-2'>({studioType.price_string})</p>
                </div>
                <div className='flex flex-wrap'>
                  {studioType.show_time.map(showtime => {
                    const expired = dayjs(dayjs.unix(showtime.expired).utc().format('YYYY-MM-DD HH:mm')).unix()
                    let className = (expired < now) || !showtime.status ? 'bg-gray-200 text-gray-400' : 'border border-gray-300'
                    return (
                      <div 
                        key={showtime.id} 
                        className={`py-1 px-4 mx-1 my-2 rounded-lg ${className}`}
                      >
                        <p className='text-sm font-bold'>
                          {dayjs.unix(showtime.time).utc().format('HH:mm')}
                        </p>
                      </div> 
                    )
                  })}
                </div>
              </React.Fragment>
            )              
          })}
        </div>
      )}
    )
  )
}