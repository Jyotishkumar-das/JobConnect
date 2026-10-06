import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">

                    <h2>JobConnect</h2>

                    <p>
                        Connecting talented candidates
                        with great opportunities.
                    </p>

                </div>

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/jobs">
                        Jobs
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

                <div className="footer-links">

                    <h3>For Candidates</h3>

                    <Link to="/jobs">
                        Find Jobs
                    </Link>

                    <Link to="/my-applications">
                        My Applications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                </div>

                <div className="footer-links">

                    <h3>For Recruiters</h3>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/post-job">
                        Post a Job
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} JobConnect.
                    All rights reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;