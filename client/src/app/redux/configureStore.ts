import {configureStore} from "@reduxjs/toolkit";
import {basketSlice} from "../../features/Basket/basketSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import logger from "redux-logger";


export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware<any>().concat(logger),
})
export type RootState = ReturnType<typeof store.getState>; //type renames a statee // this is same as state 
export type AppDispatch = typeof store.dispatch; // this dispatches actions same as dispatch = useDispatch()

//custom hook
export const useAppDispatch = () => useDispatch<AppDispatch>();  //useApp
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;