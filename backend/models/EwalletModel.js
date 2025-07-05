const mongoose = require('mongoose');

const EwalletSchema = new mongoose.Schema({

    AccountNumer: {
        type: String,
        required: true,
        unique: true
    },
    AccountHolderName: {
        type: String,
        required: true
    },
    AccountBalance: {
        type: Number,
        default: 0
    },
    EwalletType:{
        type: String,
        enum: ['gcash', 'paypal','bdo','paymaya','unionbank', 'bpi'],
        required: true
    }

});