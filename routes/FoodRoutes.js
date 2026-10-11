const express = require("express");

const {
    CreateFood,
    GetFoods,
    GetFoodById,
    UpdateFood,
    DeleteFood
} = require("../controllers/FoodController");

const authMiddleware = require("../middleware/AuthMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    CreateFood
);

router.get("/", GetFoods);

router.get("/:id", GetFoodById);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    UpdateFood
);

router.delete(
    "/:id",
    authMiddleware,
    DeleteFood
);

module.exports = router;