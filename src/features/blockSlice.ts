import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBlocks } from "../screens/Main";
import { getBlocks } from "../../utils/Storage";

export type BlockListState = {
    blocks: IBlocks[],
    loading: boolean,
    error: boolean
}

const initialState: BlockListState = {
    blocks: [],
    loading: true,
    error: false
}

export const fetchBlocks = createAsyncThunk(
    'fetchBlocks', 
    async () => {
        const response = await getBlocks();
        if (response !== undefined) {
            return response
        } else {
            throw 'Bilgilerinizi çekerken bir hata oluştu'
        }
    }
)

const blockListSlice = createSlice({
    name: 'blockList',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlocks.fulfilled, (state, action) => {
                state.blocks = action.payload;
                state.loading = false;
            })
            .addCase(fetchBlocks.rejected, (state) => {
                state.error = true;
            })
    }
})

export default blockListSlice.reducer;