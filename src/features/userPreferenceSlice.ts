import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type UserPrefState = {
    lang: string
}

const initialState: UserPrefState = {
    lang: "en"
}

const userPrefSlice = createSlice({
    name: 'userPref',
    initialState: initialState,
    reducers: {
        setLanguage(state, action) {
            state.lang = action.payload
        }
    },
    extraReducers: {}
})

export const { setLanguage } = userPrefSlice.actions
export default userPrefSlice.reducer;