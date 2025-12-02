import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import type { Product } from "../types/types";

const EditProduct = () => {
  const { id } = useParams();       // product ID from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Load product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Product;
        setProduct(data);

        setTitle(data.title);
        setPrice(String(data.price));
        setCategory(data.category);
        setDescription(data.description);
        setImage(data.image);
      } else {
        alert("Product not found!");
      }
    };

    fetchProduct();
  }, [id]);

  // Save updated product
  const updateProduct = async () => {
    if (!id) return;

    const ref = doc(db, "products", id);

    await updateDoc(ref, {
      title,
      price: parseFloat(price),
      category,
      description,
      image
    });

    alert("Product updated!");
    navigate("/"); // go home after saving
  };

  // Delete product
  const deleteProduct = async () => {
    if (!id) return;

    const ref = doc(db, "products", id);
    await deleteDoc(ref);

    alert("Product deleted!");
    navigate("/"); // go home after deleting
  };

  if (!product) {
    return <h2 style={{ marginTop: "20px" }}>Loading product...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Product</h1>

      <div style={{ border: "2px solid black", padding: "10px", marginTop: "10px" }}>
        <input
          style={{ display: "block", margin: "10px 0" }}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={{ display: "block", margin: "10px 0" }}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          style={{ display: "block", margin: "10px 0" }}
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          style={{ display: "block", margin: "10px 0" }}
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          style={{ display: "block", margin: "10px 0" }}
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          onClick={updateProduct}
          style={{ padding: "8px", backgroundColor: "green", color: "white", border: "none", marginRight: "10px" }}
        >
          Save Changes
        </button>

        <button
          onClick={deleteProduct}
          style={{ padding: "8px", backgroundColor: "crimson", color: "white", border: "none" }}
        >
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
