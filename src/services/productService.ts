import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../types/types";


const productsCol = collection(db, "products");

/**
 * Get all products from Firestore
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Product),
    id: doc.id, // ensures product.id matches Firestore ID
  }));
};

/**
 * Get categories dynamically from products
 */
export const getAllCategories = async (): Promise<string[]> => {
  const products = await getAllProducts();
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories);
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(productsCol, where("category", "==", category));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Product),
    id: doc.id,
  }));
};

/**
 * Create a new product
 */
export const addProduct = async (product: Omit<Product, "id">) => {
  await addDoc(productsCol, product);
};

/**
 * Get a single product by Firestore ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, "products", id);
  const snapshot = await getDoc(ref);

  return snapshot.exists()
    ? ({ ...(snapshot.data() as Product), id } as Product)
    : null;
};

/**
 * Update a product
 */
export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>
) => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, data);
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string) => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};
