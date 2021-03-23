import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import dayjs from 'dayjs'

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

export default function MovieSchedule({ schedule }) {
  const { url } = useRouteMatch()

  return (
    <div className='flex p-2 m-4 items-center flex-col'>
      <h2>SCHEDULES</h2>
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
  )
}
