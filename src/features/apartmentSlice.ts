import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IApartments } from "../screens/BlockDetails";
import { getApartments } from "../../utils/Storage";

export type ApartmentListState = {
    apartments: IApartments[],
    loading: boolean,
    error: boolean
}

const initialState: ApartmentListState = {
    apartments: [],
    loading: true,
    error: false
}

export const fetchApartments = createAsyncThunk(
    'fetchApartments',
    async ({blockId}: {blockId: string}) => {
        const response = await getApartments(blockId)
        if (response !== undefined) {
            return response
        } else {
            throw 'Apartmanları çekerken bir hata oluştu.'
        }
    }
)

const apartmentListSlice = createSlice({
    name: 'apartmentList',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApartments.fulfilled, (state, action) =>{
                action.payload.forEach((value, index) => {
                    if (value.Email === undefined) {
                        value.Email = ''
                    }
                })
                state.apartments = action.payload
                state.loading = false
            })
            .addCase(fetchApartments.rejected, (state) => {
                state.error = true
            })
    }
})

export default apartmentListSlice.reducer;