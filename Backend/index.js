require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ GLOBAL ERROR HANDLERS ------------------ */
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED PROMISE:", err);
});

/* ------------------ DEBUG LOGGER (VERY HELPFUL) ------------------ */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ------------------ ensure tempUploads folder exists ------------------ */
const tempUploadDir = path.join(__dirname, "tempUploads");
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir);
  console.log("📂 Created tempUploads directory:", tempUploadDir);
}

/* ------------------ MIDDLEWARES ------------------ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ STATIC ------------------ */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------ ROUTES ------------------ */
app.use("/interview", require("./routes/interview"));
app.use("/oa", require("./routes/oa"));
app.use("/mockInterview", require("./routes/mockInterview"));
app.use("/ai", require("./routes/aiRoutes"));
app.use(require("./routes/analyzeResumePdf"));
app.use("/interview-goal", require("./routes/interviewGoalRoutes"));

/* ------------------ TEST ROUTE ------------------ */
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

/* ------------------ START SERVER ONLY AFTER DB CONNECTS ------------------ */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on https://ai-powered-mock-interiview-3.onrender.com/`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });