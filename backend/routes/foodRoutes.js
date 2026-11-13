const express = require("express");
const Food = require("../models/Food");

const router = express.Router();

// GET all foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    console.error("Get foods error:", error);

    res.status(500).json({
      message: "Failed to fetch foods",
      error: error.message,
    });
  }
});

// GET single food
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    console.error("Get single food error:", error);

    res.status(500).json({
      message: "Failed to fetch food",
      error: error.message,
    });
  }
});

// POST create food
router.post("/", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Food name is required",
      });
    }

    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        message: "Food category is required",
      });
    }

    const food = await Food.create({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
    });

    // Socket.IO notification
    const io = req.app.get("io");

    if (io) {
      io.emit("foodCreated", {
        message: `New food item "${food.name}" was added!`,
        food,
      });
    }

    res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.error("Create food error:", error);

    res.status(500).json({
      message: "Failed to create food",
      error: error.message,
    });
  }
});

// PUT update food
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        price: Number(price),
        category: category?.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFood) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // Socket.IO notification
    const io = req.app.get("io");

    if (io) {
      io.emit("foodUpdated", {
        message: `Food item "${updatedFood.name}" was updated!`,
        food: updatedFood,
      });
    }

    res.status(200).json({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Update food error:", error);

    res.status(500).json({
      message: "Failed to update food",
      error: error.message,
    });
  }
});

// DELETE food
router.delete("/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // Socket.IO notification
    const io = req.app.get("io");

    if (io) {
      io.emit("foodDeleted", {
        message: `Food item "${deletedFood.name}" was deleted!`,
        food: deletedFood,
      });
    }

    res.status(200).json({
      message: "Food deleted successfully",
      food: deletedFood,
    });
  } catch (error) {
    console.error("Delete food error:", error);

    res.status(500).json({
      message: "Failed to delete food",
      error: error.message,
    });
  }
});

module.exports = router;