import express from "express";
import config from "./config.js";
import cors from "cors";
import mongoose from "mongoose";

//importing the routes
import customerRoutes from "./routes/CustomerRoutes.js";
import vendorRoutes from "./routes/VendorRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import serviceRoutes from "./routes/ServiceRoutes.js";
import feedbackRoutes from "./routes/FeedbackRoutes.js";
import teamRoutes from "./routes/TeamRoutes.js";
import serviceTypeRoutes from "./routes/ServiceTypeRoutes.js";
import aboutRoutes from "./routes/AboutRoutes.js";
import imagesRoutes from "./routes/ImagesRoutes.js"
import reviewsRoutes from "./routes/ReviewsRoutes.js";
import auth from "./middleware/auth.js";
import adminRoutes from "./routes/AdminRoutes.js";
import http, { createServer } from "http";
import { Server } from "socket.io";;
import billRoutes from "./routes/BillRoutes.js";

// Creating the app
const app = express();

// Defining the port
const port = config.PORT;

//Middleware for the app
app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

// for web socket
const server = http.createServer(app);

mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/makemywedding', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket.io connection for notifications
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    // console.log(data, "data", `${socket.id}`);
    io.emit("receive_message", data);
  });

  socket.on("book_message", (data) => {
    io.emit("receive_book_message", data);
  });

  socket.on("payment_message", (data) => {
    // console.log(data,"data")
    io.emit("receive_payment_message", data);
  });

  
  socket.on("cancel_message", (data) => {
    // console.log(data, "data", `${socket.id}`);
    io.emit("receive_cancel_message", data);
  });

  socket.on("vendor_cancel_booking", (data) => {
    // console.log(data, "vendor_cancel_booking", `${socket.id}`);

    io.emit("receive_vendor_cancel", data);
  });

  socket.on("vendor_selected_booking", (data) => {
    // console.log(data, "vendor_cancel_booking", `${socket.id}`);

    io.emit("receive_vendor_selected", data);
  });

  socket.on(" disconnect ", function () {
    console.log(" user disconnected ");
  });
});

if (config.PRODUCTION === "true") {
  // using the routes as middlware
  app.use("/api/v1/vendors", auth.tokenCheck, vendorRoutes);
  app.use("/api/v1/orders", auth.tokenCheck, orderRoutes);
  app.use("/api/v1/customers", auth.tokenCheck, customerRoutes);
  app.use("/api/v1/services", auth.tokenCheck, serviceRoutes);
  app.use("/api/v1/feedbacks", auth.tokenCheck, feedbackRoutes);
  app.use("/api/v1/teams", auth.tokenCheck, teamRoutes);
  app.use("/api/v1/serviceType", auth.tokenCheck, serviceTypeRoutes);
  app.use("/api/v1/about", auth.tokenCheck, aboutRoutes);
  app.use("/api/v1/images", imagesRoutes);
  app.use("/api/v1/reviews", auth.tokenCheck, reviewsRoutes);
  app.use("/api/v1/admin", auth.tokenCheck, adminRoutes);
  app.use("/api/v1/bills", auth.tokenCheck, billRoutes);
} else {
  app.use("/api/v1/vendors", vendorRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/customers", customerRoutes);
  app.use("/api/v1/services", serviceRoutes);
  app.use("/api/v1/feedbacks", feedbackRoutes);
  app.use("/api/v1/teams", teamRoutes);
  app.use("/api/v1/serviceType", serviceTypeRoutes);
  app.use("/api/v1/about", aboutRoutes);
  app.use("/api/v1/images", imagesRoutes);
  app.use("/api/v1/reviews", reviewsRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1/bills", billRoutes);
}

//endpoint for deauthenticating user - logout
app.post("/logout", (req, res) => {
  try {
    if (req.user) {
      req.user = undefined;
    }
    return res.status(200).send({
      msg: "Logged out successfully , hope you found what you are searching!!!!",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});
