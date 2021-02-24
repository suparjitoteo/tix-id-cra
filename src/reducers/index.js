import { combineReducers } from "redux";
import cities from "./cities";
import { loadingBarReducer } from "react-redux-loading-bar";

export default combineReducers({
  cities,
  loadingBar: loadingBarReducer,
})