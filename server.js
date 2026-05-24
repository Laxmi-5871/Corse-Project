require("dotenv").config(); // MUST be first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/upload");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ✅ Serve ALL frontend files from root folder
app.use(express.static(__dirname));

// ===============================
// Debug ENV (temporary check)
// ===============================
console.log("MONGO_URL:", process.env.MONGO_URL);

// ===============================
// MongoDB Connection
// ===============================
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ===============================
// HOME ROUTE (IMPORTANT)
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===============================
// IMAGE UPLOAD ROUTE (Cloudinary)
// ===============================
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "lost-found" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.json({
          imageUrl: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});