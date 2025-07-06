const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productimage: [
    {
        public_id: {
        type: String,
        required: false,
        },
        url: {
        type: String,
        required: false,
        }
    }
    ],
    productCategory: {
        type: String,
        required: true
    },
    productStock: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    productExpiryDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);