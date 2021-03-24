import React from 'react'

export default function useFetch(apiMethod, params) {
  const [response, setResponse] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    apiMethod(params)
    .then((data) => {
      if(!signal.aborted) {
        setResponse(data)
        setLoading(false)
      }
    }).catch(error => {
      setError(error)
    }) 

    return () => abortController.abort()
  }, [apiMethod, params])


  return { response, loading, error }
}