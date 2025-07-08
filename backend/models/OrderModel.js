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
        },
        price: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        fee: {
            type: Number,
            required: true,
            default: 0
        },
        address: {
            fullName: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: {
            type: String,
            enum: ['cod', 'ewallet'],
            required: true,
            default: 'cod'
        },
        ewalletDetails: {
            ewalletId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'EWallet',
                required: function() {
                    return this.paymentMethod.type === 'ewallet';
                }
            },
            accountNumber: {
                type: String,
                required: function() {
                    return this.paymentMethod.type === 'ewallet';
                }
            },
            ewalletType: {
                type: String,
                enum: ['gcash', 'paypal', 'bdo', 'paymaya', 'unionbank', 'bpi'],
                required: function() {
                    return this.paymentMethod.type === 'ewallet';
                }
            }
        }
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;