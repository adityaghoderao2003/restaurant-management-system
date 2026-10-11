const express = require("express");

const {
    CreateRestaurant,
    GetRestaurants,
    GetRestaurantById,
    UpdateRestaurant,
    DeleteRestaurant
} = require("../controllers/RestaurantController");

const authMiddleware = require("../middleware/AuthMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    CreateRestaurant
);

router.get("/", GetRestaurants);

router.get("/:id", GetRestaurantById);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    UpdateRestaurant
);

router.delete(
    "/:id",
    authMiddleware,
    DeleteRestaurant
);

module.exports = router;