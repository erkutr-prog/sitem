import { combineReducers, configureStore } from "@reduxjs/toolkit";
import apartmentSlice from "../features/apartmentSlice";
import blockSlice from "../features/blockSlice";

const rootReducer = combineReducers({
    blockList: blockSlice,
    apartmentList: apartmentSlice
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

const store = configureStore({
    reducer: rootReducer
})

export default store;