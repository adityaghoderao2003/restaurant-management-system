const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");


// Create Food
const CreateFood = async (req, res) => {

    try {

        if (req.user.role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Only restaurant users can create food"
            });
        }

        const {
            name,
            description,
            price,
            category,
            restaurant
        } = req.body;

        if (!name || !description || !price || !category || !restaurant) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const restaurantData = await Restaurant.findById(restaurant);

        if (!restaurantData) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        if (restaurantData.owner != req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to add food to this restaurant"
            });
        }

        const food = await Food.create({
            name: name,
            description: description,
            price: price,
            category: category,
            restaurant: restaurant,
            image: req.file ? req.file.path : ""
        });

        res.status(201).json({
            success: true,
            message: "Food created successfully",
            food: food
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Get Foods
const GetFoods = async (req, res) => {

    try {

        const {
            search,
            category,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        const query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        let sortOption = {};

        if (sort === "asc") {
            sortOption.price = 1;
        } else if (sort === "desc") {
            sortOption.price = -1;
        }

        const foods = await Food.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalFoods = await Food.countDocuments(query);

        res.status(200).json({
            success: true,
            totalFoods: totalFoods,
            currentPage: Number(page),
            totalPages: Math.ceil(totalFoods / limit),
            foods: foods
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Get Food By ID
const GetFoodById = async (req, res) => {

    try {

        const { id } = req.params;

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        res.status(200).json({
            success: true,
            food: food
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Update Food
const UpdateFood = async (req, res) => {

    try {

        const { id } = req.params;

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        const restaurant = await Restaurant.findById(food.restaurant);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        if (req.user.role === "admin") {

        } else if (req.user.role === "restaurant") {

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this food"
                });
            }

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to update food"
            });

        }

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: req.file ? req.file.path : food.image
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Food updated successfully",
            food: updatedFood
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


// Delete Food
const DeleteFood = async (req, res) => {

    try {

        const { id } = req.params;

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        const restaurant = await Restaurant.findById(food.restaurant);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        if (req.user.role === "admin") {

        } else if (req.user.role === "restaurant") {

            if (restaurant.owner != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to delete this food"
                });
            }

        } else {

            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete food"
            });

        }

        await Food.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Food deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


module.exports = {
    CreateFood,
    GetFoods,
    GetFoodById,
    UpdateFood,
    DeleteFood
};