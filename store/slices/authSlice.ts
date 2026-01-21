import { User } from "@/types/auth"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getCurrentUser, logout as logoutUser } from "@/services/auth.service"
interface AuthState {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user
            state.isAuthenticated = true
            state.isLoading = false
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
        },
        updateUserSuccess: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMe.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchMe.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
            }
            state.isAuthenticated = true;
            state.isLoading = false;
        })
        .addCase(fetchMe.rejected, (state) => {
            state.isLoading = false;
        }); 
  },
})

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async () => {
    const res = await getCurrentUser(); 
    return res.data;
  }
);


export const fetchLogout = createAsyncThunk(
    'auth/fetchLogout',
    async (_, { dispatch }) => {
        await logoutUser()
        dispatch(logout())
    }
)

export const { loginSuccess, logout, updateUserSuccess } = authSlice.actions
export default authSlice.reducer
