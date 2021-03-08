import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom";
import { handleReceiveCities } from "./actions/cities";

import NowPlaying from './pages/NowPlaying';
import Upcoming from './pages/Upcoming';
import Nav from './components/Nav';
import { useDispatch, useSelector } from 'react-redux';
import Theaters from './pages/Theaters';
import Select from './components/Select';

function App() {
  const [ city, setCity ] = React.useState({ id: '973818511182794752', name: 'JAKARTA'})

  const cities = useSelector(state => state.cities)
  const dispatch = useDispatch()

  useEffect(() => {
    if (cities.length === 0) {
      dispatch(handleReceiveCities())
    }
  }, [dispatch])

  return (
    <React.Fragment>
      <Nav />
      <div className='md:container'>
        <div className='flex justify-end items-center mt-4 px-2'>
          <p className='p-4'>Selected City:</p> 
          <Select 
            onChange={(selectedCity) => setCity(selectedCity) || console.log('run function')}
            options={cities} 
          />
        </div>
        <Switch>
          <Route path='/' exact>
            <NowPlaying city={city}/>
          </Route>
          // <Route path='/upcoming'>
          //   <Upcoming />
          // </Route>
          <Route path='/theaters'>
            <Theaters />
          </Route>
        </Switch>
      </div>
    </React.Fragment>
  )
}

export default App;
