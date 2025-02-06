import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch product details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
  if (!product) return <div className="text-center mt-5 alert alert-warning">Product not found</div>;

  return (
    <div className="container mt-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img 
            src={`${product.image}`}
            className="img-fluid rounded shadow-sm"
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted">Category: <strong>{product.category}</strong></p>
          <p className="text-muted">Brand: <strong>{product.company}</strong></p>
          <p>{product.description}</p>
          <h3 className="text-primary">₹{product.price.toFixed(2)}</h3>

          {/* Stock Availability */}
          {product.stock > 0 ? (
            <span className="badge bg-success p-2 mb-3">In Stock</span>
          ) : (
            <span className="badge bg-danger p-2 mb-3">Out of Stock</span>
          )}

          {/* Add to Cart Button */}
          <div className="mt-3">
            <button 
              onClick={() => addToCart(product)}
              className="btn btn-primary btn-lg"
              disabled={product.stock === 0}
            >
              <FaShoppingCart className="me-2" /> Add to Cart
            </button>
            <Link to="/products" className="btn btn-outline-secondary btn-lg ms-3">
              <FaArrowLeft className="me-2" /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
