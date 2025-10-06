const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const User = require("../models/User");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// ✅ Public upload route for signup (no token required)
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate accessible image URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Just return the URL — don't save to user yet
    res.status(200).json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
