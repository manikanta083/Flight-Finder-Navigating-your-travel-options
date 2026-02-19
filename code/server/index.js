import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User, Booking, Flight } from "./schemas.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// USE PORT FROM .env
const PORT = process.env.PORT || 6001;

// MongoDB connection - using local as default
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flight_booking_db";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    /* ===================== ROUTES ===================== */

    // Health check
    app.get("/", (req, res) => {
      res.send("Backend running successfully");
    });

    // ---------------- AUTH ----------------

    // Register
    app.post("/register", async (req, res) => {
      const { username, email, usertype, password } = req.body;
      let approval = "approved";

      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        if (usertype === "flight-operator") {
          approval = "not-approved";
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          usertype,
          password: hashedPassword,
          approval,
        });

        const userCreated = await newUser.save();
        console.log("User registered:", email);
        res.status(201).json(userCreated);
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
      }
    });

    // Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("User logged in:", email);
        res.json(user);
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
      }
    });

    // ---------------- USERS ----------------

    // Fetch single user
    app.get("/fetch-user/:id", async (req, res) => {
      try {
        const user = await User.findById(req.params.id);
        res.json(user);
      } catch (err) {
        console.error("Fetch user error:", err);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });

    // Fetch all users
    app.get("/fetch-users", async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        console.error("Fetch users error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
      }
    });

    // Approve operator
    app.post("/approve-operator", async (req, res) => {
      const { id } = req.body;
      try {
        const user = await User.findById(id);
        user.approval = "approved";
        await user.save();
        res.json({ message: "approved!" });
      } catch (err) {
        console.error("Approve operator error:", err);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // Reject operator
    app.post("/reject-operator", async (req, res) => {
      const { id } = req.body;
      try {
        const user = await User.findById(id);
        user.approval = "rejected";
        await user.save();
        res.json({ message: "rejected!" });
      } catch (err) {
        console.error("Reject operator error:", err);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // ---------------- FLIGHTS ----------------

    // Fetch all flights
    app.get("/fetch-flights", async (req, res) => {
      try {
        const flights = await Flight.find();
        res.json(flights);
      } catch (err) {
        console.error("Fetch flights error:", err);
        res.status(500).json({ message: "Failed to fetch flights" });
      }
    });

    // Fetch single flight
    app.get("/fetch-flight/:id", async (req, res) => {
      try {
        const flight = await Flight.findById(req.params.id);
        res.json(flight);
      } catch (err) {
        console.error("Fetch flight error:", err);
        res.status(500).json({ message: "Failed to fetch flight" });
      }
    });

    // Add flight
    app.post("/add-flight", async (req, res) => {
      try {
        const userId = req.body.operatorId || req.body.userId;
        const flightData = { ...req.body, operatorId: userId };
        const flight = new Flight(flightData);
        await flight.save();
        res.json({ message: "flight added" });
      } catch (err) {
        console.error("Add flight error:", err);
        res.status(500).json({ message: "Failed to add flight" });
      }
    });

    // Update flight
    app.put("/update-flight", async (req, res) => {
      try {
        await Flight.findByIdAndUpdate(req.body._id, req.body);
        res.json({ message: "flight updated" });
      } catch (err) {
        console.error("Update flight error:", err);
        res.status(500).json({ message: "Failed to update flight" });
      }
    });

    // ---------------- BOOKINGS ----------------

    // Fetch all bookings
    app.get("/fetch-bookings", async (req, res) => {
      try {
        const bookings = await Booking.find();
        res.json(bookings);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });
      }
    });

    // Book ticket
    app.post("/book-ticket", async (req, res) => {
      try {
        const { flight, journeyDate, seatClass, passengers } = req.body;

        const bookings = await Booking.find({
          flight,
          journeyDate,
          seatClass,
        });

        const numBookedSeats = bookings.reduce(
          (acc, booking) => acc + booking.passengers.length,
          0
        );

        const seatCode = {
          economy: "E",
          "premium-economy": "P",
          business: "B",
          "first-class": "A",
        };

        let seats = "";
        const coach = seatCode[seatClass];

        for (let i = numBookedSeats + 1; i <= numBookedSeats + passengers.length; i++) {
          seats += seats ? `, ${coach}-${i}` : `${coach}-${i}`;
        }

        const booking = new Booking({ ...req.body, seats });
        await booking.save();

        res.json({ message: "Booking successful!!" });
      } catch (err) {
        console.error("Book ticket error:", err);
        res.status(500).json({ message: "Booking failed!!" });
      }
    });

    // Cancel ticket
    app.put("/cancel-ticket/:id", async (req, res) => {
      try {
        const booking = await Booking.findById(req.params.id);
        booking.bookingStatus = "cancelled";
        await booking.save();
        res.json({ message: "booking cancelled" });
      } catch (err) {
        console.error("Cancel ticket error:", err);
        res.status(500).json({ message: "Failed to cancel booking" });
      }
    });

    /* ===================== START SERVER ===================== */

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("\nTo fix this:");
    console.log("1. Install MongoDB locally from https://www.mongodb.com/try/download/community");
    console.log("2. Or use MongoDB Atlas and update MONGO_URI in .env file");
    process.exit(1);
  });
