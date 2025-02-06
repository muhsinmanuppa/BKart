import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaCartPlus } from "react-icons/fa";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="col-md-3 mb-3">
      <div className="card h-100">
        <img 
          src={`${product.image}`} 
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          alt={product.name} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text"><strong>₹{product.price.toFixed(2)}</strong></p>
          <div className="mt-auto d-flex justify-content-between">
            <Link to={`/products/${product._id}`} className="btn btn-outline-primary">
              View Details
            </Link>
            <button 
              onClick={() => addToCart(product)} 
              className="btn btn-primary"
            >
              <FaCartPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
