import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Address {
    label?: string;
    fullAddress?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    companyName?: string;
    addresses?: Address[];

    wishlist?: string[]; // array of product IDs
}

interface AuthState {
    user: User | null;
    token: string | null;
    initialized: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    initialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setCredentials: (
        state,
        action: PayloadAction<{ user: User; token: string }>
        ) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        },

        logout: (state) => {
        state.user = null;
        state.token = null;
        },

        updateUser: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
            state.user = {
            ...state.user,
            ...action.payload,
            };
        }
        },

        // 🔥 wishlist sync (OPTIONAL BUT POWERFUL)
        setWishlistIds: (state, action: PayloadAction<string[]>) => {
        if (state.user) {
            state.user.wishlist = action.payload;
        }
        },

        setInitialized: (state) => {
        state.initialized = true;
        },
    },
});

export const {
    setCredentials,
    logout,
    updateUser,
    setInitialized,
    setWishlistIds,
} = authSlice.actions;

export default authSlice.reducer;