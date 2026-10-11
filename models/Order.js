const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },

    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "delivered", "cancelled"],
        default: "pending"
    }

});

module.exports = mongoose.model("Order", orderSchema);