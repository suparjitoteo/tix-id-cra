import { getSchedulesByTheater, getShowtimesByTheater, getTheaters } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useTheaters(cityId) {
  return useFetch(getTheaters, cityId)
}

export function useSchedulesByTheater(theaterId) {
  return useFetch(getSchedulesByTheater, theaterId)
}

export function useShowtimesByTheater(theaterId) {
  return useFetch(getShowtimesByTheater, theaterId)
}