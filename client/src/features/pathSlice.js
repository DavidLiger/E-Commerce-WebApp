import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    path: {
        path: '/',
        indexStepper: 0
    }
}

const pathSlice = createSlice({
    name: 'path',
    initialState,
    reducers:{
        setPath: (state, action)=>{
            const type = Object.keys(action.payload)[0]
            const data = Object.values(action.payload)[0]
            if(type === 'path'){
                state.path = {...state.path, path: data}
            }
            if(type === 'indexStepper'){
                state.path = {...state.path, indexStepper: data}
            }
        },
        setPathFromLocalStorage: (state, action)=>{
            state.path = action.payload
        }
    }
})

export const { setPath, setPathFromLocalStorage } = pathSlice.actions
export default pathSlice.reducer