import React from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router'
import TagLabel from '../components/TagLabel'
import { getMovieAndSchedule, getShowtimes } from '../utils/api/tixid'
import { Link } from 'react-router-dom'

import dayjs from 'dayjs'
import id from "dayjs/locale/id"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import MerchantTag from '../components/MerchantTag'
import Select from '../components/Select'

dayjs.locale({ ...id, })
dayjs.extend(utc)
dayjs.extend(timezone)

function CustomLink ({ to, className, activeClassName, children }) {
  const match = useRouteMatch(to)

  return (
    <Link
      to={to}
      className={`${className} ${match && activeClassName}`}
    >
      {children.map((p, index) => {
        const { activeClassName, ...rest } = p.props
        const newElement = { ...p, props: rest }
        return React.cloneElement(newElement, {
          key: index,
          className: `${match && activeClassName} ${p.props.className}`,
        })
      })}
    </Link>
  )
}

export default function MovieSchedule({ city }) {
  const { id } = useParams()
  const { url } = useRouteMatch()

  const [ movie, setMovie ] = React.useState(null)
  const [ additional, setAdditional] = React.useState(null)
  const [ schedule, setSchedule ] = React.useState(null)

  React.useEffect(() => {
    getMovieAndSchedule({ cityId: city.id, movieId: id})
    .then(data => {
      setMovie(data.movie)
      setAdditional(data.additional)
      setSchedule(data.schedule)
    })
  }, [])

  if (!movie || !schedule) {
    return <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <div className="p-2 flex flex-wrap items-start md:flex-nowrap m-4">
        <img className='w-full md:w-2/6 lg:w-64 md:pt-6 justify-center' src={movie.poster} alt={movie.name} />
        <div className="md:ml-4 p-4 flex-col">
          <h1>{movie.name}</h1>
          <div className='flex flex-wrap'>
            <TagLabel bgColor='bg-gray-400' textColor='text-white' text={movie.rating} />
            <TagLabel bgColor='bg-gray-400' textColor='text-white' text={dayjs.unix(movie.release_date).utc().format('DD-MMM-YYYY')} />
            <TagLabel bgColor='bg-gray-400' textColor='text-white' text={`${movie.duration} Minutes`} />
            <TagLabel bgColor='bg-gray-400' textColor='text-white' text={`${movie.genre}`} />
          </div>
          <h2 className='mt-4'>Synopsis</h2>
          <p>{movie.information.en}</p>
          <p className='mt-4'>Directed By: {movie.director}</p>
        </div>
      </div>
      <div className='flex p-2 m-4 items-center flex-col'>
        <h1>SCHEDULES</h1>
        <div className='flex w-full justify-center overflow-x-scroll'>
          { schedule.map(({ date, is_any_schedule }, index) => (
            is_any_schedule && (
              <CustomLink 
                key={index} 
                to={`${url}/${date}`}
                className='flex flex-shrink-0 flex-col items-center group p-2 my-4 mx-2 border-gray-500 border hover:bg-gray-800 rounded-lg text-xs hover:shadow-lg hover:border-transparent'
                activeClassName='font-bold bg-gray-700 shadow-lg'
              >
                <p 
                  className='text-black group-hover:text-white'
                  activeClassName='text-white'
                >
                  {dayjs(date).format('DD MMM')}
                </p>
                <p 
                  className='uppercase font-bold text-black group-hover:text-white'
                  activeClassName='text-white'
                >
                  {dayjs(date).format('ddd')}
                </p>
              </CustomLink> 
            )
          ))}
        </div>
      </div>
      <Switch>
        <Route path={`${url}/:date`}>
          <Showtime cityId={city.id} movieId={id}/>
        </Route>
        <Route path='*'>
          <div>No date selected</div>
        </Route>
      </Switch>
    </React.Fragment>
  )
}

function Showtime({ cityId, movieId }) {
  const { date } = useParams()

  const [ selectedMerchant, setSelectedMerchant ] = React.useState('')
  const [ page, setPage ] = React.useState(1)
  const [ sort, setSort ] = React.useState('alfabetical')
  const [ studioType, setStudioType ] = React.useState('')
  const [ showtimes, setShowtimes ] = React.useState([])

  React.useEffect(() => {
    getShowtimes({
      cityId,
      movieId,
      date,
      merchant: selectedMerchant,
      sort,
    }).then(data => {
      console.log(data)
      setShowtimes(data)
    })
  }, [date, selectedMerchant, sort])

  if (showtimes.length === 0) {
    return <p>Loading...</p>
  }

  const merchantList = showtimes.filter.map(filter => { return { id: filter.merchant.merchant_id, name: filter.merchant.merchant_name }})
  const sortList = showtimes.sort.map(sort => { return { id: sort.key, name: sort.label.en }})

  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center mx-4">
        <div>
          <h3>Filter:</h3>
        </div>
        <div className="mx-1 my-4">
          <Select 
            defaultPlaceholder='Merchant'
            options={merchantList} 
            onChange={(merchant) => setSelectedMerchant(merchant.id) || console.log(merchant)}
            searchable={false}
          />
        </div>
        <div className="mx-1 my-4">
          <Select
            defaultPlaceholder='Sorting'
            options={sortList}
            onChange={(sort) => setSort(sort.id) || console.log(sort)}
            searchable={false}
          />
        </div>
      </div>
      <ShowtimeTable schedules={showtimes.schedules} />
    </div>
  )
}

function ShowtimeTable({ schedules }) {
  if ((schedules?.length ?? 0) === 0) {
    return null
  }

  const now = dayjs().unix()

  return (
    schedules.map(eachSchedules => {
      return eachSchedules.schedules.map(studio => (
        <div 
          key={studio.id}
          className='flex flex-col mx-4 p-4 shadow-lg rounded-lg mb-4 border border-gray-100'
        >
          <div className='flex justify-between items-start'>
            <div>
              <h3>{studio.name}</h3>
              <p className='text-xs'>{studio.address}</p>
            </div>
            <MerchantTag merchant_name={studio.merchant.merchant_name} />
          </div>
          { studio.show_time.map((studioType, index) => {
            return (
              <React.Fragment key={index}>
                <div className='flex my-2 items-center'>
                  <h4>{studioType.category}</h4>
                  <p className='text-xs ml-2'>({studioType.price_string})</p>
                </div>
                <div className='flex flex-wrap'>
                  {studioType.show_time.map(showtime => {
                    const expired = dayjs(dayjs.unix(showtime.expired).utc().format('YYYY-MM-DD HH:mm')).unix()
                    let className = expired < now ? 'bg-gray-200 text-gray-400' : 'border border-gray-300'
                    return (
                      <div 
                        key={showtime.id} 
                        className={`first:ml-0 py-1 px-4 mx-1 my-2 rounded-lg ${className}`}
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
      ))}
    )
  )
}