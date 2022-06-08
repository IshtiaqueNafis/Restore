import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Product, ProductParams} from "../../app/models/product";
import agent from "../../app/api/agent";
import {RootState} from "../../app/redux/configureStore";
import {Metadata} from "../../app/models/pagination";

//region ***catalog State ***
interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams
    metadata: Metadata | null


}

//endregion


//region ***helper function init params,getAxiosParams***

//region ***initParams --> setqueryInfo***
const initParams = () => {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: [],
    }
};

//endregion
//region *** getAxiosParams()---> GET QUERY FROM API**
function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams(); // get the query from url 
    params.append('pageNumber', productParams.pageNumber.toString()); 
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);
    // check for optional
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if (productParams.brands.length>0) params.append('brands', productParams.brands.toString());
    if (productParams.types.length>0) params.append('types', productParams.types.toString());
    return params;


}

//endregion
//endregion


//region ***ProductAdapter***
const productAdapter = createEntityAdapter<Product>();
//endregion

//region *** asyncThunk Method***

//region *** fetchProductsAsync-->param:none,return:Product[] *** 
export const fetchProductsAsync = createAsyncThunk<Product[], void,
    { state: RootState } // this is nedded not to get undefined 
    >(
    // will return a list of product 
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {

        const params = getAxiosParams(thunkAPI.getState().catalog.productParams); // read it from url query and set the params/. 


        try {
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetadata(response.metaData));
            return response.items;
        } catch (e: any) {
            return thunkAPI.rejectWithValue({
                error: e.data
            })
        }
    }
)
//endregion


//region ***fetchFilters*** ---> get the necessay filter data,
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.fetchFilters();

        } catch (e: any) {
            return thunkAPI.rejectWithValue({
                error: e.data
            })
        }
    }
)
//endregion


//region ***fetchSingleProductAsync --> paradm:productId:number,return: product ***
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
//endregion
//endregion

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metadata: null


    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false; //changed to false so it will imace request api
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
        },
        resetProductParams: (state, action) => {
            state.productsLoaded = false; //changed to false so it will imace request api
            state.productParams = initParams()
        },
        setMetadata: (state, action) => {
            state.metadata = action.payload


        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}
        }


    },
    extraReducers: (builder => {
        //region ***fetchProductsAsync***
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
        //endregion

        //region ***fetchSingleProductAsync***
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
        //endregion

        //region *** fetchFilters***
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFilters'
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;

            state.types = action.payload.types;

            state.filtersLoaded = true;
            state.status = "idle"

        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action.payload);
        });
        //endregion
    })

})

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog); // means this sets the catalog to the product state. 
export const {setProductParams, resetProductParams, setMetadata, setPageNumber} = catalogSlice.actions;