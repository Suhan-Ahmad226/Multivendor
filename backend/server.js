// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./utiles/db");
const http = require("http");
const { Server } = require("socket.io");

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Routes (CommonJS)
const homeRoutes = require("./routes/home/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/order/orderRoutes");
const cardRoutes = require("./routes/home/cardRoutes");
const categoryRoutes = require("./routes/dashboard/categoryRoutes");
const productRoutes = require("./routes/dashboard/productRoutes");
const sellerRoutes = require("./routes/dashboard/sellerRoutes");
const customerAuthRoutes = require("./routes/home/customerAuthRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboard/dashboardRoutes");

// Allowed origins
const allowedOrigins = process.env.MODE === "pro"
  ? [process.env.CLIENT_CUSTOMER_PRODUCTION_URL, process.env.CLIENT_ADMIN_PRODUCTION_URL]
  : ["http://localhost:3000", "http://localhost:3001"];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", cardRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", sellerRoutes);
app.use("/api", customerAuthRoutes);
app.use("/api", chatRoutes);
app.use("/api", paymentRoutes);
app.use("/api", dashboardRoutes);

// Test route
app.get("/", (req, res) => res.send("Hello Server"));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
});

// Socket.IO users
let allCustomer = [];
let allSeller = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
  if (!allCustomer.some((u) => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  if (!allSeller.some((u) => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
};

const findCustomer = (customerId) =>
  allCustomer.find((c) => c.customerId === customerId);
const findSeller = (sellerId) =>
  allSeller.find((s) => s.sellerId === sellerId);
const removeUserBySocket = (socketId) => {
  allCustomer = allCustomer.filter((c) => c.socketId !== socketId);
  allSeller = allSeller.filter((s) => s.socketId !== socketId);
};

io.on("connection", (soc) => {
  console.log("Socket server running...");

  soc.on("add_user", (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
  });

  soc.on("add_seller", (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
  });

  soc.on("send_seller_message", (msg) => {
    const customer = findCustomer(msg.receverId);
    if (customer) soc.to(customer.socketId).emit("seller_message", msg);
  });

  soc.on("send_customer_message", (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) soc.to(seller.socketId).emit("customer_message", msg);
  });

  soc.on("send_message_admin_to_seller", (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) soc.to(seller.socketId).emit("receved_admin_message", msg);
  });

  soc.on("send_message_seller_to_admin", (msg) => {
    if (admin.socketId) soc.to(admin.socketId).emit("receved_seller_message", msg);
  });

  soc.on("add_admin", (adminInfo) => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: soc.id };
    io.emit("activeSeller", allSeller);
  });

  soc.on("disconnect", () => {
    console.log("User disconnected");
    removeUserBySocket(soc.id);
    io.emit("activeSeller", allSeller);
  });
});

// Connect DB & start server
dbConnect();
server.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
