import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── EDITING STATE HOOKS ───
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "",
    mobile: "", street: "", city: "", country: "", pincode: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {

  const fetchProfileDetails = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "No session found. Please log in first."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.msg ||
          data.err ||
          "Something went wrong"
        );
      }

      setUserData(data);

      setFormData({
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        mobile: data.mobile || "",
        street: data.street || "",
        city: data.city || "",
        country: data.country || "India",
        pincode: data.pincode || ""
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  fetchProfileDetails();

}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault(); 
    setIsEditing(false);
    setSelectedFile(null);
    setEditImagePreview(null);
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        middleName: userData.middleName || "",
        lastName: userData.lastName || "",
        mobile: userData.mobile || "",
        street: userData.street || "",
        city: userData.city || "",
        country: userData.country || "India",
        pincode: userData.pincode || ""
      });
    }
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault(); 
    
    // Helper to safely compare trimmed text inputs without null/undefined edge cases
    const hasFieldChanged = (formVal, dbVal) => {
      return String(formVal || "").trim() !== String(dbVal || "").trim();
    };

    // Compares all fields simultaneously to capture any combination of edits
    const hasTextChanged = 
      hasFieldChanged(formData.firstName, userData?.firstName) ||
      hasFieldChanged(formData.middleName, userData?.middleName) ||
      hasFieldChanged(formData.lastName, userData?.lastName) ||
      hasFieldChanged(formData.mobile, userData?.mobile) ||
      hasFieldChanged(formData.street, userData?.street) ||
      hasFieldChanged(formData.city, userData?.city) ||
      hasFieldChanged(formData.country, userData?.country || "India") ||
      hasFieldChanged(formData.pincode, userData?.pincode);

    const hasImageChanged = selectedFile !== null;

    // If absolutely nothing was altered across the entire form, exit edit mode smoothly
    if (!hasTextChanged && !hasImageChanged) {
      setIsEditing(false);
      return; 
    }

    const storedUserId = localStorage.getItem("userId");
    setIsUpdating(true);

    const uploadData = new FormData();
    uploadData.append("firstName", formData.firstName);
    uploadData.append("middleName", formData.middleName);
    uploadData.append("lastName", formData.lastName);
    uploadData.append("mobile", formData.mobile);
    uploadData.append("street", formData.street);
    uploadData.append("city", formData.city);
    uploadData.append("country", formData.country);
    uploadData.append("pincode", formData.pincode);
    
    if (selectedFile) {
      uploadData.append("profileImage", selectedFile);
    }

    try {

  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/profile/update",
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`
      },

      body: uploadData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update profile changes."
    );
  }

  alert("Profile updated successfully!");

  setUserData(data.user);

  setIsEditing(false);

  setSelectedFile(null);

  setEditImagePreview(null);

} catch (err) {

  alert(err.message);

} finally {

  setIsUpdating(false);
}
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <h2 style={{ textAlign: "center", color: "#fff" }}>Loading profile details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-wrapper">
        <div style={{ textAlign: "center", color: "red" }}>
          <h2>Error: {error}</h2>
          <button type="button" className="back-btn" onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const currentImageSrc = (userData?.profileImage && userData.profileImage !== "placeholder.jpg")
    ? userData.profileImage
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";

  const fullName = userData?.middleName
    ? `${userData.firstName} ${userData.middleName} ${userData.lastName}`
    : userData 
      ? `${userData.firstName} ${userData.lastName}` 
      : "User";

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <h1 className="profile-title">{isEditing ? "Edit Profile Details" : "User Profile"}</h1>

        <form onSubmit={handleSaveSubmit}>
          <div className="profile-header">
            <div className="profile-avatar-container" style={{ position: 'relative' }}>
              <img
                src={editImagePreview || currentImageSrc}
                alt="Profile Avatar"
                className="profile-photo"
                style={{ objectFit: 'cover' }}
              />
              {isEditing && (
                <div className="avatar-edit-overlay" style={{ marginTop: '10px', textAlign: 'center' }}>
                  <label htmlFor="edit-avatar-input" className="edit-avatar-label" style={{ cursor: 'pointer', color: '#0056b3', fontSize: '0.85rem', textDecoration: 'underline' }}>
                    Change Photo
                  </label>
                  <input type="file" id="edit-avatar-input" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
              )}
            </div>

            <div className="profile-basic">
              {isEditing ? (
                <div className="edit-name-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required style={{ width: '33%' }} />
                  <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle Name" style={{ width: '33%' }} />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required style={{ width: '33%' }} />
                </div>
              ) : (
                <h2>{fullName}</h2>
              )}

              <p>
                <strong>Phone:</strong>{" "}
                {isEditing ? (
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                ) : (
                  userData?.mobile
                )}
              </p>
              <p>
                <strong>Email:</strong> {userData?.email} <span style={{ fontSize: '0.8rem', color: '#aaa' }}>(Read-Only)</span>
              </p>
            </div>
          </div>

          <div className="profile-section">
            <h3>Address</h3>
            <div className="address-grid">
              <div className="address-item">
                <span className="address-label">Street:</span>
                <span className="address-value">
                  {isEditing ? (
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} required />
                  ) : (
                    ` ${userData?.street}`
                  )}
                </span>
              </div>
              <div className="address-item">
                <span className="address-label">City:</span>
                <span className="address-value">
                  {isEditing ? (
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                  ) : (
                    ` ${userData?.city}`
                  )}
                </span>
              </div>
              <div className="address-item">
                <span className="address-label">Country:</span>
                <span className="address-value">
                  {isEditing ? (
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
                  ) : (
                    ` ${userData?.country || "India"}`
                  )}
                </span>
              </div>
              <div className="address-item">
                <span className="address-label">Pincode:</span>
                <span className="address-value">
                  {isEditing ? (
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
                  ) : (
                    ` ${userData?.pincode}`
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions-panel" style={{ display: 'flex', gap: '15px', marginTop: '20px', position: 'relative', zIndex: 10 }}>
            {isEditing ? (
              <>
                <button type="submit" disabled={isUpdating} className="save-btn" style={{ background: '#28a745', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {isUpdating ? "Saving changes..." : "Save Changes"}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn" style={{ background: '#dc3545', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={(e) => { e.preventDefault(); setIsEditing(true); }} className="edit-btn" style={{ background: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Edit Profile
                </button>
                <button type="button" className="back-btn" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                  Back to Dashboard
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}