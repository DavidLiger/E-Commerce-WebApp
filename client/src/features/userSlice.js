import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoading: true,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        login: (state, action)=>{
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
        },
        getUser: (state) => {
            const user = JSON.parse(localStorage.getItem('user'))
            if(user){
                state.user = user
            }
        }
    }
})

export const { login, logout, getUser } = userSlice.actions
export default userSlice.reducer