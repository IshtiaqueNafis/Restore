import {User} from "../../app/models/user";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";

interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}

//region ***singInUser = createAsyncThunk<User, { data: FieldValues } --> signs in user and set user data on the storage. ***
export const singInUser = createAsyncThunk<User, FieldValues >(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const user = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(user)); // set the user on local storage session. 
            return user;

        } catch (e: any) {
            return thunkAPI.rejectWithValue({error: e.data})
        }
    }
)
//endregion

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/currentUser',
    async (_, thunkAPI) => {
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user)); // override user
            return user;

        } catch (e: any) {
            return thunkAPI.rejectWithValue({error: e.data})
        }
    }
)



export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut:(state)=>{
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(singInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(singInUser.rejected, fetchCurrentUser.rejected), (state, action) => {
            console.log(action.payload)
        })
    })


})

export const {signOut} = accountSlice.actions