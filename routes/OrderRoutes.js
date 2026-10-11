const express = require("express");

const {
    CreateOrder,
    GetOrders,
    GetOrderById,
    UpdateOrderStatus,
    DeleteOrder
} = require("../controllers/OrderController");

const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/", authMiddleware, CreateOrder);
router.get("/", authMiddleware, GetOrders);
router.get("/:id", authMiddleware, GetOrderById);
router.put("/:id", authMiddleware, UpdateOrderStatus);
router.delete("/:id", authMiddleware, DeleteOrder);

module.exports = router;