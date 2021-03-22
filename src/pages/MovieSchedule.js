import React from 'react'
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router'
import TagLabel from '../components/TagLabel'
import { getMovieDetail, getSchedulesByCityAndMovie, getShowtimes } from '../utils/api/tixid'
import { Link } from 'react-router-dom'

import dayjs from 'dayjs'
import id from "dayjs/locale/id"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import MerchantTag from '../components/MerchantTag'
import Select from '../components/Select'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { parse } from 'query-string'
import Loading from './Loading'

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
    getMovieDetail(id)
    .then(data => {
      setMovie(data.movie)
      setAdditional(data.additional)
    })
  }, [])

  React.useEffect(() => {
    if (movie?.presale_flag || movie?.status === 'NOW_PLAYING') {
      getSchedulesByCityAndMovie({ movieId: id, cityId: city.id })
      .then(data => setSchedule(data))
    }
  }, [movie])

  if (!movie) {
    return <Loading />
  }

  const hasSchedule = movie.presale_flag || movie.status === 'NOW_PLAYING'

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
      {hasSchedule ? (
        !schedule ? (
          <Loading text={'Loading Schedule'} />
        ) : (
          <React.Fragment>
            <div className='flex p-2 m-4 items-center flex-col'>
              <h1>SCHEDULES</h1>
              <div className='flex w-full md:justify-center overflow-x-scroll'>
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
                <Redirect to={`${url}/${schedule[0].date}`} />
              </Route>
            </Switch>
          </React.Fragment>
        )
      ) : (
       null 
      )}
    </React.Fragment>
  )
}

function Showtime({ cityId, movieId }) {
  const { date } = useParams()
  const location = useLocation()
  const history = useHistory()

  const searchParams = location.search ? parse(location.search) : null
  const merchant = searchParams?.merchant ?? ''
  const page = +(searchParams?.page) || 1
  const sort = searchParams?.sort ?? 'alfabetical'

  const [ showtimes, setShowtimes ] = React.useState([])

  React.useEffect(() => {
    getShowtimes({
      cityId,
      movieId,
      date,
      merchant,
      sort,
      page,
    }).then(data => {
      console.log(data)
      setShowtimes(data)
    })
  }, [date, merchant, sort, page])

  if (showtimes.length === 0) {
    return <Loading />
  }

  const merchantList = showtimes.filter.map(filter => { return { id: filter.merchant.merchant_id, name: filter.merchant.merchant_name }})
  const sortList = showtimes.sort.map(sort => { return { id: sort.key, name: sort.label.en }})

  const hasNextPage = showtimes.has_next
  const isFirstPage = page === 1

  return (
    <div className="flex flex-col px-4">
      <div className="flex justify-end items-center">
        <div>
          <h3>Filter:</h3>
        </div>
        <div className="mx-1 my-4">
          <Select 
            placeholder='Merchant'
            options={merchantList} 
            value={merchant && merchantList.find(x => x.id === merchant)}
            onChange={(merchant) => {
              const link = generateLink(location, [{ key: 'merchant', value: merchant.id }, { key: 'page', value: 1 }])
              history.push(link)
            }}
            searchable={false}
          />
        </div>
        <div className="mx-1 my-4">
          <Select
            placeholder='Sorting'
            options={sortList}
            value={sort && sortList.find(x => x.id === sort)}
            onChange={(sort) => {
              const link = generateLink(location, [{ key: 'sort', value: sort.id }, { key: 'page', value: 1 }])
              history.push(link)
            }}
            searchable={false}
            mandatory
          />
        </div>
      </div>
      <div className='flex justify-end mb-4'>
        <Link
            to={location => generateLink(location, { key: 'page', value: page - 1 })}
            className={`${isFirstPage ? 'pointer-events-none' : ''}`}
        >
          <button 
            className={`disabled:opacity-30 group rounded py-2 px-3 mx-1 border border-gray-400 hover:bg-gray-800 hover:border-transparent hover:shadow-sm active:bg-gray-900`}
            disabled={isFirstPage}
          >
            <AiFillCaretLeft className='group-hover:text-white'/>
          </button>
        </Link>
        <Link
          to={location => generateLink(location, { key: 'page', value: page + 1 })}
          className={`${!hasNextPage ? 'pointer-events-none' : ''}`}
        >
        <button 
          className='disabled:opacity-30 group rounded py-2 px-3 mx-1 border border-gray-400 hover:bg-gray-800 hover:border-transparent hover:shadow-sm active:bg-gray-900'
          disabled={!hasNextPage}
        >
          <AiFillCaretRight className='group-hover:text-white' />
        </button>
        </Link>
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
          className='flex flex-col p-4 shadow-lg rounded-lg mb-4 border border-gray-100'
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
                    let className = (expired < now) || !showtime.status ? 'bg-gray-200 text-gray-400' : 'border border-gray-300'
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

function generateLink(location, params) {
  const searchParams = location.search ? parse(location.search) : {}

  let newParams = {}
  if (Array.isArray(params)) {
    newParams = { ...searchParams, ...Object.assign({}, ...params.map(x => extractVal(x))) } 
  } else {
    newParams = { ...searchParams, ...extractVal(params) }
  }

  const generateParams = Object.entries(newParams).reduce((acc, val, idx) => {
    const [ key, value ] = val
    return `${acc}${idx === 0 ? '?' : '&'}${key}=${value}`
  }, '')

  return `${location.pathname}${generateParams}`
}

function extractVal(obj) {
  return { [obj.key]: obj.value }
}