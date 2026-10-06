import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://jobconnect-7wqo.onrender.com/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("candidate");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    // ================= NORMAL LOGIN =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(
                email,
                password,
                role
            );

            // Login only after backend validates
            // email, password and role
            login(data);

            // Redirect according to actual database role
            if (data.user.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/my-applications");
            }
        } catch (error) {
            // IMPORTANT:
            // Clear any previous candidate/recruiter session
            logout();

            // Show backend error
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ================= GOOGLE LOGIN =================

    const handleGoogleSuccess = async (
        credentialResponse
    ) => {
        try {
            setError("");
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/google`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        credential:
                            credentialResponse.credential,
                        role: role,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Google login failed"
                );
            }

            // Login only after backend validates
            // Google account and selected role
            login(data);

            // Redirect according to actual database role
            if (data.user.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/my-applications");
            }
        } catch (error) {
            // Clear any previous session
            logout();

            // Show Google/role error
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ================= GOOGLE LOGIN ERROR =================

    const handleGoogleError = () => {
        logout();

        setError(
            "Google login failed. Please try again."
        );
    };

    // ================= PAGE =================

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back 👋</h1>

                <p className="auth-subtitle">
                    Login to your JobConnect account
                </p>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* ================= NORMAL LOGIN ================= */}

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* ROLE */}

                    <div className="form-group">

                        <label htmlFor="role">
                            Login As
                        </label>

                        <select
                            id="role"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >
                            <option value="candidate">
                                Candidate
                            </option>

                            <option value="recruiter">
                                Recruiter
                            </option>
                        </select>

                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* ================= DIVIDER ================= */}

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                {/* ================= GOOGLE LOGIN ================= */}

                <h3>Login with Google</h3>

                <p className="auth-subtitle">
                    Select your role before using Google Login
                </p>

                <div className="google-login">

                    <GoogleLogin
                        onSuccess={
                            handleGoogleSuccess
                        }
                        onError={
                            handleGoogleError
                        }
                    />

                </div>

            </div>

        </div>
    );
};

export default Login;