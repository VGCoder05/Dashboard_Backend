// controllers/product.controller.js

const axios = require('axios');

const API_BASE_URL = 'https://dummyjson.com/products';

// Helper function for consistent error handling
const handleError = (res, error) => {
  console.error(error);
  const status = error.response ? error.response.status : 500;
  const message = error.response ? error.response.data.message : 'Internal Server Error';
  res.status(status).json({ message });
};

/**
 * @desc    Get all products with pagination, sorting, and selection
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    // Pass along any query parameters from the client to the dummyjson API
    const response = await axios.get(API_BASE_URL, {
      params: req.query, // e.g., limit, skip, select, sortBy, order
    });
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Search for products
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query "q" is required.' });
    }
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q },
    });
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Get all product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getAllCategories = async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Get product category list (different endpoint from docs)
 * @route   GET /api/products/category-list
 * @access  Public
 */
const getCategoryList = async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category-list`);
      res.status(200).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  };

/**
 * @desc    Get all products in a specific category
 * @route   GET /api/products/category/:categoryName
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const response = await axios.get(`${API_BASE_URL}/category/${categoryName}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Add a new product (simulated)
 * @route   POST /api/products
 * @access  Public
 */
const addNewProduct = async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    // The dummy API returns the new product, we send it back with a 201 status
    res.status(201).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Update a product (simulated)
 * @route   PUT /api/products/:id
 * @access  Public
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${API_BASE_URL}/${id}`, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc    Delete a product (simulated)
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getCategoryList,
  getProductsByCategory,
  addNewProduct,
  updateProduct,
  deleteProduct,
};