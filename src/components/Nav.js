import React from 'react'
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className='nav'>
      <NavLink to='/' exact activeClassName='active'>
        Now Playing
      </NavLink>
      <NavLink to='/upcoming' activeClassName='active'>
        Upcoming
      </NavLink>
    </nav>
  )
}