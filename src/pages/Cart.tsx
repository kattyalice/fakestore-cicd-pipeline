import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeFromCart, updateCart, clearCart } from "../redux/cartSlice";
import { Button, Container, ListGroup, Row, Col, Image, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2);

  // SAVE ORDER TO FIRESTORE
  const handleCheckout = async () => {
    if (!user) {
      alert("You must be logged in to checkout.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems,
        totalPrice: Number(totalPrice),
        createdAt: new Date().toISOString(),
      });

      dispatch(clearCart());
      setShowModal(false);
      setCheckedOut(true);

      setTimeout(() => setCheckedOut(false), 3000);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center">

                  <Col>
                    <Image
                      src={item.image}
                      alt={item.title}
                      style={{ width: "70px", height: "70px", objectFit: "contain" }}
                    />
                  </Col>

                  <Col>
                    <div>{item.title}</div>
                    <div>${item.price}</div>
                  </Col>

                  {/* QUANTITY BUTTONS */}
                  <Col className="d-flex align-items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        dispatch(
                          updateCart({ id: item.id, count: item.count - 1 })
                        )
                      }
                    >
                      -
                    </Button>

                    <span>{item.count}</span>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        dispatch(
                          updateCart({ id: item.id, count: item.count + 1 })
                        )
                      }
                    >
                      +
                    </Button>
                  </Col>

                  <Col>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* TOTALS */}
          <div className="mt-4 d-flex justify-content-between">
            <h5>Total items: {totalItems}</h5>
            <h5>Cart total: ${totalPrice}</h5>
          </div>

          {/* CHECKOUT BUTTON */}
          <div className="text-end mt-3">
            <Button variant="success" onClick={() => setShowModal(true)}>
              Checkout
            </Button>
          </div>
        </>
      )}

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You have {totalItems} item(s) totaling ${totalPrice}.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleCheckout}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SUCCESS MESSAGE */}
      {checkedOut && (
        <div className="alert alert-success mt-3">
          Thank you! Your order was placed and your cart is now empty.
        </div>
      )}
    </Container>
  );
};

export default Cart;
