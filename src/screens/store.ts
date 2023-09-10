import { combineReducers, configureStore } from "@reduxjs/toolkit";
import apartmentSlice from "../features/apartmentSlice";
import blockSlice from "../features/blockSlice";
import userPreferenceSlice from "../features/userPreferenceSlice";
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from "redux-thunk";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userPreferenceSlice']
}

const userPrefPersistConfig = {
    key: 'userPreferenceSlice',
    storage: AsyncStorage,
    whitelist: ['lang' ]
}

const rootReducer = combineReducers({
    blockList: blockSlice,
    apartmentList: apartmentSlice,
    userPreferenceSlice: persistReducer(userPrefPersistConfig, userPreferenceSlice)
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)