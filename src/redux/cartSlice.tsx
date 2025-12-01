import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/types'

export interface CartItem extends Product {
    count: number;
}

interface CartState {
    items: CartItem[];
}

const loadCart = (): CartItem[] => {
    try {
        const raw = sessionStorage.getItem('cart');
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
};

const initialState: CartState ={
    items: loadCart(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingCart = state.items.find(itme => itme.id === action.payload.id);
            if (existingCart) {
                existingCart.count += 1;
            } else {
                state.items.push({...action.payload, count: 1 });
            }
            sessionStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            sessionStorage.setItem('cart', JSON.stringify(state.items));
        },
        updateCart: (state, action:PayloadAction<{id: number; count: number}>) => {
            const { id, count } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item) {
                if (count > 0) {
                    item.count = count;
                } else {
                    state.items = state.items.filter(item => item.id !== id);
                }
            }
            sessionStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            sessionStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, updateCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;