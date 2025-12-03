// ⭐ Mock react-router
jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ⭐ Mock AuthContext
jest.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// ⭐ Mock Firebase
jest.mock("../src/lib/firebase", () => ({
  auth: {},
  db: {},
}));

// ⭐ Mock Rating Component
jest.mock("@smastrom/react-rating", () => ({
  Rating: () => <div data-testid="rating" />,
}));

// ⭐ Mock Redux
jest.mock("../src/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("react-bootstrap", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Modal: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));


// 👍 Now imports
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../src/components/ProductCard";
import { useAppDispatch } from "../src/redux/hooks";
import { addToCart } from "../src/redux/cartSlice";
import "@testing-library/jest-dom";
import type { Product } from "../src/types/types";

describe("ProductCard Component", () => {
  const mockProduct: Product = {
    id: "1",
    title: "Test Product",
    price: 9.99,
    description: "Test description",
    category: "electronics",
    image: "test.jpg",
    rating: { rate: 4, count: 100 },
  };

  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test("renders product details", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByText("ELECTRONICS")).toBeInTheDocument();
  });

  test("dispatches addToCart when button is clicked", () => {
    render(<ProductCard product={mockProduct} />);

    fireEvent.click(screen.getByText("Add to cart"));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(addToCart(mockProduct));
  });
});
