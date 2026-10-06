import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <nav className="navbar modern-navbar">

            <div className="navbar-container">

                {/* LOGO */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    Job<span>Connect</span>
                </Link>

                {/* MOBILE BUTTON */}

                <button
                    type="button"
                    className="menu-btn"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* NAVIGATION */}

                <div
                    className={`nav-links ${menuOpen ? "active" : ""
                        }`}
                >

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/jobs"
                        onClick={closeMenu}
                    >
                        Jobs
                    </Link>

                    {!user && (
                        <>
                            <a
                                href="#about"
                                onClick={closeMenu}
                            >
                                About
                            </a>

                            <a
                                href="#contact"
                                onClick={closeMenu}
                            >
                                Contact
                            </a>
                        </>
                    )}

                    {user && user.role === "recruiter" && (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/post-job"
                                onClick={closeMenu}
                            >
                                Post Job
                            </Link>
                        </>
                    )}

                    {user && user.role === "candidate" && (
                        <Link
                            to="/my-applications"
                            onClick={closeMenu}
                        >
                            My Applications
                        </Link>
                    )}

                    {user && (
                        <Link
                            to="/profile"
                            onClick={closeMenu}
                        >
                            Profile
                        </Link>
                    )}

                    {!user ? (
                        <div className="navbar-auth-buttons">

                            <Link
                                to="/login"
                                className="navbar-login-btn"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="navbar-register-btn"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>

                        </div>
                    ) : (
                        <div className="navbar-user-area">

                            <span className="nav-user">
                                Hello, {user.name}
                            </span>

                            <button
                                type="button"
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;