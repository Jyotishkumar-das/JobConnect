import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <main className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero-section">
                <div className="hero-content">

                    <div className="hero-text">
                        <p className="hero-badge">
                            🚀 Find your next opportunity
                        </p>

                        <h1>
                            Find Your
                            <span> Dream Job</span>
                        </h1>

                        <p className="hero-description">
                            JobConnect helps candidates discover
                            great jobs and helps recruiters find
                            the right talent.
                        </p>

                        <div className="hero-buttons">
                            <Link
                                to="/jobs"
                                className="hero-primary-btn"
                            >
                                Find Jobs
                            </Link>

                            <Link
                                to="/register"
                                className="hero-secondary-btn"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card">
                            <div className="hero-card-icon">
                                💼
                            </div>

                            <h3>
                                Your Career Starts Here
                            </h3>

                            <p>
                                Explore opportunities and
                                connect with employers.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= FEATURES ================= */}

            <section className="features-section">

                <div className="section-heading">
                    <h2>
                        Why Choose JobConnect?
                    </h2>

                    <p>
                        Everything you need for your job search.
                    </p>
                </div>

                <div className="features-grid">

                    <div className="feature-card">
                        <div className="feature-icon">
                            🔍
                        </div>

                        <h3>
                            Find Jobs
                        </h3>

                        <p>
                            Search and filter jobs based on
                            your skills, location and job type.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            📄
                        </div>

                        <h3>
                            Easy Application
                        </h3>

                        <p>
                            Upload your resume and apply for
                            jobs quickly and easily.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            💼
                        </div>

                        <h3>
                            For Recruiters
                        </h3>

                        <p>
                            Post jobs and manage applications
                            from one convenient dashboard.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            🔐
                        </div>

                        <h3>
                            Secure Platform
                        </h3>

                        <p>
                            Secure authentication keeps your
                            account and information protected.
                        </p>
                    </div>

                </div>

            </section>
            {/* ==========================================
    STATS
========================================== */}

            <section className="home-stats">

                <div className="home-stats-container">

                    <div className="home-stat">
                        <strong>10K+</strong>
                        <span>Jobs Available</span>
                    </div>

                    <div className="home-stat">
                        <strong>5K+</strong>
                        <span>Companies</span>
                    </div>

                    <div className="home-stat">
                        <strong>20K+</strong>
                        <span>Job Seekers</span>
                    </div>

                    <div className="home-stat">
                        <strong>98%</strong>
                        <span>Success Rate</span>
                    </div>

                </div>

            </section>

            {/* ================= CTA ================= */}

            <section className="home-cta">

                <div className="cta-content">

                    <h2>
                        Ready to find your next opportunity?
                    </h2>

                    <p>
                        Create your account and start exploring
                        jobs today.
                    </p>

                    <Link
                        to="/register"
                        className="hero-primary-btn"
                    >
                        Create Account
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default Home;