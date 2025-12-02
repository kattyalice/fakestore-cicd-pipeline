import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { CartItem } from "../redux/cartSlice";
import { Container, Button } from "react-bootstrap";

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Load order by ID
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      const ref = doc(db, "orders", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Omit<Order, "id">;
        setOrder({
          id,
          ...data,
        });
      }

      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-4">
        <h3>Loading order...</h3>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="mt-4">
        <h3>Order not found.</h3>
        <Link to="/orders">
          <Button className="mt-3">Back to Orders</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Order Details</h2>

      <div className="card mt-3">
        <div className="card-body">
          <h4>Order ID: {order.id}</h4>

          <p className="text-muted">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>

          <h5>Total Price: ${order.totalPrice.toFixed(2)}</h5>

          <h4 className="mt-4">Items:</h4>

          <ul className="list-group mt-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.title}</strong>
                  <div>Quantity: {item.count}</div>
                  <div>Price Each: ${item.price}</div>
                </div>

                <span style={{ fontWeight: "bold" }}>
                  ${(item.price * item.count).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <Link to="/orders">
            <Button className="mt-4" variant="secondary">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetails;
