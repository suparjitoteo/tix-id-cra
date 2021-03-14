import { getUpcoming } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useUpcoming(cityId) {
  return useFetch(getUpcoming, cityId)
}
