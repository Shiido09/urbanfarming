const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// Create new order from cart
const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            shippingAddress,
            shippingFee = 0,
            paymentMethod = { type: 'cod' }
        } = req.body;

        // Get user's cart and populate ewallets for payment validation
        const user = await User.findById(userId)
            .populate({
                path: 'cart.product',
                select: 'productName productPrice productStock'
            })
            .populate('ewallets');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate shipping address (removed postalCode validation)
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phoneNumber || 
            !shippingAddress.address || !shippingAddress.city) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required'
            });
        }

        // Validate payment method
        if (paymentMethod.type === 'ewallet') {
            if (!paymentMethod.ewalletDetails || !paymentMethod.ewalletDetails.ewalletId) {
                return res.status(400).json({
                    success: false,
                    message: 'E-wallet details are required for e-wallet payment'
                });
            }

            // Check if the ewallet belongs to the user
            const userEwallet = user.ewallets.find(ewallet => 
                ewallet._id.toString() === paymentMethod.ewalletDetails.ewalletId
            );

            if (!userEwallet) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected e-wallet is not linked to your account'
                });
            }

            // Update payment method with ewallet details
            paymentMethod.ewalletDetails.accountNumber = userEwallet.AccountNumer;
            paymentMethod.ewalletDetails.ewalletType = userEwallet.EwalletType;
        }

        // Check product availability and calculate totals
        let subtotal = 0;
        const orderProducts = [];

        for (const cartItem of user.cart) {
            const product = cartItem.product;
            
            // Check if product exists and has enough stock
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more products in cart no longer exist'
                });
            }

            if (product.productStock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.productName}. Available: ${product.productStock}, Requested: ${cartItem.quantity}`
                });
            }

            const itemTotal = product.productPrice * cartItem.quantity;
            subtotal += itemTotal;

            orderProducts.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.productPrice
            });
        }

        const totalAmount = subtotal + shippingFee;

        // Create order
        const order = new Order({
            user: userId,
            products: orderProducts,
            subtotal: subtotal,
            shipping: {
                fee: shippingFee,
                address: shippingAddress
            },
            totalAmount: totalAmount,
            paymentMethod: paymentMethod
        });

        const savedOrder = await order.save();

        // Update product stock and clear user's cart
        for (const cartItem of user.cart) {
            await Product.findByIdAndUpdate(
                cartItem.product._id,
                { $inc: { productStock: -cartItem.quantity, totalSold: cartItem.quantity } }
            );
        }

        // Clear user's cart
        user.cart = [];
        await user.save();

        // Populate the saved order with product details
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate({
                path: 'products.product',
                select: 'productName productPrice productimage'
            })
            .populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: populatedOrder
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating order'
        });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate({
                path: 'products.product',
                select: 'productName productPrice productimage'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders'
        });
    }
};

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate({
                path: 'products.product',
                select: 'productName productPrice productimage productCategory'
            })
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching order'
        });
    }
};

// Update order status (for admins or order processing)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingNumber } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const updateData = { orderStatus: status };
        if (trackingNumber && status === 'shipped') {
            updateData['shipping.courier.trackingNumber'] = trackingNumber;
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate({
            path: 'products.product',
            select: 'productName productPrice productimage'
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating order status'
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};
