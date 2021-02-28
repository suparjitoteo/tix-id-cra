import React from 'react'
import { NavLink } from "react-router-dom";
import Dropdown from './Dropdown';

export default function Nav({ isOpen, toggle }) {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className="text-white">Tix ID Clone</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to='/' 
                exact 
                activeClassName='bg-gray-900 text-pink-50'
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Now Playing
              </NavLink>
              <NavLink 
                to='/upcoming' 
                activeClassName='bg-gray-900 text-pink-50'
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Upcoming
              </NavLink>  
              <NavLink 
                to='/theaters' 
                activeClassName='bg-gray-900 text-pink-50'
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Theaters
              </NavLink>  
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              type="button" 
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              onClick={toggle}
            >
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      { isOpen && (
        <Dropdown 
          isOpen={isOpen} 
          toggle={toggle}
        />
      )}
  </nav>  
  )
}