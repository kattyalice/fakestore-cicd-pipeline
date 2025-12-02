import React from "react";
import type { Product } from "../types/types";
import { Rating } from "@smastrom/react-rating";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/cartSlice";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  return (
    <div className="col-md-3 p-3 d-flex flex-column align-items-center gap-3 shadow">
      <h3>{product.title}</h3>
      <img src={product.image} alt={product.title} className="w-25" />
      <h5>{product.category.toUpperCase()}</h5>
      <Rating style={{ maxWidth: 100 }} value={product.rating.rate} readOnly />
      <p>${product.price}</p>
      <p>{product.description}</p>

      {/* Add to Cart – always available */}
      <Button variant="primary" onClick={() => dispatch(addToCart(product))}>
        Add to cart
      </Button>

      {/* Logged-in users see Edit/Delete */}
      {user && (
        <div className="d-flex gap-2 mt-2">
          {/* Edit button */}
          <Link to={`/edit-product/${product.id}`}>
            <Button size="sm" variant="warning">
              Edit
            </Button>
          </Link>

          {/* Delete button */}
          <Link to={`/edit-product/${product.id}`}>
            <Button size="sm" variant="danger">
              Delete
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
