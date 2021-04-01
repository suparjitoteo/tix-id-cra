import { getNowPlaying } from '../utils/api/tixid'
import useFetch from './useFetch'
import { Movie } from '../utils/api/tixid'

export default function useNowPlaying(cityId: string) {
  return useFetch<Movie[]>(getNowPlaying, cityId)
}
