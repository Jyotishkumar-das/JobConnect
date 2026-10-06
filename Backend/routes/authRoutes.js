const express = require("express");

const {
    registerUser,
    loginUser,
    googleLogin,
    updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ================= REGISTER =================

router.post("/register", registerUser);

// ================= LOGIN =================

router.post("/login", loginUser);

// ================= GOOGLE LOGIN =================

router.post("/google", googleLogin);

// ================= PROTECTED PROFILE =================

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You are authorized!",
        user: req.user,
    });
});

// ================= UPDATE PROFILE =================

router.put("/profile", protect, updateProfile);

module.exports = router;