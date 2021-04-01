import { getUpcoming, Movie } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useUpcoming(cityId: string) {
  return useFetch<Movie[]>(getUpcoming, cityId)
}
