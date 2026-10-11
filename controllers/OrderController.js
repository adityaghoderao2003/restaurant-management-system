const Order = require("../models/Order");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");


// Create Order
const CreateOrder = async (req, res) => {

    try {

        if (req.user.role !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Only customers can place orders"
            });
        }

        const {
            food,
            quantity
        } = req.body;

        if (!food || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Food and quantity are required"
            });
        }

        const foodData = await Food.findById(food);

        if (!foodData) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        const totalAmount = foodData.price * quantity;

        const order = await Order.create({
            customer: req.user.id,
            restaurant: foodData.restaurant,
            food: food,
            quantity: quantity,
            totalAmount: totalAmount
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Get Orders
const GetOrders = async (req, res) => {

    try {

        let query = {};

        if (req.user.role === "customer") {

            query.customer = req.user.id;

        } else if (req.user.role === "restaurant") {

            const restaurants = await Restaurant.find({
                owner: req.user.id
            }).select("_id");

            query.restaurant = {
                $in: restaurants
            };

        } else if (req.user.role === "admin") {

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to view orders"
            });

        }

        const orders = await Order.find(query)
            .populate("customer", "name email")
            .populate("restaurant", "name")
            .populate("food", "name price");

        res.status(200).json({
            success: true,
            orders: orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Get Order By ID
const GetOrderById = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("customer", "name email")
            .populate("restaurant", "name")
            .populate("food", "name price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (req.user.role === "admin") {

        } else if (req.user.role === "customer") {

            if (order.customer._id != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to view this order"
                });
            }

        } else if (req.user.role === "restaurant") {

            const restaurant = await Restaurant.findById(order.restaurant._id);

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: "Restaurant not found"
                });
            }

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to view this order"
                });
            }

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this order"
            });

        }

        res.status(200).json({
            success: true,
            order: order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Update Order Status
const UpdateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (req.user.role === "admin") {

        } else if (req.user.role === "restaurant") {

            const restaurant = await Restaurant.findById(order.restaurant);

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: "Restaurant not found"
                });
            }

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this order"
                });
            }

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to update order status"
            });

        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                status: status
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Delete Order
const DeleteOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (req.user.role === "admin") {

        } else if (req.user.role === "customer") {

            if (order.customer != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to delete this order"
                });
            }

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete order"
            });

        }

        await Order.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


module.exports = {
    CreateOrder,
    GetOrders,
    GetOrderById,
    UpdateOrderStatus,
    DeleteOrder
};