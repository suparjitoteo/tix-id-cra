import { getTheaters } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useTheaters(cityId) {
  return useFetch(getTheaters, cityId)
}