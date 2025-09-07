// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { dbConnect } from "./utiles/db.js"; // ES module style, .js extension
import http from "http";
import { Server } from "socket.io";

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = process.env.MODE === 'pro'
  ? [process.env.CLIENT_CUSTOMER_PRODUCTION_URL, process.env.CLIENT_ADMIN_PRODUCTION_URL]
  : ['http://localhost:3000', 'http://localhost:3001'];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }
});

// Socket.IO users
let allCustomer = [];
let allSeller = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
  if (!allCustomer.some(u => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  if (!allSeller.some(u => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
};

const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);
const findSeller = (sellerId) => allSeller.find(s => s.sellerId === sellerId);
const removeUserBySocket = (socketId) => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller = allSeller.filter(s => s.socketId !== socketId);
};

io.on('connection', (soc) => {
  console.log('Socket server running...');

  soc.on('add_user', (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  soc.on('add_seller', (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  soc.on('send_seller_message', (msg) => {
    const customer = findCustomer(msg.receverId);
    if (customer) soc.to(customer.socketId).emit('seller_message', msg);
  });

  soc.on('send_customer_message', (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) soc.to(seller.socketId).emit('customer_message', msg);
  });

  soc.on('send_message_admin_to_seller', (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) soc.to(seller.socketId).emit('receved_admin_message', msg);
  });

  soc.on('send_message_seller_to_admin', (msg) => {
    if (admin.socketId) soc.to(admin.socketId).emit('receved_seller_message', msg);
  });

  soc.on('add_admin', (adminInfo) => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: soc.id };
    io.emit('activeSeller', allSeller);
  });

  soc.on('disconnect', () => {
    console.log('User disconnected');
    removeUserBySocket(soc.id);
    io.emit('activeSeller', allSeller);
  });
});

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// Routes (ES module style)
import homeRoutes from "./routes/home/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";
import cardRoutes from "./routes/home/cardRoutes.js";
import categoryRoutes from "./routes/dashboard/categoryRoutes.js";
import productRoutes from "./routes/dashboard/productRoutes.js";
import sellerRoutes from "./routes/dashboard/sellerRoutes.js";
import customerAuthRoutes from "./routes/home/customerAuthRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboard/dashboardRoutes.js";

app.use('/api/home', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cardRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', sellerRoutes);
app.use('/api', customerAuthRoutes);
app.use('/api', chatRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardRoutes);

// Test route
app.get('/', (req, res) => res.send('Hello Server'));

// Connect DB & start server
dbConnect();
server.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
