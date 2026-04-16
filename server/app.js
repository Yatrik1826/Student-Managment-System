const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const { clientUrl, nodeEnv } = require("./config/env");

const app = express();

// Allows requests only from your frontend URL.
// credentials: false → cookies/auth headers not allowed.
app.use(
  cors({
    origin: clientUrl,
    credentials: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Student Management Portal API is running."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
