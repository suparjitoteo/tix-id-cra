import { getMovieAndSchedule } from "../utils/api/tixid";
import useFetch from "./useFetch";

export default function useMovieSchedule(data) {
  return useFetch(getMovieAndSchedule, data)
}