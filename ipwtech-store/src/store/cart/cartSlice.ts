import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/src/types/cart";

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        },

        addItem: (state, action: PayloadAction<CartItem>) => {
        const existing = state.items.find(
            (i) => i.product._id === action.payload.product._id
        );

        if (existing) {
            existing.quantity += action.payload.quantity;
        } else {
            state.items.push(action.payload);
        }
        },

        clearCart: (state) => {
        state.items = [];
        },
    },
});

export const { setCart, addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;