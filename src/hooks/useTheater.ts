import { getSchedulesByTheater, getShowtimesByTheater, getTheaters, MovieSchedule, MovieShowtimeByTheater, Theater } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useTheaters(cityId: string) {
  return useFetch<Theater[]>(getTheaters, cityId)
}

export function useSchedulesByTheater(theaterId: string) {
  return useFetch<MovieSchedule[]>(getSchedulesByTheater, theaterId)
}

export function useShowtimesByTheater(theaterId: string) {
  return useFetch<MovieShowtimeByTheater>(getShowtimesByTheater, theaterId)
}