import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useCart } from '../context/CartContext'; 

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar navbar-dark bg-dark p-3">
      <Link to="/" className="navbar-brand">BKart</Link>
      <div className="d-flex align-items-center">
      <Link to="/" className="btn btn-outline-light me-2">Home</Link>
        <Link to="/products" className="btn btn-outline-light me-2">Products</Link>
        <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
       
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Your Cart</Tooltip>}
        >
          <Link to="/cart" className="btn btn-outline-light position-relative">
            <i className="bi bi-cart"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                {cartCount}
              </span>
            )}
          </Link>
        </OverlayTrigger>
      </div>
    </nav>
  );
}

export default Navbar;