import { collection, addDoc, getDocs, query, where, } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CartItem } from "../redux/cartSlice";

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string; // ISO date string
}

// Firestore collection reference
const ordersCol = collection(db, "orders");

/**
 * Create a new order in Firestore
 */
export const createOrder = async (order: Omit<Order, "id">) => {
  await addDoc(ordersCol, order);
};

/**
 * Get all orders for a given user
 */
export const getOrdersForUser = async (userId: string): Promise<Order[]> => {
  const q = query(ordersCol, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Order),
    id: doc.id,
  }));
};
