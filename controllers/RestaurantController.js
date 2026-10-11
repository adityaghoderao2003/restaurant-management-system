const Restaurant = require("../models/Restaurant");

const CreateRestaurant = async (req, res) => {

    try {

        if (req.user.role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Only restaurant users can create restaurant"
            });
        }

        const {
            name,
            address,
            phone,
            image
        } = req.body;

        if (!name || !address || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const restaurant = await Restaurant.create({
            name: name,
            address: address,
            phone: phone,
            image: req.file ? req.file.path : "",
            owner: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            restaurant
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const GetRestaurants = async (req, res) => {
    try {
        const {
            search,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        const query = {};

        // Search by restaurant name
        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Sort
        let sortOption = {};

        if (sort === "asc") {
            sortOption.name = 1;
        } else if (sort === "desc") {
            sortOption.name = -1;
        }

        const restaurants = await Restaurant.find(query)
            .populate("owner", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalRestaurants = await Restaurant.countDocuments(query);

        res.status(200).json({
            success: true,
            totalRestaurants: totalRestaurants,
            currentPage: Number(page),
            totalPages: Math.ceil(totalRestaurants / limit),
            restaurants: restaurants
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const UpdateRestaurant = async (req, res) => {

    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        // Admin can update any restaurant
        if (req.user.role === "admin") {

        }
        // Restaurant owner can update only their own restaurant
        else if (req.user.role === "restaurant") {

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this restaurant"
                });
            }
        }
        // Customer cannot update
        else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to update restaurant"
            });

        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                image: req.body.image
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            restaurant: updatedRestaurant
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const DeleteRestaurant = async (req, res) => {

    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        // Admin can delete any restaurant
        if (req.user.role === "admin") {

        }
        // Restaurant owner can delete only their own restaurant
        else if (req.user.role === "restaurant") {

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to delete this restaurant"
                });
            }

        }
        // Customer cannot delete
        else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete restaurant"
            });

        }

        await Restaurant.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const GetRestaurantById = async (req, res) => {

    try {

        const { id } = req.params;

        const restaurant = await Restaurant.findById(id)
            .populate("owner", "name email");

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            restaurant: restaurant
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    CreateRestaurant, GetRestaurants, UpdateRestaurant, DeleteRestaurant, GetRestaurantById
};