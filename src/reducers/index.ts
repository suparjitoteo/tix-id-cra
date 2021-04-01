import { combineReducers } from "redux";
import cities from "./cities";
import { loadingBarReducer } from "react-redux-loading-bar";

const rootReducer = combineReducers({
  cities,
  loadingBar: loadingBarReducer,
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>;