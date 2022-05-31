import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Product} from "../../app/models/product";
import agent from "../../app/api/agent";
import {RootState} from "../../app/redux/configureStore";

const productAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (e: any) {
            return thunkAPI.rejectWithValue({
                error: e.data
            })
        }
    }
)

export const fetchSingleProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchSingleProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (e: any) {
            return thunkAPI.rejectWithValue({
                error: e.data
            })
        }
    }
)

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pending'
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            state.status = 'idle';

        });
        builder.addCase(fetchSingleProductAsync.pending, (state) => {
            state.status = 'pending'
        });
        builder.addCase(fetchSingleProductAsync.fulfilled, (state, action) => {
            productAdapter.upsertOne(state, action.payload); // get one. 
            state.status = 'idle';
        });
        builder.addCase(fetchSingleProductAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
    })

})

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog); // means this sets the catalog to the product state. 