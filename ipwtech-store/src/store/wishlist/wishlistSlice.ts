import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/src/types/product";

interface WishlistState {
    items: Product[];
  }
  
  const initialState: WishlistState = {
    items: [],
  };
  
  const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
      setWishlist: (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload;
      },
  
      addWishlistItem: (state, action: PayloadAction<Product>) => {
        const exists = state.items.find(
          (i) => i._id === action.payload._id
        );
  
        if (!exists) {
          state.items.push(action.payload);
        }
      },
  
      removeWishlistItem: (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (i) => i._id !== action.payload
        );
      },
  
      clearWishlist: (state) => {
        state.items = [];
      },
    },
  });

export const {
    setWishlist,
    addWishlistItem,
    removeWishlistItem,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;