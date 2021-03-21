const clientId = '123456'
// const uri = 'https://api.tix.id'

function getToken() {
  return localStorage.getItem('tixIdToken')
}

function getSelectedCity() {
  return localStorage.getItem('selectedCity')
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
      .catch((error) => {
        console.log('Uh-oh.', `${error} ${path}`)
        return error
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

export function getCities() {
  return fetchWithToken(`/v1/cities`)
    .then(data => data)
}

export function getCity(cityName) {
  return fetchWithToken(`/v1/cities?name=${cityName}`)
    .then(data => data)
}

export function getNowPlaying(cityId) {
  return fetchWithToken(`/v1/movies/now_playing?city_id=${cityId}&tz=7`)
    .then(data => data)
}

export function getPromoBanners() {
  return fetchWithToken(`v1/content/promo/banner`)
    .then(data => data)
}

export function getUpcoming(cityId) {
  return fetchWithToken(`/v1/movies/upcoming?city_id=${cityId}`)
    .then(data => data)
}

export function getTheaters(cityId) {
  return fetchWithToken(`/v1/theaters?city_id=${cityId}`)
    .then(data => data)
}

export function getSchedulesByTheater(theaterId) {
  return fetchWithToken(`/v2/schedule/theater/${theaterId}`)
    .then(data => data)
}

export function getSchedulesByCityAndMovie({ cityId, movieId }) {
  return fetchWithToken(`/v1/schedule/running-date?city=${cityId}&movie=${movieId}`)
    .then(data => data)
}

export function getMovie(movieId) {
  return fetchWithToken(`/v1/app/movie/${movieId}`)
    .then(data => data)
}

function getAdditionalMovie(movieId) {
  return fetchWithToken(`/v1/movie/additional/${movieId}`)
    .then(data => data)
}

export function getMovieDetail(movieId) {
  return Promise.all([
    getMovie(movieId), 
    getAdditionalMovie(movieId),
  ])
    .then(([movie, additional]) => { return { movie, additional } })
}

export function getShowtimes({ cityId, date, merchant='', movieId, page='', q='', sort='', studioType='' }) {
  return fetchWithToken(`/v3/schedule?city=${cityId}&date=${date}&merchant=${merchant}&movie=${movieId}&page=${page}&q=${q}&sort=${sort}&studio_type=${studioType}&lat=&lon=`)
    .then(data => data)
}

export function getTixNow() {
  return fetchWithToken(`/v1/app/homepage_content?count=5&method=2&page_name=homepage&page_number=0`)
    .then(data => data)
}