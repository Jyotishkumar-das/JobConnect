const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// ================= REGISTER =================

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password",
            });
        }

        // Only allow valid roles
        if (role && !["candidate", "recruiter"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(400).json({
                message: `This email is already registered as ${existingUser.role}. Please use a different email.`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "candidate",
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error.message);

        res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required",
            });
        }

        // Only candidate and recruiter can login
        if (!["candidate", "recruiter"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // IMPORTANT:
        // Check selected login role with database role
        if (user.role !== role) {
            return res.status(403).json({
                message: `This account is registered as ${user.role}. Please select ${user.role} login.`,
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);

        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};

// ================= GOOGLE LOGIN =================

const googleLogin = async (req, res) => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required",
            });
        }

        if (!role || !["candidate", "recruiter"].includes(role)) {
            return res.status(400).json({
                message: "Please select a valid role",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const googleEmail = payload.email;
        const googleName = payload.name;

        if (!googleEmail) {
            return res.status(400).json({
                message: "Google account email not found",
            });
        }

        const normalizedEmail = googleEmail.toLowerCase().trim();

        let user = await User.findOne({
            email: normalizedEmail,
        });

        // Create new Google user
        if (!user) {
            const googlePassword = await bcrypt.hash(
                `${normalizedEmail}${process.env.JWT_SECRET}`,
                10
            );

            user = await User.create({
                name: googleName || "Google User",
                email: normalizedEmail,
                password: googlePassword,
                role: role,
            });
        } else {
            // IMPORTANT:
            // Existing Google account must use the same role
            if (user.role !== role) {
                return res.status(403).json({
                    message: `This Google account is registered as ${user.role}. Please select ${user.role} login.`,
                });
            }
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google Login Error:", error.message);

        res.status(401).json({
            message: "Google authentication failed",
        });
    }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name.trim();

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);

        res.status(500).json({
            message: "Profile update failed",
            error: error.message,
        });
    }
};

// ================= EXPORT =================

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    updateProfile,
};