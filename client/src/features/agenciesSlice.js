import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    agencies: [],
    isLoading: true,
}

export const getAgencies = createAsyncThunk(
    'agencies/getAgencies',
    async (thunkAPI) => {
        try {
            return await fetch('/api/v1/agencies')
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            return thunkAPI.rejectWithValue('something went wrong')
        }
    }
)

const agenciesSlice = createSlice({
    name: 'agencies',
    initialState,
    reducers:{
        clearAgencies:(state)=>{
            state.agencies = []
        },
        createAgency: (state, action) => {
            state.agencies = [action.payload, ...state.agencies]
        },
        removeAgency: (state, action) => {
            const itemId = action.payload
            state.agencies = state.agencies.filter((item)=> item.id !== itemId)
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getAgencies.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAgencies.fulfilled, (state, action) => {
                state.isLoading = false
                state.agencies = action.payload
            })
            .addCase(getAgencies.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { clearAgencies, removeAgency, createAgency } = agenciesSlice.actions
export default agenciesSlice.reducer