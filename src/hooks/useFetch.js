import React from 'react'

export default function useFetch(apiMethod, params) {
  const [response, setResponse] = React.useState({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    apiMethod(params)
    .then((data) => {
      if(!signal.aborted) {
        setResponse(data)
        setLoading(false)

        console.log("API Retrieved")
      }
    })

    return () => abortController.abort()
  }, [apiMethod, params])


  return { response, loading }
}