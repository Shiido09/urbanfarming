const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: false
        },
        comment: {
            type: String,
            required: false,
            maxlength: 500
        },
        reviewDate: {
            type: Date,
            required: false
        }
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;