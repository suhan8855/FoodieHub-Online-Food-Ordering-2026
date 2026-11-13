const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================
   JSON MIDDLEWARE
========================= */

app.use(express.json());

/* =========================
   HTTP SERVER
========================= */

const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "FoodieHub API is running successfully! 🍔",
  });
});

/* =========================
   API ROUTES
========================= */

app.use(
  "/api/foods",
  foodRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err
    );

    res.status(500).json({
      message:
        "Internal server error",
      error: err.message,
    });
  }
);

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `FoodieHub server running on port ${PORT} 🚀`
  );
});