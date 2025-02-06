import mongoose from "mongoose";

// Define the schema for products
const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    category: { 
      type: String, 
      required: true,
      trim: true,
      minlength: [2, 'Category must be at least 2 characters long']
    },
    company: { 
      type: String, 
      required: true,
      trim: true,
      minlength: [2, 'Company must be at least 2 characters long']
    },
    price: { 
      type: Number, 
      required: true,
      min: [0, 'Price must be a positive number']
    },
    description: { 
      type: String, 
      default: '',
      trim: true
    },
    image: { 
      type: String, 
      default: '/uploads/default-product.jpg'
    },
  },
  { timestamps: true }
);

// Create the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;