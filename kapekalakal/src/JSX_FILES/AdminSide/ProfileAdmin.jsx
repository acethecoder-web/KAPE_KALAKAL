import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileAdmin.css";

function ProfileAdmin() {
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Fetch user profile data from your backend
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Using the /me endpoint from your backend
      const response = await fetch("http://localhost:5174/api/me", {
        method: "GET",
        credentials: "include", // This includes the httpOnly cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        const userData = {
          id: result.data._id,
          image: result.data.image,
          name: result.data.name,
          role: result.data.role.toUpperCase(),
          email: result.data.email,
          address: result.data.address,
          //   avatar: "/api/placeholder/120/120", // You can update this if you have user avatars
        };
        setProfileData(userData);
        setEditData(userData); // Initialize edit data
      } else {
        setError(result.message || "Failed to fetch profile");
        // If token is invalid/expired, redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Network error occurred");
      // If network error (likely auth issue), redirect to login
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Logout function integrated with your backend
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        // Call logout endpoint (you might want to add this to your backend)
        const response = await fetch("http://localhost:5174/api/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Even if the logout endpoint doesn't exist yet, we'll clear the client state
        console.log("User logged out");

        // Clear any local storage (though your tokens are in httpOnly cookies)
        localStorage.clear();
        sessionStorage.clear();

        // Show success message
        alert("You have been logged out successfully!");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, still redirect to login
        navigate("/login");
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!editData.name || editData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!editData.email || !/\S+@\S+\.\S+/.test(editData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!editData.address || editData.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes in edit mode
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Edit function - enables edit mode
  const handleEdit = () => {
    setIsEditMode(true);
    setEditData({ ...profileData }); // Reset edit data to current profile data
    setValidationErrors({});
    console.log("Edit mode enabled");
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData({ ...profileData }); // Reset to original data
    setValidationErrors({});
    console.log("Edit cancelled");
  };

  // Save function - sends updated data to backend
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("http://localhost:5174/api/update-profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name.trim(),
          email: editData.email.trim(),
          address: editData.address.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the profile data with saved data
        setProfileData({ ...editData });
        setIsEditMode(false);
        setValidationErrors({});
        alert("Profile updated successfully!");
        console.log("Profile saved successfully");
      } else {
        setError(result.message || "Failed to update profile");
        alert("Error: " + (result.message || "Failed to update profile"));
      }
    } catch (error) {
      console.error("Save error:", error);
      setError("Network error occurred while saving");
      alert("Network error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="profile-container-admin">
        <div
          className="profile-card-admin"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h3>Loading profile...</h3>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="profile-container-admin">
        <div
          className="profile-card-admin"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h3>Error: {error}</h3>
          <button
            onClick={fetchUserProfile}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show profile if data is loaded
  if (!profileData) {
    return (
      <div className="profile-container-admin">
        <div
          className="profile-card-admin"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h3>No profile data found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container-admin">
      <div className="profile-card-admin">
        {/* Logout Button */}
        <button className="logout-button-admin" onClick={handleLogout}>
          <span className="button-icon-admin">🚪</span>
          LOGOUT
        </button>

        {/* Header Section */}
        <div className="profile-header-admin">
          <div className="avatar-container-admin">
            <img
              src={profileData.image}
              alt="Profile"
              className="profile-avatar-admin"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/120/cccccc/666666?text=User";
              }}
            />
          </div>
          <div className="header-info-admin">
            <h2 className="profile-name-admin">{profileData.name}</h2>
            <span className="role-tag-admin">{profileData.role}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="profile-divider-admin"></div>

        {/* Content Section */}
        <div className="profile-content-admin">
          <div className="field-row-admin">
            <div className="profile-field-admin">
              <label className="field-label-admin">Full Name:</label>
              <div
                className={`input-field-admin ${
                  isEditMode ? "edit-mode-admin" : ""
                }`}
              >
                <span className="field-icon-admin">👤</span>
                {isEditMode ? (
                  <div className="edit-input-container-admin">
                    <input
                      type="text"
                      className="field-input-admin"
                      value={editData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                    {validationErrors.name && (
                      <span className="error-message-admin">
                        {validationErrors.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="field-value-admin">{profileData.name}</span>
                )}
              </div>
            </div>
            <div className="profile-field-admin">
              <label className="field-label-admin">Email:</label>
              <div
                className={`input-field-admin ${
                  isEditMode ? "edit-mode-admin" : ""
                }`}
              >
                <span className="field-icon-admin">✉️</span>
                {isEditMode ? (
                  <div className="edit-input-container-admin">
                    <input
                      type="email"
                      className="field-input-admin"
                      value={editData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                    {validationErrors.email && (
                      <span className="error-message-admin">
                        {validationErrors.email}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="field-value-admin">{profileData.email}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-field-admin">
            <label className="field-label-admin">Role:</label>
            <div className="role-field-admin readonly-admin">
              <span className="field-icon-admin">⚙️</span>
              <span className="field-value-admin">{profileData.role}</span>
            </div>
          </div>

          <div className="profile-field-admin">
            <label className="field-label-admin">Address:</label>
            <div
              className={`address-field-admin ${
                isEditMode ? "edit-mode-admin" : ""
              }`}
            >
              <span className="field-icon-admin">📍</span>
              {isEditMode ? (
                <div className="edit-input-container-admin">
                  <textarea
                    className="field-textarea-admin"
                    value={editData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter your address"
                    rows="2"
                  />
                  {validationErrors.address && (
                    <span className="error-message-admin">
                      {validationErrors.address}
                    </span>
                  )}
                </div>
              ) : (
                <span className="field-value-admin">{profileData.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-admin">
          {isEditMode ? (
            <>
              <button
                className="cancel-button-admin"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <span className="button-icon-admin">❌</span>
                CANCEL
              </button>
              <button
                className={`save-button-admin ${saving ? "saving-admin" : ""}`}
                onClick={handleSave}
                disabled={saving}
              >
                <span className="button-icon-admin">
                  {saving ? "⏳" : "💾"}
                </span>
                {saving ? "SAVING..." : "SAVE"}
              </button>
            </>
          ) : (
            <button className="edit-button-admin" onClick={handleEdit}>
              <span className="button-icon-admin">✏️</span>
              EDIT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;
