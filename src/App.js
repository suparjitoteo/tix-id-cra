import React from 'react'
import './App.css';
import { getAppConfig } from "./utils/api/tixid";

function App() {

  React.useEffect(() => {
    getAppConfig()
    .then((data) => console.log(data))
  }, [])

  return (
    <div>
      Hello World !
    </div>
  )
}

export default App;
