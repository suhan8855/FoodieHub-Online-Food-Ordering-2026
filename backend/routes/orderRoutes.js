const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

const router = express.Router();

/* =========================
   AUTHENTICATION
========================= */

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId =
      decoded.userId ||
      decoded.id ||
      decoded._id;

    req.userRole = decoded.role;

    if (!req.userId) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/* =========================
   CREATE ORDER
   POST /api/orders
========================= */

router.post("/", protect, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryAddress,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message:
          "Order must contain at least one item",
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.trim()
    ) {
      return res.status(400).json({
        message:
          "Delivery address is required",
      });
    }

    if (
      totalAmount === undefined ||
      Number(totalAmount) <= 0
    ) {
      return res.status(400).json({
        message:
          "Valid total amount is required",
      });
    }

    const order = await Order.create({
      user: req.userId,
      items,
      totalAmount: Number(totalAmount),
      deliveryAddress:
        deliveryAddress.trim(),
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("orderCreated", {
        message:
          "New order has been placed! 📦",
        order,
      });
    }

    res.status(201).json({
      message:
        "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create order",
      error: error.message,
    });
  }
});

/* =========================
   GET ALL ORDERS - ADMIN
   GET /api/orders
========================= */

router.get("/", protect, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({
        message:
          "Only admin can view all orders",
      });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch orders",
      error: error.message,
    });
  }
});

/* =========================
   GET MY ORDERS
   GET /api/orders/my
========================= */

router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userId,
    })
      .populate("items.food")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch orders",
      error: error.message,
    });
  }
});

/* =========================
   GET SINGLE ORDER
   GET /api/orders/:id
========================= */

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("user", "name email")
      .populate("items.food");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderUserId =
      order.user?._id?.toString() ||
      order.user?.toString();

    if (
      orderUserId !== req.userId.toString() &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view this order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(
      "Get single order error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch order",
      error: error.message,
    });
  }
});

/* =========================
   UPDATE ORDER STATUS
   PUT /api/orders/:id/status
========================= */

router.put(
  "/:id/status",
  protect,
  async (req, res) => {
    try {
      if (req.userRole !== "admin") {
        return res.status(403).json({
          message:
            "Only admin can update order status",
        });
      }

      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid order status",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        )
          .populate("user", "name email")
          .populate("items.food");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const io = req.app.get("io");

      if (io) {
        io.emit("orderStatusUpdated", {
          message:
            `Order status changed to ${status}`,
          order,
        });
      }

      res.status(200).json({
        message:
          "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order status",
        error: error.message,
      });
    }
  }
);

/* =========================
   DELETE ORDER - ADMIN
========================= */

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      if (req.userRole !== "admin") {
        return res.status(403).json({
          message:
            "Only admin can delete orders",
        });
      }

      const deletedOrder =
        await Order.findByIdAndDelete(
          req.params.id
        );

      if (!deletedOrder) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const io = req.app.get("io");

      if (io) {
        io.emit("orderDeleted", {
          message:
            "An order was deleted",
          orderId: deletedOrder._id,
        });
      }

      res.status(200).json({
        message:
          "Order deleted successfully",
        order: deletedOrder,
      });
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete order",
        error: error.message,
      });
    }
  }
);

module.exports = router;