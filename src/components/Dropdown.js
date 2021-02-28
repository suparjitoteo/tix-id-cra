import React from 'react'
import { NavLink } from "react-router-dom";

export default function Dropdown({ toggle }) {
  return (
    <div 
      className="px-2 pt-2 pb-3 space-y-1 sm:px-3" 
      onClick={toggle}
    >
      <NavLink 
        to='/' 
        exact 
        activeClassName='bg-gray-900 text-white'
        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
      >
        Now Playing
      </NavLink>
      <NavLink 
        to='/upcoming' 
        activeClassName='bg-gray-900 text-white'
        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
      >
        Upcoming
      </NavLink>  
      <NavLink 
        to='/theaters' 
        activeClassName='bg-gray-900 text-white'
        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
      >
        Theaters
      </NavLink>  
    </div>
  )
}