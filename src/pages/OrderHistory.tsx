// src/pages/OrderHistory.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrdersForUser } from "../services/orderService";
import type { Order } from "../services/orderService";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getOrdersForUser(user.uid);
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <Container className="mt-4">
        <h2>You must be logged in to view your orders.</h2>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-4">
        <h3>Loading your orders...</h3>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="mt-4">
        <h3>You have no past orders.</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Your Order History</h2>

      {orders.map((order) => (
        <div className="card mt-3" key={order.id}>
          <div className="card-body">
            <h5 className="card-title">Order ID: {order.id}</h5>

            <p className="text-muted">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>

            <h6>Total Price: ${order.totalPrice.toFixed(2)}</h6>

            <Link to={`/orders/${order.id}`}>
              <Button className="mt-2" variant="primary">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default OrderHistory;
