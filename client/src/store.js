import { configureStore } from "@reduxjs/toolkit";
import articlesSlice from './features/articlesSlice'
import userReducer from './features/userSlice'
import pathReducer from './features/pathSlice'
import devicesSlice from "./features/devicesSlice";
import repairFileSlice from "./features/repairFileSlice";
import brandsSlice from "./features/brandsSlice";
import agenciesSlice from "./features/agenciesSlice";
import photosSlice from "./features/photosSlice";

export const store = configureStore({
    reducer:{
        articles: articlesSlice,
        user: userReducer,
        path: pathReducer,
        devices: devicesSlice,
        repairFile: repairFileSlice,
        brands: brandsSlice,
        agencies: agenciesSlice,
        photos: photosSlice
    }
})