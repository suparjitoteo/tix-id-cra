const clientId = '123456'
// const uri = 'https://api.tix.id'

function getToken() {
  return localStorage.getItem('tixIdToken')
}

function fetchWithToken(path) {
  const token = getToken()
  if (token === null) {
    return requestToken()
      .then((token) => {
        localStorage.setItem('tixIdToken', token)
        return fetchWithToken(path)
      })
  } else {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', `Bearer ${token}`)

    return fetch(`${path}`, {
      headers: headers
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          return data.results
        } else {
          throw new Error(data.error.message.en)
        }
      })
  }
}

function requestToken() {
  return fetch(`/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Secret': clientId,
    },
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      return data.results.token
    } else {
      throw new Error(data.error.message.en)
    }
  })
}

export function getAppConfig() {
  return fetchWithToken(`/v1/app_config`)
    .then(data => data)
}