import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("candidate");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // ================= NORMAL LOGIN =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(
                email,
                password
            );

            login(data);

            // Redirect based on role
            if (data.user.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/my-applications");
            }
        } catch (error) {
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
                "http://127.0.0.1:5000/api/auth/google",
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

            login(data);

            // Redirect based on role
            if (data.user.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/my-applications");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ================= GOOGLE LOGIN ERROR =================

    const handleGoogleError = () => {
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

                <div className="form-group">

                    <label htmlFor="role">
                        Select Role
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