const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);

// Protected routes (require authentication)
router.use(authenticateUser);

// User's own products (must come before /:id route)
router.get('/my-products', productController.getMyProducts);

// Other protected routes
router.get('/:id', productController.getProductById);

// Create product with image upload
router.post('/', upload.array('productimage', 5), productController.createProduct);

// Update product with optional image upload
router.put('/:id', upload.array('productimage', 5), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
