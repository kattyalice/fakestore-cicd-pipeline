// src/pages/AddProduct.tsx
import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    rating: { rate: 0, count: 0 },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "products"), product);
      alert("Product added!");

      setProduct({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: { rate: 0, count: 0 },
      });
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px", // spacing ONLY between the groups
          width: "300px",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Product Title</label>
          <input
            name="title"
            value={product.title}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        </div>

        {/* Image URL */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Image URL</label>
          <input
            name="image"
            value={product.image}
            onChange={handleChange}
          />
        </div>

        {/* Rating Score */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Rating Score (max 5)</label>
          <input
            name="ratingScore"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={product.rating.rate}
            onChange={(e) =>
              setProduct({
                ...product,
                rating: { ...product.rating, rate: parseFloat(e.target.value) }
              })
            }
          />
        </div>

        {/* Rating Count */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Rating Count</label>
          <input
            name="count"
            type="number"
            value={product.rating.count}
            onChange={(e) =>
              setProduct({
                ...product,
                rating: { ...product.rating, count: parseInt(e.target.value) },
              })
            }
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
