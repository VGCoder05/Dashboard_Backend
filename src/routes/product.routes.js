// routes/product.routes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getCategoryList,
  getProductsByCategory,
  addNewProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// --- GET Routes ---

// Route for getting all products and handling queries like limit, skip, etc.
router.get('/', getAllProducts);

// Route for searching products. NOTE: This must come before '/:id'
router.get('/search', searchProducts);

// Route for getting all categories. NOTE: This must come before '/:id'
router.get('/categories', getAllCategories);

// Route for getting the category list. NOTE: This must come before '/:id'
router.get('/category-list', getCategoryList);

// Route for getting products by category. NOTE: This must come before '/:id'
router.get('/category/:categoryName', getProductsByCategory);

// Route for getting a single product by its ID
router.get('/:id', getProductById);


// --- POST, PUT, DELETE Routes ---

// Route for adding a new product (using POST on the base route is RESTful)
router.post('/', addNewProduct);

// Route for updating a product
router.put('/:id', updateProduct);
router.patch('/:id', updateProduct); // Also handle PATCH requests

// Route for deleting a product
router.delete('/:id', deleteProduct);


module.exports = router;