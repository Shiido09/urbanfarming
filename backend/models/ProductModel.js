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
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalSold: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletionReason: {
        type: String,
        enum: ['expired', 'user_deleted', 'admin_deleted'],
        default: null
    }
});

module.exports = mongoose.model('Product', productSchema);