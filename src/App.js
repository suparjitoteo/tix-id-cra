import React, { useEffect } from 'react'
import { Route, Switch } from "react-router-dom";
import { handleReceiveCities } from "./actions/cities";

import NowPlaying from './pages/NowPlaying';
import Upcoming from './pages/Upcoming';
import Nav from './components/Nav';
import { useDispatch, useSelector } from 'react-redux';
import Theaters from './pages/Theaters';
import Select from './components/Select';
import Movie from './pages/Movie';
import Theater from './pages/Theater';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';

function App() {
  const [ city, setCity ] = React.useState({ id: '967969975509716992', name: 'JAKARTA'})

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
      <div className='md:container min-h-inherit'>
        <div className='flex justify-end items-center mt-4 px-2'>
          <p className='p-4'>Selected City:</p> 
          <Select 
            initialValue={city}
            onChange={(selectedCity) => setCity(selectedCity) || console.log('run function')}
            options={cities} 
          />
        </div>
        <div className='min-h-inherit'>
          <Switch>
            <Route path='/' exact>
              <NowPlaying city={city}/>
            </Route>
            <Route path='/upcoming'>
              <Upcoming city={city} />
            </Route>
            <Route path='/movie/:id'>
              <Movie city={city} />
            </Route>
            <Route exact path='/theaters'>
              <Theaters city={city} />
            </Route>
            <Route path='/theaters/:id'>
              <Theater city={city} />
            </Route>
            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  )
}

export default App;
