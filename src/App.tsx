import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Navbar from "./components/Navbar/Navbar";
import OrderHistory from "./pages/OrderHistory";
import AddProduct from "./pages/AddProduct";
import DisplayProducts from "./pages/DisplayProducts";
import EditProduct from "./pages/EditProduct";
import OrderDetails from "./pages/OrderDetails";

const client = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <ProductProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:id" element={<OrderDetails />} />

                {/* Product Pages */}
                <Route path="/products" element={<DisplayProducts />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />

                {/* Auth */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </BrowserRouter>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
