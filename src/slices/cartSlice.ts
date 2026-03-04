import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '@/types';

const initialState: CartState = { cart: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const item = action.payload;
      const existing = state.cart.find(i => i.id === item.id);
      if (existing) existing.quantity++;
      else state.cart.push({ ...item, quantity: 1 });
    },
    updateQuantity: (state, action: PayloadAction<{id: number; quantity: number}>) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item) item.quantity = quantity;
      state.cart = state.cart.filter(i => i.quantity > 0);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(i => i.id !== action.payload);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
