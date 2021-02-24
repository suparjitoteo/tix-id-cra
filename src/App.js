import React from 'react'
import './App.css';
import { getCities, getMovie } from "./utils/api/tixid";

function App() {
  const [ cities, setCities ] = React.useState([])
  const [ movie, setMovie ] = React.useState({})

  React.useEffect(() => {
    getCities()
    .then((data) => setCities(data))

    getMovie('1309363256703332352')
    .then(data => setMovie(data))
  }, [])

  if (!cities || !movie) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <ul>
        { cities.map(city => (
          <li key={city.id}>
            <p>{city.name}</p>
          </li>
        ))}
      </ul>
      <p>{JSON.stringify(movie)}</p>
    </div>
  )
}

export default App;
