import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    brands: [],
    isLoading: true,
}

export const getBrands = createAsyncThunk(
    'brands/getBrands',
    async (thunkAPI) => {
        try {
            return await fetch('/api/v1/brands')
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            return thunkAPI.rejectWithValue('something went wrong')
        }
    }
)

const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers:{
        clearBrand:(state)=>{
            state.brands = []
        },
        createBrand: (state, action) => {
            state.brands = [action.payload, ...state.brands]
        },
        // id != ID
        removeBrand: (state, action) => {
            const itemId = action.payload
            state.brands = state.brands.filter((item)=> item.id !== itemId)
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getBrands.pending, (state) => {
                state.isLoading = true
            })
            // fulfilled mean it's successful and return brands
            // just have to set it in state 
            .addCase(getBrands.fulfilled, (state, action) => {
                state.isLoading = false
                state.brands = action.payload
            })
            .addCase(getBrands.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

export const { clearBrand, removeBrand, createBrand } = brandsSlice.actions
export default brandsSlice.reducer