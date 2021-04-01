import { RECEIVE_CITIES } from "../actions/cities";
import { City } from "../utils/api/tixid";

type CitiesAction = {
  type: string
  cities: City[]
}

export default function cities(state:City[] = [], action:CitiesAction) {
  switch(action.type) {
    case RECEIVE_CITIES:
      return action.cities
    default:
      return state
  }
}