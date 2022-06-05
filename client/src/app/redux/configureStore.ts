import {configureStore, getDefaultMiddleware, MiddlewareArray} from "@reduxjs/toolkit";
import {basketSlice} from "../../features/Basket/basketSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import logger from "redux-logger";
import {catalogSlice} from "../../features/catalog/catalogSlice";


export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),


})
export type RootState = ReturnType<typeof store.getState>; //type renames a statee // this is same as state 
export type AppDispatch = typeof store.dispatch; // this dispatches actions same as dispatch = useDispatch()

//custom hook
export const useAppDispatch = () => useDispatch<AppDispatch>();  //useApp rootstate 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;