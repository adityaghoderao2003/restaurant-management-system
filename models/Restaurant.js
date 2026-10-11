const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    image: {
        type: String
    }

});

module.exports = mongoose.model("Restaurant", restaurantSchema);