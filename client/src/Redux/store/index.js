import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../Cart/cartSlice";
import categorySlice from "../Category/categorySlice";
import productSlice from "../Products/productSlice";


export const store = configureStore({
    reducer:{
        categoryReducer : categorySlice,
        pr : productSlice,
        cr : cartSlice
    }
})