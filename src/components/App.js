import React, { useEffect } from 'react'
import './App.css';
import { Route } from "react-router-dom";
import { handleReceiveCities } from "../actions/cities";

import NowPlaying from './NowPlaying';
import Upcoming from './Upcoming';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const cities = useSelector(state => state.cities)
  const dispatch = useDispatch()

  useEffect(() => {
    if (cities.length === 0) {
      dispatch(handleReceiveCities())
    }
  }, [dispatch])

  return (
    <div className='container'>
      <Nav />
      <Route path='/' exact>
        <NowPlaying />
      </Route>
      <Route path='/upcoming'>
        <Upcoming />
      </Route>
    </div>
  )
}

export default App;
