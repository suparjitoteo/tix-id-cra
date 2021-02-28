import React, { useEffect, useState } from 'react'
import { Route, Switch } from "react-router-dom";
import { handleReceiveCities } from "./actions/cities";

import NowPlaying from './pages/NowPlaying';
import Upcoming from './pages/Upcoming';
import Nav from './components/Nav';
import { useDispatch, useSelector } from 'react-redux';
import Theaters from './pages/Theaters';

function App() {
  const cities = useSelector(state => state.cities)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (cities.length === 0) {
      dispatch(handleReceiveCities())
    }

    const hideMenu = () => {
      if(window.innerWidth > 768 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', hideMenu)
    return () => {
      window.removeEventListener('resize', hideMenu)
    }
  }, [dispatch, isOpen])

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <Nav 
        isOpen={isOpen}
        toggle={toggle}
      />
      <div className='container'>
        <div className='flex justify-end'>
          <p>Selected City: </p>
        </div>
        <Switch>
          <Route path='/' exact>
            <NowPlaying />
          </Route>
          <Route path='/upcoming'>
            <Upcoming />
          </Route>
          <Route path='/theaters'>
            <Theaters />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default App;
