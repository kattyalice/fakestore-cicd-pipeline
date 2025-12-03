import { createContext, useContext, type ReactNode, useReducer } from "react";
import type { Product } from "../types/types";

type ProductAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: string };

interface ProductState {
  products: Product[];
  selectedCategory: string;
}

const initialState: ProductState = {
  products: [],
  selectedCategory: "",
};

const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

interface ProductContextType extends ProductState {
  dispatch: React.Dispatch<ProductAction>;
}

/* ⭐ Stable default value (no undefined context issues) */
const ProductContext = createContext<ProductContextType>({
  ...initialState,
  dispatch: () => {},
});

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  /* ⭐ MAIN FIX — explicitly type the reducer so action ≠ never */
  const [state, dispatch] = useReducer<
    React.Reducer<ProductState, ProductAction>
  >(productReducer, initialState);

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  return useContext(ProductContext);
};
