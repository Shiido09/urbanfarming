const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateUser);

// Create order from cart
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/my-orders', orderController.getUserOrders);

// Get single order by ID
router.get('/:orderId', orderController.getOrderById);

// Update order status (admin only for now, but could be expanded)
router.put('/:orderId/status', authorizeAdmin, orderController.updateOrderStatus);

module.exports = router;
