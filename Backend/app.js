require("dotenv").config(); // Load environment variables at the start

const express = require("express");
const mongoose = require("mongoose");
const Teacher = require("./models/teachers");
const User = require("./models/user");
const Meeting = require("./models/meeting");
const Booking = require("./models/booking");
const bodyParser = require("body-parser");
const cors = require("cors");
const { TeacherSchemaJoi } = require("./Schema");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const data = require("./data");
const { upload } = require("./cloudConfig");
const Review = require("./models/review");
const History = require("./models/history");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.use(express.json());

//socket io
const http = require("http");
const { connectToSocket } = require("./videoModule");

const server = http.createServer(app); //main server
const io = connectToSocket(server); //joining socket server and main server together

app.set("port", process.env.PORT || 3000);

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/scholar");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
main();

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session handling
app.use(
  session({
    secret: "sessionPassword",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Routes

// Get a single teacher by user ID
app.get("/api/teachers/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const teacher = await Teacher.findOne({ teacherId: userId });
    console.log("Teacher data:", teacher);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Error fetching teacher" });
  }
});

// Sign up route
app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    await User.register(user, password);
    req.login(user, (err) => {
      if (err) return next(err);
      console.log("Session after signup:", req.session);
      res
        .status(201)
        .json({ message: "Signup successful, user logged in", user });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Session after login:", req.session);
  console.log("User info after login:", req.user);
  res.json({
    message: "Login successful",
    user: req.user,
  });
});

// Logout route
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Auth status check
app.get("/api/auth/status", (req, res) => {
  console.log("Auth status:", req.isAuthenticated());
  console.log("USER IN SESSION:", req.user);
  console.log("USER IN SESSION id:", req.user._id);
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

//Be a teacher
app.post("/beteacher", upload.single("profilePic"), async (req, res) => {
  try {
    console.log("REQUEST BODY OF TEACHER:", req.body);
    console.log("USER IN SESSION ID:", req.user._id);
    const { error } = TeacherSchemaJoi.validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details);
      return res.status(400).json({ message: error.details[0].message });
    }
    const userId = req.user._id;
    const teacherData = {
      teacherId: userId,
      ...req.body,
      profilePic: req.file
        ? {
            url: req.file.path,
            filename: req.file.filename,
          }
        : null,
    };
    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();
    res
      .status(201)
      .json({ message: "Teacher created successfully", teacher: newTeacher });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Failed to create Teacher" });
  }
});

// Get a single teacher
app.get("/teachers/:id/show", async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id)
      .populate("teacherId", "email")
      .exec();
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    console.error("Fetch teacher error:", error);
    res.status(500).json({ message: "Error fetching teacher" });
  }
});

// Get edit form data
app.get("/teachers/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    console.log("taecher to edit",teacher);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    console.error("Fetch teacher edit data error:", error);
    res.status(500).json({ message: "Error fetching teacher" });
  }
});

// Edit a single teacher
app.patch(
  "/teachers/:id/edit",
  upload.single("profilePic"),
  async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // Check if a new profile picture was uploaded
    if (req.file) {
      updatedData.profilePic = {
        url: req.file.path,
        filename: req.file.filename,
      };
    } else {
      // If no new picture was uploaded, retain the old profile picture
      const existingTeacher = await Teacher.findById(id);
      if (existingTeacher) {
        updatedData.profilePic = existingTeacher.profilePic; // Retain the old profile pic
      }
    }
    try {
      const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!updatedTeacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res
        .status(200)
        .json({ message: "Teacher updated successfully", updatedTeacher });
    } catch (err) {
      console.error("Update teacher error:", err);
      res
        .status(500)
        .json({ message: "An error occurred while updating the teacher" });
    }
  }
);

// Delete a teacher
app.delete("/teachers/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteData = await Teacher.deleteOne({ _id: id });
    console.log(deleteData);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: "Error deleting teacher" });
  }
});

//Get all teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers);
  } catch (error) {
    console.error("Fetch teachers error:", error);
    res.status(500).json({ message: "Error fetching teachers" });
  }
});

// In your backend (Node.js/Express example)
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers); // Send the list of teachers
  } catch (err) {
    res.status(500).send("Error fetching teachers");
  }
});

//user delete and teacher
app.delete("/user/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the user
    const deleteUser = await User.deleteOne({ _id: id });
    if (deleteUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Delete the associated teacher record
    const deleteTeacher = await Teacher.deleteOne({ teacherId: id });
    if (deleteTeacher.deletedCount === 0) {
      console.warn("Associated teacher not found or already deleted.");
    }
    res
      .status(200)
      .json({ message: "User and associated teacher deleted successfully" });
  } catch (error) {
    console.error("Delete User error:", error);
    res
      .status(500)
      .json({ message: "Error deleting User and/or associated teacher" });
  }
});


//Boooking session
app.post("/book-session", async (req, res) => {
  const { teacherId, studentId, date, time, userName, teacherName, price } =
    req.body; // Include price here
  if (
    !teacherId ||
    !studentId ||
    !date ||
    !time ||
    !userName ||
    !teacherName ||
    !price
  ) {
    // Check for price
    console.error("Missing required fields:", req.body);
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    if (
      !mongoose.Types.ObjectId.isValid(teacherId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid teacherId or studentId" });
    }

    const newBooking = new Booking({
      userId: studentId,
      userName: userName,
      price: price, // Now using the price from the request
      teacherId,
      teacherName,
      date: new Date(date),
      time,
    });

    await newBooking.save();

    console.log("Booking successful:", newBooking);
    res
      .status(200)

      .json({ message: "Session booked successfully", booking: newBooking });
  } catch (error) {
    console.error("Error booking session:", error.message);
    res
      .status(500)
      .json({ message: "Failed to book session", error: error.message });
  }
});

app.get("/api/bookings", async (req, res) => {
  console.log("BOOKING API IS TRIGIRRED");
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: "Invalid Teacher ID format" });
    }

    const bookings = await Booking.find({
      teacherId: new mongoose.Types.ObjectId(teacherId),
    });
    console.log(bookings);

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get specific booking
app.get("/api/get-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/approve/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking confirmed", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/cancel/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const historyEntry = new History({
      teacherName: booking.teacherName,
      teacherId: booking.teacherId,
      userId: booking.userId,
      time: booking.time,
      username: booking.userName,
      date: booking.date,
      meetingCode: booking.meetingCode,
      status: "canceled",
    });

    await historyEntry.save();

    booking.status = "cancelled";
    const updatedBooking = await booking.save();

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking update failed" });
    }

    await Booking.deleteOne({ _id: bookingId });

    res.json({
      message: "Booking canceled and moved to history.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while canceling the booking." });
  }
});

app.get("/api/bookings/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/sendMeetingCode/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  const { meetingCode } = req.body;

  try {
    if (!meetingCode) {
      return res.status(400).json({ message: "Meeting code is required." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { meetingCode },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({
      message: "Meeting code updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating meetingCode:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

//reviews

app.post("/api/reviews", async (req, res) => {
  console.log("Review route is trigerred");
  const { userId, username, profilePic, teacherId, review, rating } = req.body;

  if (!userId || !username || !teacherId || !review || rating === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReview = new Review({
      userId,
      username,
      profilePic,
      teacherId,
      review,
      rating: rating,
    });

    await newReview.save();
    console.log("Review submitted:", newReview);
    res
      .status(201)
      .json({ message: "Review submitted successfully", data: newReview });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this teacher" });
    }
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const { teacherId } = req.query;

    const reviews = await Review.find({ teacherId })
      .populate("userId", "username profilePic") // Populate user info
      .exec(); // No population for teacherId

    console.log(reviews);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err });
  }
});

//All meeting history
app.get("/get_all_activity", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const user = await User.findById(req.user.id);
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
});

app.post("/add_to_activity", async (req, res) => {
  const { meeting_code } = req.body;
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    // Create a new meeting record for the authenticated user
    const newMeeting = new Meeting({
      user_id: req.user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(201).json({ message: "Added code to history" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
});

//Specific teacher history
app.put("/api/meetingDone/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    // Create a copy of the booking and store it in History
    const historyEntry = new History({
      teacherId: booking.teacherId,
      teacherName: booking.teacherName,
      userId: booking.userId,
      username: booking.userName,
      time: booking.time,
      date: booking.date,
      meetingCode: booking.meetingCode, // Only store meetingCode if it was added
      status: "completed", // Mark as completed in history
    });

    await historyEntry.save(); // Save to History schema

    // Remove the booking from the bookings collection
    await Booking.deleteOne({ _id: bookingId });

    res.json({ message: "Booking marked as done and moved to history." });
  } catch (error) {
    res.status(500).send("Error processing the meeting: " + error.message);
  }
});

app.get("/api/history/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log(teacherId);
    const historyData = await History.find({ teacherId }).sort({
      updatedAt: -1,
    });

    if (historyData.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this teacher." });
    }
    res.json(historyData);
  } catch (error) {
    console.error("Error fetching teacher history:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching teacher history." });
  }
});
app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const historyData = await History.find({ userId }).sort({ updatedAt: -1 });
    if (historyData.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this user." });
    }
    console.log(historyData);
    res.json(historyData);
  } catch (error) {
    console.error("Error fetching user history:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user history." });
  }
});

//payment

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    const product = products[0];

    // Find the teacher using teacherId
    const teacher = await Teacher.findOne({ teacherId: product.teacherId });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Extract the teacher's _id from the document
    const teacherObjectId = teacher._id;

    const lineItem = {
      price_data: {
        currency: product.currency,
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // Convert to smallest currency unit
      },
      quantity: 1,
    };

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode: "payment",
      success_url: `http://localhost:5173/teachers/${teacherObjectId}/show?session_id={CHECKOUT_SESSION_ID}&status=success&bookingId=${product.bookingId}`, // Correctly pass bookingId
      cancel_url: `http://localhost:5173/teachers/${teacherObjectId}/show?status=failure&bookingId=${product.bookingId}`,
    });

    // Respond with the session ID
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Server setup
server.listen(app.get("port"), () => {
  console.log("Server is running on port " + app.get("port"));
});
