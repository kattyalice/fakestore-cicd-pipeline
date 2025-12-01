import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromCart, updateCart, clearCart } from "../redux/cartSlice";
//no update cart on cartSlice
import { Button, Container, ListGroup, Row, Col, Image, Modal } from 'react-bootstrap';

const Cart: React.FC = () => {
    const dispatch = useAppDispatch();
    // what is s? selected i think
    const cartItems = useAppSelector((s) => s.cart.items);
    const [showModal, setShowModal] = useState(false);
    const [checkedOut, setCheckedOut] = useState(false);

    const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0);
    const totalPrice = cartItems.reduceRight((sum, item) => sum + item.price * item.count, 0).toFixed(2);

    const handleCheckOut = () => {
        dispatch(clearCart());
        setShowModal(false);
        setCheckedOut(true);
        setTimeout(() => setCheckedOut(false), 3000); //look into
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
                                        <Image src={item.image} alt={item.title}/>
                                    </Col>
                                    <Col>
                                        <div>{item.title}</div>
                                        <div>${item.price}</div>
                                    </Col>
                                    <Col>
                                        <Button size="sm" variant="secondary" onClick={() => dispatch(updateCart({ id: item.id, count: item.count -1 }))
                                        }> - </Button>
                                    </Col>
                                    <Col>
                                        <Button size="sm" variant="outline-danger" onClick={() => dispatch(removeFromCart(item.id))}>Remove</Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <div className="mt-4 d-flex justify-content-between">
                        <h5>Total items: {totalItems}</h5>
                        <h5>Cart price: ${totalPrice}</h5>
                    </div>

                    <div className="text-end mt-3">
                        <Button variant="success" onClickCapture={() => setShowModal(true)}>
                            Checkout
                        </Button>
                    </div>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your cart has {totalItems} item(s) with a total price of ${totalPrice}.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleCheckOut}>Confirm</Button>
                </Modal.Footer>
            </Modal>

            {checkedOut && (
                <div className="slery alert-success mt-3">Thank you for your order. Cart is now clear.</div>
            )}
        </Container>
    );
};

export default Cart;