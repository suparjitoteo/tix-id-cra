import { hideLoading, showLoading } from "react-redux-loading-bar";
import { getCities } from '../utils/api/tixid'

export const RECEIVE_CITIES = 'RECEIVE_CITIES'

function receiveCities(cities) {
  return {
    type: RECEIVE_CITIES,
    cities,
  }
}

export function handleReceiveCities() {
  return (dispatch) => {
    dispatch(showLoading())
    return getCities()
      .then(cities => {
        dispatch(receiveCities(cities))
        dispatch(hideLoading())
      })
  }
}