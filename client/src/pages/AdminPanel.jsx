import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    company: "",
    price: "",
    description: "",
  });

  // New state for error handling
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const { name, category, company, price } = newProduct;
    
    // More detailed validation
    if (!name || name.trim().length < 2) {
      return "Product name must be at least 2 characters long";
    }
    if (!category || category.trim().length < 2) {
      return "Category must be at least 2 characters long";
    }
    if (!company || company.trim().length < 2) {
      return "Company name must be at least 2 characters long";
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return "Please enter a valid positive price";
    }
    if (!imagePath) {
      return "Please upload an image";
    }
    
    return null;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('company', newProduct.company);
      formData.append('price', newProduct.price);
      formData.append('description', newProduct.description || '');
      
      // If an image has been cropped and uploaded
      if (imagePath) {
        // Send the image path from the previous upload
        formData.append('image', imagePath);
      }
  
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setProducts([...products, res.data]);
      
      // Reset form and states
      setNewProduct({ name: "", category: "", company: "", price: "", description: "" });
      setImagePath(null);
      setImageFile(null);
      fileInputRef.current.value = "";
  
      alert("Product added successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      console.error("Error adding product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
        e.target.value = null;
        return;
      }

      if (file.size > maxSize) {
        setError("File is too large. Maximum size is 5MB.");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setImageFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Update handleCrop function:
const handleCrop = async () => {
  if (!cropperRef.current) return;
  const cropper = cropperRef.current.cropper;
  const croppedCanvas = cropper.getCroppedCanvas();
  if (!croppedCanvas) return;

  croppedCanvas.toBlob(async (blob) => {
    if (!blob) return;

    const formData = new FormData();
    formData.append("image", blob, "cropped-image.jpg");

    try {
      const uploadRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData
      );
      setImagePath(uploadRes.data.imageUrl); // Now receives Cloudinary URL
      setImageFile(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading image");
    }
  }, "image/jpeg");
};

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      console.error("Error deleting product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p>Manage products here.</p>

      {/* Error handling */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          {Object.keys(newProduct).map((key) => (
            <input
              key={key}
              type={key === "price" ? "number" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="form-control mb-2"
              value={newProduct[key]}
              onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
              disabled={isLoading}
              step={key === "price" ? "0.01" : undefined}
              min={key === "price" ? "0" : undefined}
            />
          ))}

          <div className="mb-3">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/jpeg,image/png,image/gif,image/webp" 
              className="form-control mb-2" 
              onChange={handleImageChange}
              disabled={isLoading}
            />
            {imageFile && (
              <div>
                <Cropper
                  ref={cropperRef}
                  src={imageFile}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={16 / 9}
                  guides={false}
                  background={false}
                />
                <button 
                  type="button" 
                  className="btn btn-primary mt-2" 
                  onClick={handleCrop}
                  disabled={isLoading}
                >
                  Crop & Upload
                </button>
              </div>
            )}
            {imagePath && <p className="text-success">Image uploaded successfully!</p>}
          </div>

          <button 
            className="btn btn-primary w-100" 
            disabled={isLoading}
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>

      <div>
        <h3>Product List</h3>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Company</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.company}</td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;