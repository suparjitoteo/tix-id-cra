import { hideLoading, showLoading } from "react-redux-loading-bar";
import { getCities } from '../utils/api/tixid'
import { City } from '../utils/api/tixid'
import { Action, Dispatch } from 'redux'

export const RECEIVE_CITIES = 'RECEIVE_CITIES'

function receiveCities(cities: City[]) {
  return {
    type: RECEIVE_CITIES,
    cities,
  }
}

export function handleReceiveCities() {
  return (dispatch: Dispatch<Action>) => {
    dispatch(showLoading())
    return getCities()
      .then(cities => {
        dispatch(receiveCities(cities))
        dispatch(hideLoading())
      })
  }
}