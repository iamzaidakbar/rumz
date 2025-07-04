import React from "react";
import { MDBBtn, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";

function HotelAuthForm({
  mode = "signup",
  form,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  logoUploading,
  logoError,
  onLogoDrop,
  onLogoSelect,
  onLogoClick,
  onDragOver,
  fileInputRef,
  onRemoveLogo,
}) {
  return (
    <form onSubmit={onSubmit} autoComplete="off">
      {mode === "login" ? (
        <>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                wrapperClass="mb-4"
                label="Hotel Registration No"
                id="hotelRegNo"
                name="hotelRegNo"
                type="text"
                value={form.hotelRegNo || ""}
                onChange={onChange}
                required
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
              />
            </MDBCol>
          </MDBRow>
          {error && <div className="text-danger mb-3 text-center">{error}</div>}
          {success && (
            <div className="text-success mb-3 text-center">
              Login successful! Redirecting...
            </div>
          )}
          <MDBBtn
            className="w-100 my-2 mb-4"
            size="md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </MDBBtn>
        </>
      ) : (
        <>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                wrapperClass="mb-4"
                label="Hotel Registration No"
                id="hotelRegNo"
                name="hotelRegNo"
                type="text"
                value={form.hotelRegNo}
                onChange={onChange}
                required
                disabled={mode === "login"}
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
                onChange={onChange}
                required
                disabled={mode === "login"}
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
                onChange={onChange}
                required
                disabled={mode === "login"}
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
                onChange={onChange}
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
                onChange={onChange}
                required
                disabled={mode === "login"}
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
                onChange={onChange}
                required
              />
            </MDBCol>
          </MDBRow>
          {mode === "signup" && (
            <>
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Phone Number"
                    id="number"
                    name="number"
                    type="text"
                    value={form.number}
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onDrop={onLogoDrop}
                    onDragOver={onDragOver}
                    onClick={logoUploading ? undefined : onLogoClick}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={onLogoSelect}
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
                          onClick={onRemoveLogo}
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
                        <span style={{ fontSize: 10, color: "rgb(42 155 9)" }}>
                          Uploaded!
                        </span>
                      </span>
                    </>
                  )}
                </MDBCol>
              </MDBRow>
            </>
          )}
          {error && <div className="text-danger mb-3 text-center">{error}</div>}
          {success && (
            <div className="text-success mb-3 text-center">
              {mode === "signup"
                ? "Registration successful! Redirecting..."
                : "Login successful! Redirecting..."}
            </div>
          )}
          <MDBBtn
            className="w-100 my-2 mb-4"
            size="md"
            type="submit"
            disabled={loading}
          >
            {loading
              ? mode === "signup"
                ? "Registering..."
                : "Logging in..."
              : mode === "signup"
              ? "Register Hotel"
              : "Login"}
          </MDBBtn>
        </>
      )}
    </form>
  );
}

export default HotelAuthForm;
