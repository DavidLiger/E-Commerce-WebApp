import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    devices: [],
    isLoading: true,
}

export const getDevices = createAsyncThunk(
    'devices/getDevices',
    async (thunkAPI) => {
        try {
            return await fetch('/api/v1/devices')
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            return thunkAPI.rejectWithValue('something went wrong')
        }
    }
)

const devicesSlice = createSlice({
    name: 'devices',
    initialState,
    reducers:{
        clearDevice:(state)=>{
            state.devices = []
        },
        createDevice: (state, action) => {
            state.devices = [action.payload, ...state.devices]
        },
        // id != ID
        removeDevice: (state, action) => {
            const itemId = action.payload
            state.devices = state.devices.filter((item)=> item.id !== itemId)
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getDevices.pending, (state) => {
                state.isLoading = true
            })
            // fulfilled mean it's successful and return devices
            // just have to set it in state 
            .addCase(getDevices.fulfilled, (state, action) => {
                state.isLoading = false
                state.devices = action.payload
            })
            .addCase(getDevices.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

export const { clearDevice, removeDevice, createDevice } = devicesSlice.actions
export default devicesSlice.reducer