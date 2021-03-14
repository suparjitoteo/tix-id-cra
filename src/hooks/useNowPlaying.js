import { getNowPlaying } from '../utils/api/tixid'
import useFetch from './useFetch'

export default function useNowPlaying(cityId) {
  return useFetch(getNowPlaying, cityId)
}
