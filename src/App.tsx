import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from './pages/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProductProvider } from './context/ProductContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from './redux/store';
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Navbar from "./components/Navbar/Navbar";


function AppContext() {
  const client = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ProductProvider>
          <AuthProvider>
            <BrowserRouter>
              <Navbar />
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/logout' element={<Logout />} />
                </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ProductProvider>
      </QueryClientProvider>
    </Provider>
    )

}

const client = new QueryClient()

function App() {
  
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <ProductProvider>
            <Provider store={store}>
              <AppContext />
            </Provider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
