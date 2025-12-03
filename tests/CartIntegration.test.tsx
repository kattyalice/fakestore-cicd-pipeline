// ⭐ Mock AuthContext first
jest.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// ⭐ Mock react-router-dom BEFORE ANY imports
jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ⭐ Mock Rating Component
jest.mock("@smastrom/react-rating", () => ({
  Rating: () => <div data-testid="rating" />,
}));


// ⭐ Mock firebase config
jest.mock("../src/lib/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("react-bootstrap", () => {
  const Mock = ({ children, ...props }: any) => <div {...props}>{children}</div>;

  return {
    Button: Mock,
    Container: Mock,
    Row: Mock,
    Col: Mock,
    Image: Mock,
    Modal: Object.assign(Mock, {
      Header: Mock,
      Title: Mock,
      Body: Mock,
      Footer: Mock,
    }),
    ListGroup: Object.assign(Mock, {
      Item: Mock,
    }),
  };
});


// 👍 Now imports
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../src/redux/cartSlice";
import ProductCard from "../src/components/ProductCard";
import Cart from "../src/pages/Cart";

describe("Cart Integration Test", () => {
  const mockProduct = {
    id: 99,
    title: "Integration Test Product",
    price: 12.5,
    description: "Testing product",
    category: "electronics",
    image: "test.jpg",
    rating: { rate: 4, count: 10 },
  };

  const createTestStore = () =>
    configureStore({
      reducer: { cart: cartReducer },
    });

  test("cart updates when product is added", () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <div>
          <ProductCard product={mockProduct} />
          <Cart />
        </div>
      </Provider>
    );

    fireEvent.click(screen.getByText("Add to cart"));

    expect(screen.getAllByText("Integration Test Product").length).toBeGreaterThanOrEqual(2);

    expect(screen.getAllByText("$12.5").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/Total items: 1/)).toBeInTheDocument();
  });
});
