import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    clearCart 
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    place: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.mobile || !formData.address || !formData.place) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    setIsCheckingOut(false);
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">
          Your cart is empty.
          <Link to="/products" className="btn btn-primary ms-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {orderPlaced && (
        <div className="alert alert-success text-center">
          <h4>Order Placed Successfully!</h4>
          <p>Delivery expected: 2 hours (within 10 km) or 1 day</p>
          <p>Contact: 999666111</p>
          <button 
            onClick={() => {
              setOrderPlaced(false);
              window.location.href = '/products';
            }} 
            className="btn btn-primary"
          >
            Shop Again
          </button>
        </div>
      )}

      <h2>Your Cart</h2>
      
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div key={item._id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Price: ₹{item.price.toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="d-flex justify-content-between mt-3">
            <button 
              className="btn btn-danger"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <h3>Total: ₹{cartTotal.toFixed(2)}</h3>
              
              {!isCheckingOut ? (
                <button 
                  className="btn btn-success w-100 mt-3"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="mt-3">
                  <h5>Checkout</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="mb-2">
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        required 
                      />
                    </div>
                    <div className="mb-2">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Place"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="mb-2">
                      <textarea 
                        className="form-control" 
                        placeholder="Delivery Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      ></textarea>
                    </div>
                    <div className="mb-2">
                      <strong>Payment:</strong> Cash on Delivery
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Place Order
                    </button>
                    <button 
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={() => setIsCheckingOut(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;