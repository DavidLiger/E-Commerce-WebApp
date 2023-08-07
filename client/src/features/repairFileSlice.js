import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    repairFile: {photoFile:[]},
    repairFiles: null,
    repairFileSelected: null,
    isLoading: true,
}

export const getRepairFiles = createAsyncThunk(
    'repairFile/getRepairFiles',
    async (user) => {
        try {
            return await fetch('/api/v1/repairfile',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.token}`
                }
            })
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            console.log(error);
        }
    }
)

const repairFileSlice = createSlice({
    name: 'repairFile',
    initialState,
    reducers:{
        setRepairFile: (state, action)=>{
            const type = Object.keys(action.payload)[0]
            const data = Object.values(action.payload)[0]
            if(type === 'device'){
                state.repairFile = {...state.repairFile, device: data}
            }
            if(type === 'category'){
                state.repairFile = {...state.repairFile, category: data}
            }
            if(type === 'brand'){
                state.repairFile = {...state.repairFile, brand: data}
            }
            if(type === 'warrantyType'){
                state.repairFile = {...state.repairFile, warrantyType: data}
            }
            if(type === 'cities'){
                state.repairFile = {...state.repairFile, cities: data}
            }
            if(type === 'zipCode'){
                state.repairFile = {...state.repairFile, zipCode: data}
            }
            if(type === 'cityId'){
                state.repairFile = {...state.repairFile, cityId: data}
            }
            if(type === 'geoloc'){
                state.repairFile = {...state.repairFile, geoloc: data}
            }
            if(type === 'nearestAgency'){
                state.repairFile = {...state.repairFile, nearestAgency: data}
            }
            if(type === 'selectedRef'){
                state.repairFile = {...state.repairFile, selectedRef: data}
            }
            if(type === 'selectedOffer'){
                state.repairFile = {...state.repairFile, selectedOffer: data}
            }
            if(type === 'serialNumber'){
                state.repairFile = {...state.repairFile, serialNumber: data}
            }
            if(type === 'comment'){
                state.repairFile = {...state.repairFile, comment: data}
            }
            if(type === 'issue'){
                state.repairFile = {...state.repairFile, issue: data}
            }
            if(type === 'advices'){
                state.repairFile = {...state.repairFile, advices: data}
            }
            if(type === 'selectedTimeSlotRef'){
                state.repairFile = {...state.repairFile, selectedTimeSlotRef: data}
            }
            if(type === 'phoneAppointment'){
                state.repairFile = {...state.repairFile, phoneAppointment: data}
            }
            if(type === 'price'){
                state.repairFile = {...state.repairFile, price: data}
            }
            if(type === 'acceptCGV'){
                state.repairFile = {...state.repairFile, acceptCGV: data}
            }
            if(type === 'ratezone'){
                state.repairFile = {...state.repairFile, ratezone: data}
            }
            if(type === 'articleCode'){
                state.repairFile = {...state.repairFile, articleCode: data}
            }
            if(type === 'dayPlanning'){
                state.repairFile = {...state.repairFile, dayPlanning: data}
            }
        },
        setRepairFileFromLocalStorage: (state, action)=>{
            state.repairFile = action.payload
        },
        setRepairFileSelected: (state, action)=>{
            state.repairFileSelected = action.payload
        },
        addPhotoFile:(state, action)=>{
            state.repairFile.photoFile = [action.payload, ...state.repairFile.photoFile]
        },
        removePhotoFile:(state, action) => {
            const name = action.payload
            state.repairFile.photoFile = state.repairFile.photoFile.filter((item)=> item !== name)
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getRepairFiles.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getRepairFiles.fulfilled, (state, action) => {
                state.isLoading = false
                state.repairFiles = action.payload
            })
            .addCase(getRepairFiles.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { setRepairFile, setRepairFileFromLocalStorage, setRepairFileSelected, addPhotoFile, removePhotoFile } = repairFileSlice.actions
export default repairFileSlice.reducer