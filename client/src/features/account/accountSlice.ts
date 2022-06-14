import {User} from "../../app/models/user";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import {history} from "../../index";

interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}

//region ***singInUser = createAsyncThunk<User, { data: FieldValues } --> signs in user and set user data on the storage. ***
export const singInUser = createAsyncThunk<User, FieldValues>(
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

//region *** fetchcurrent user-->fetch current user from api***
export const fetchCurrentUser = createAsyncThunk<User>(
    'account/currentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user)); // override user
            return user;

        } catch (e: any) {
            return thunkAPI.rejectWithValue({error: e.data})
        }
    }, {
        condition: () => {
            if (!localStorage.getItem('user')) {
                return false;
            }
        }
    }
)
//endregion


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user'); // remove user from localStorage. 
            history.push("/");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.user = null;
            localStorage.rejected('user');
            toast.error('session expired please log in again');
        });
        builder.addMatcher(isAnyOf(singInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(singInUser.rejected), (state, action) => {
            console.log(action.payload)
        })
       
    })


})

export const {signOut, setUser} = accountSlice.actions