import React, { useState, useRef } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { cloudinaryApi } from "../api/cloudinaryApi";

import "../styles/SignUp.module.scss";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialForm = {
  hotelRegNo: "",
  password: "",
  fullname: "",
  email: "",
  number: "",
  address: "",
  hotelname: "",
  hotelLocation: "",
  hotelLogo: "",
  hotelManager: "",
  hotelManagerNumber: "",
};

const SignUp = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoDrop = async (e) => {
    e.preventDefault();
    setLogoError("");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setLogoError("Max file size is 2MB.");
      return;
    }
    setLogoUploading(true);
    try {
      const [url] = await cloudinaryApi.uploadImages([file]);
      setForm((prev) => ({ ...prev, hotelLogo: url }));
    } catch (err) {
      setLogoError("Upload failed. Try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoSelect = async (e) => {
    setLogoError("");
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setLogoError("Max file size is 2MB.");
      return;
    }
    setLogoUploading(true);
    try {
      const [url] = await cloudinaryApi.uploadImages([file]);
      setForm((prev) => ({ ...prev, hotelLogo: url }));
    } catch (err) {
      setLogoError("Upload failed. Try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => (window.location.href = "/"), 1200);
    }, 1200);
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setForm((prev) => ({ ...prev, hotelLogo: "" }));
    setLogoError("");
  };

  return (
    <MDBContainer
      fluid
      className="p-5 signup-page overflow-hidden"
      style={{
        height: "100vh",
        backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)",
      }}
    >
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
            Your Hotel's Digital <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>
              Command Center Starts Here
            </span>
          </h1>

          <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
            Take full control of your hotel's operations with our powerful admin
            dashboard. From managing room availability and handling guest
            check-ins to tracking revenue and performance analytics — everything
            you need is in one place. Sign up now to streamline your workflow,
            reduce manual tasks, and deliver exceptional guest experiences with
            ease.
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <MDBCard className="my-5 bg-glass">
            <MDBCardHeader className="text-center">
              <h4 className="mb-0">Hotel Registration</h4>
            </MDBCardHeader>

            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit} autoComplete="off">
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Hotel Registration No"
                      id="hotelRegNo"
                      name="hotelRegNo"
                      type="text"
                      value={form.hotelRegNo}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Hotel Name"
                      id="hotelname"
                      name="hotelname"
                      type="text"
                      value={form.hotelname}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Full Name"
                      id="fullname"
                      name="fullname"
                      type="text"
                      value={form.fullname}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Hotel Location"
                      id="hotelLocation"
                      name="hotelLocation"
                      type="text"
                      value={form.hotelLocation}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Password"
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Phone Number"
                      id="number"
                      name="number"
                      type="text"
                      value={form.number}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Address"
                      id="address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Hotel Manager Name"
                      id="hotelManager"
                      name="hotelManager"
                      type="text"
                      value={form.hotelManager}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Hotel Manager Number"
                      id="hotelManagerNumber"
                      name="hotelManagerNumber"
                      type="text"
                      value={form.hotelManagerNumber}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow>
                  <MDBCol md="6">
                    <div
                      style={{
                        border: "1px dashed #517fa4",
                        borderRadius: 10,
                        padding: 16,
                        textAlign: "center",
                        background: "#f8fafc",
                        color: "#243949",
                        fontFamily: "Montserrat, Arial, sans-serif",
                        fontWeight: 500,
                        cursor: logoUploading ? "not-allowed" : "pointer",
                        marginBottom: 16,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border 0.2s, background 0.2s",
                        maxWidth: "100%",
                      }}
                      onDrop={handleLogoDrop}
                      onDragOver={handleDragOver}
                      onClick={logoUploading ? undefined : handleLogoClick}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleLogoSelect}
                        disabled={logoUploading}
                      />
                      {logoUploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <span style={{ fontSize: 10 }}>
                            Drag & Drop or Click to Upload Hotel Logo
                          </span>
                          <span style={{ fontSize: 10, color: "#517fa4" }}>
                            (Max size: 2MB, JPG/PNG)
                          </span>
                        </>
                      )}
                      {logoError && (
                        <div
                          style={{
                            color: "#e53935",
                            fontSize: 13,
                            marginTop: 6,
                          }}
                        >
                          {logoError}
                        </div>
                      )}
                    </div>
                  </MDBCol>
                  <MDBCol
                    md="6"
                    className="d-flex flex-column align-items-start justify-content-center"
                  >
                    {form.hotelLogo && !logoUploading && (
                      <>
                        <img
                          src={form.hotelLogo}
                          alt="Hotel Logo Preview"
                          style={{
                            maxWidth: 120,
                            maxHeight: 120,
                            borderRadius: 10,
                            marginBottom: 8,
                            objectFit: "cover",
                            boxShadow: "0 2px 8px rgba(36,57,73,0.08)",
                            display: "block",
                          }}
                        />
                        <span className="d-flex align-items-center gap-2 mb-4">
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            style={{
                              background: "#fff",
                              color: "#222",
                              border: "none",
                              borderRadius: 6,
                              padding: "2px 6px",
                              fontSize: 10,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                          <span
                            style={{ fontSize: 10, color: "rgb(42 155 9)" }}
                          >
                            Uploaded!
                          </span>
                        </span>
                      </>
                    )}
                  </MDBCol>
                </MDBRow>

                {error && (
                  <div className="text-danger mb-3 text-center">{error}</div>
                )}
                {success && (
                  <div className="text-success mb-3 text-center">
                    Registration successful! Redirecting...
                  </div>
                )}
                <MDBBtn
                  className="w-100 my-2 mb-4"
                  size="md"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Hotel"}
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default SignUp;
