import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import type { Product } from "../types/types";

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fields for editing each product
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedImage, setEditedImage] = useState("");

  // Fetch products on load
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Product),
      }));
      setProducts(list);
    };

    fetchProducts();
  }, []);

  // Update product in Firestore
  const updateProduct = async (productId: string) => {
    const productRef = doc(db, "products", productId);

    const updatedData: Partial<Product> = {};

    if (editedTitle) updatedData.title = editedTitle;
    if (editedPrice) updatedData.price = parseFloat(editedPrice);
    if (editedCategory) updatedData.category = editedCategory;
    if (editedDescription) updatedData.description = editedDescription;
    if (editedImage) updatedData.image = editedImage;

    await updateDoc(productRef, updatedData);

    alert("Product updated!");

    // refresh local UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, ...updatedData } : p
      )
    );

    // clear input fields
    setEditedTitle("");
    setEditedPrice("");
    setEditedCategory("");
    setEditedDescription("");
    setEditedImage("");
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, "products", productId));

    alert("Product deleted!");

    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Products</h1>

      <Link to="/add-product">
        <button
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Add New Product
        </button>
      </Link>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "2px solid black",
            margin: "10px 0",
            padding: "10px",
          }}
        >
          {/* Show current product */}
          <div>
            <h3>{product.title}</h3>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: "80px", marginTop: "10px" }}
            />
          </div>

          {/* Simple edit inputs */}
          <input
            type="text"
            placeholder="New Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{ display: "block", marginTop: "10px" }}
          />

          <input
            type="number"
            placeholder="New Price"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            style={{ display: "block", marginTop: "10px" }}
          />

          <input
            type="text"
            placeholder="New Category"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            style={{ display: "block", marginTop: "10px" }}
          />

          <input
            type="text"
            placeholder="New Description"
            value={editedDescription}
            onChange={(e) =>
              setEditedDescription(e.target.value)
            }
            style={{ display: "block", marginTop: "10px" }}
          />

          <input
            type="text"
            placeholder="New Image URL"
            value={editedImage}
            onChange={(e) => setEditedImage(e.target.value)}
            style={{ display: "block", marginTop: "10px" }}
          />

          {/* Buttons */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => updateProduct(product.id!)}
              style={{
                marginRight: "10px",
                padding: "8px",
                backgroundColor: "green",
                color: "white",
                border: "none",
              }}
            >
              Update
            </button>

            <button
              onClick={() => deleteProduct(product.id!)}
              style={{
                padding: "8px",
                backgroundColor: "crimson",
                color: "white",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageProducts;
