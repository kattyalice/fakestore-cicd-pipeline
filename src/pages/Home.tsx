import { useEffect } from "react";
import type { Product, Category } from "../types/types";
import ProductCard from "../components/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getAllCategories,
} from "../services/productService";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, selectedCategory, dispatch } = useProductContext();

  // 🔥 Fetch products from Firestore
  const {
    data: productsData,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // 🔥 Update context when Firestore products load
  useEffect(() => {
    if (productsData) {
      dispatch({ type: "SET_PRODUCTS", payload: productsData });
    }
  }, [dispatch, productsData]);

  // 🔥 Fetch categories dynamically from Firestore product list
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // 🔥 Filter products by selected category
  const getFilteredProducts = () => {
    if (selectedCategory) {
      return products.filter(
        (product: Product) => product.category === selectedCategory
      );
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="container mt-4">
      {/* Category Dropdown */}
      <select
        onChange={(e) =>
          dispatch({
            type: "SET_SELECTED_CATEGORY",
            payload: e.target.value,
          })
        }
        value={selectedCategory}
        className="form-select mb-3"
      >
        <option value="">All Categories</option>
        {categoriesData?.map((category: Category) => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>

      <button
        className="btn btn-secondary mb-3"
        onClick={() =>
          dispatch({ type: "SET_SELECTED_CATEGORY", payload: "" })
        }
      >
        Clear Filter
      </button>

      <button
        className="btn btn-outline-primary mb-3 ms-3"
        onClick={() => navigate("/profile")}
      >
        Go to Profile Page
      </button>

      {/* Loading state */}
      {productsLoading && <h1>Loading...</h1>}

      {/* Product Grid */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
