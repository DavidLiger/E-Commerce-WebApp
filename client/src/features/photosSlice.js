import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    // at "pending" is empty
    // at "fulfilled", has 'photos' (check in Redux devTools)
    photos: [],
    isLoading: true,
}

export const getPhotos = createAsyncThunk(
    'photos/getPhotos',
    async (headers, thunkAPI) => {
        try {
            return await fetch('/api/v1/photo', headers)
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            return thunkAPI.rejectWithValue('something went wrong')
        }
    }
)

const photosSlice = createSlice({
    name: 'photos',
    initialState,
    reducers:{
        clearPhotos:(state)=>{
            state.photos = []
        },
        createPhoto: (state, action) => {
            state.photos = [action.payload, ...state.photos]
        },
        // id != ID
        removePhoto: (state, action) => {
            const name = action.payload
            state.photos = state.photos.filter((item)=> item.name !== name)
        },
        setPhotosFromLocalStorage: (state, action)=>{
            state.photos = action.payload
        }
    }
})

export const { clearPhotos, removePhoto, createPhoto, setPhotosFromLocalStorage } = photosSlice.actions
export default photosSlice.reducer