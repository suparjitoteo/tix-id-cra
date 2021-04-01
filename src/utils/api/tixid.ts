const clientId = '123456'
// const uri = 'https://api.tix.id'

export interface City {
  id: string
  name: string
}

interface Merchant {
  id: string;
  merchant_name: string
}

export interface Movie {
  id: string
  poster_path: string
  title: string
  merchant: Merchant[]
  presale_flag: boolean
  status: string
  poster: string
  name: string
  rating: string
  duration: string
  release_date: number
  genre: string
  information: {
    en: string
  }
  director: string
}

export interface AdditionalMovie {
  
}

export interface Theater {
  id: string
  name: string
  address: string
  contact: string
}

export interface MovieSchedule {
  date: string
  is_any_schedule: boolean
}

export interface Showtime {
  id: string
  expired: number
  time: number
  status: string
}

export interface ShowtimeByStudio {
  category: string
  price_string: string
  show_time: Showtime[]
}

export interface MovieShowtime {
  id: string
  movie_name: string
  movie_time: ShowtimeByStudio[]
  age_category: string
  duration: number
  genre_ids: { name: string }[]
}

export interface MovieShowDate {
  show_date: number
  schedules: MovieShowtime[]
}

export interface MovieShowtimeByTheater {
  merchant_type: string
  schedules: MovieShowDate[]
}

export interface TheaterShowDate {
  show_date: string
  schedules: TheaterShowtime[]
}

export interface TheaterShowtime extends Theater {
  merchant: Merchant
  show_time: ShowtimeByStudio[]
}

export interface MovieShowtimeByMovie {
  filter: { merchant: {
    merchant_id: string
    merchant_name: string
  }}[]
  sort: {
    key: string
    label: { en: string }
  }[]
  has_next: boolean
  schedules: TheaterShowDate[]
}

function getToken() {
  return localStorage.getItem('tixIdToken')
}

function fetchWithToken<T>(path: string): Promise<T> {
  const token = getToken()
  if (token === null) {
    return requestToken()
      .then((token) => {
        localStorage.setItem('tixIdToken', token)
        return fetchWithToken<T>(path)
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
        throw new Error(error.message)
      })
  }
}

function requestToken(): Promise<string> {
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

export function getCities() {
  return fetchWithToken<City[]>(`/v1/cities`)
    .then(data => data)
}

export function getNowPlaying(cityId: string) {
  return fetchWithToken<Movie[]>(`/v1/movies/now_playing?city_id=${cityId}&tz=7`)
    .then(data => data)
}

export function getUpcoming(cityId: string) {
  return fetchWithToken<Movie[]>(`/v1/movies/upcoming?city_id=${cityId}`)
    .then(data => data)
}

export function getTheaters(cityId: string) {
  return fetchWithToken<Theater[]>(`/v1/theaters?city_id=${cityId}`)
    .then(data => data)
}

export function getSchedulesByTheater(theaterId: string) {
  return fetchWithToken<MovieSchedule[]>(`/v2/schedule/theater/running-date/${theaterId}`)
    .then(data => data)
}

export function getShowtimesByTheater(theaterId: string) {
  return fetchWithToken<MovieShowtimeByTheater>(`/v2/schedule/theater/${theaterId}`)
    .then(data => data)
}

export function getSchedulesByCityAndMovie({ cityId, movieId }: { cityId: string, movieId: string }) {
  return fetchWithToken<MovieSchedule[]>(`/v1/schedule/running-date?city=${cityId}&movie=${movieId}`)
    .then(data => data)
}

export function getMovie(movieId: string) {
  return fetchWithToken<Movie>(`/v1/app/movie/${movieId}`)
    .then(data => data)
}

function getAdditionalMovie(movieId: string) {
  return fetchWithToken<AdditionalMovie>(`/v1/movie/additional/${movieId}`)
    .then(data => data)
}

export function getMovieDetail(movieId: string) {
  return Promise.all([
    getMovie(movieId), 
    getAdditionalMovie(movieId),
  ])
    .then(([movie, additional]): {movie: Movie, additional: AdditionalMovie} => { return { movie, additional } })
}

export function getShowtimes({ cityId, date, merchant='', movieId, page=1, q='', sort='', studioType='' }: {
  cityId: string,
  date: string,
  movieId: string
  merchant?: string,
  page?: number,
  q?: string,
  sort?: string,
  studioType?: string
}) {
  return fetchWithToken<MovieShowtimeByMovie>(`/v3/schedule?city=${cityId}&date=${date}&merchant=${merchant}&movie=${movieId}&page=${page}&q=${q}&sort=${sort}&studio_type=${studioType}&lat=&lon=`)
    .then(data => data)
}