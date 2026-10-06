import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= REGISTER =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await registerUser(
                name,
                email,
                password,
                role
            );

            setSuccess(
                "Registration successful! 🎉"
            );

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Create Account 🚀</h1>

                <p className="auth-subtitle">
                    Join JobConnect today
                </p>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* ================= SUCCESS ================= */}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* ================= REGISTER FORM ================= */}

                <form onSubmit={handleSubmit}>

                    {/* NAME */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

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
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            minLength="6"
                            required
                        />

                    </div>

                    {/* ROLE */}

                    <div className="form-group">

                        <label htmlFor="role">
                            Register As
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

                    {/* BUTTON */}

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* LOGIN LINK */}

                <p className="auth-bottom-text">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
};

export default Register;