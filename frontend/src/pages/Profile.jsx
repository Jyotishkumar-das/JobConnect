import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";

const Profile = () => {
    const { user, token, login } = useAuth();

    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="profile-page">
                <div className="empty-state">
                    <h2>
                        Please login to view your profile.
                    </h2>
                </div>
            </div>
        );
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        try {
            setLoading(true);

            const data = await updateProfile(
                name,
                token
            );

            login({
                token: token,
                user: data.user,
            });

            setSuccess(
                "Profile updated successfully! 🎉"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="profile-page">

            <div className="profile-card">

                {/* PROFILE HEADER */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h1>My Profile</h1>

                        <p>
                            Manage your JobConnect account
                        </p>
                    </div>

                </div>

                {/* MESSAGES */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* ACCOUNT INFORMATION */}

                <div className="profile-info">

                    <div className="profile-info-row">
                        <span>Email</span>
                        <strong>
                            {user.email}
                        </strong>
                    </div>

                    <div className="profile-info-row">
                        <span>Role</span>
                        <strong className="profile-role">
                            {user.role}
                        </strong>
                    </div>

                    <div className="profile-info-row">
                        <span>User ID</span>
                        <strong className="profile-id">
                            {user.id}
                        </strong>
                    </div>

                </div>

                <hr />

                {/* UPDATE PROFILE */}

                <h2>
                    Edit Profile
                </h2>

                <form onSubmit={handleUpdate}>

                    <div className="form-group">

                        <label htmlFor="profileName">
                            Full Name
                        </label>

                        <input
                            id="profileName"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Profile"}
                    </button>

                </form>

            </div>

        </main>
    );
};

export default Profile;