// src/pages/DisplayOrders.tsx
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  image: string;
  count: number;
}

interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

const DisplayOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));

      // Filter ONLY this user's orders
      const userOrders = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as Order) }))
        .filter((order) => order.userId === user.uid);

      setOrders(userOrders);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <p>You must be logged in to view your orders.</p>;
  }

  return (
    <div>
      <h2>Your Order History</h2>

      {orders.length === 0 && <p>You have no orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "2px solid black",
            padding: "15px",
            margin: "10px 0",
          }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

          <button
            onClick={() =>
              setExpandedOrder(expandedOrder === order.id ? null : order.id!)
            }
          >
            {expandedOrder === order.id ? "Hide Details" : "View Details"}
          </button>

          {/* Expand to show product list */}
          {expandedOrder === order.id && (
            <div style={{ marginTop: "10px" }}>
              <h4>Order Items</h4>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginTop: "5px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                  />
                  <div>
                    <p><strong>{item.title}</strong></p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayOrders;
