import React from 'react'

export default function useFetch<T>(apiMethod: (params: string) => Promise<T>, params: string) {
  const [response, setResponse] = React.useState<T|null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error|null>(null)

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