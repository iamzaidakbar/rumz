import React from "react";
import { MDBBtn, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import LogoUpload from "./LogoUpload";

const SignupForm = ({
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
}) => {
  return (
    <form onSubmit={onSubmit} autoComplete="off">
      {/* Hotel Information */}
      <MDBRow>
        <MDBCol md="6">
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
        <MDBCol md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Hotel Name"
            id="hotelname"
            name="hotelname"
            type="text"
            value={form.hotelname || ""}
            onChange={onChange}
            required
          />
        </MDBCol>
      </MDBRow>

      {/* Owner Information */}
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Full Name"
            id="fullname"
            name="fullname"
            type="text"
            value={form.fullname || ""}
            onChange={onChange}
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
            value={form.email || ""}
            onChange={onChange}
            required
          />
        </MDBCol>
      </MDBRow>

      {/* Hotel Details */}
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Hotel Location"
            id="hotelLocation"
            name="hotelLocation"
            type="text"
            value={form.hotelLocation || ""}
            onChange={onChange}
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
            value={form.password || ""}
            onChange={onChange}
            required
          />
        </MDBCol>
      </MDBRow>

      {/* Contact Information */}
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Phone Number"
            id="number"
            name="number"
            type="text"
            value={form.number || ""}
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
            value={form.address || ""}
            onChange={onChange}
            required
          />
        </MDBCol>
      </MDBRow>

      {/* Manager Information */}
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            wrapperClass="mb-4"
            label="Hotel Manager Name"
            id="hotelManager"
            name="hotelManager"
            type="text"
            value={form.hotelManager || ""}
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
            value={form.hotelManagerNumber || ""}
            onChange={onChange}
            required
          />
        </MDBCol>
      </MDBRow>

      {/* Logo Upload */}
      <LogoUpload
        logoUploading={logoUploading}
        logoError={logoError}
        onLogoDrop={onLogoDrop}
        onLogoSelect={onLogoSelect}
        onLogoClick={onLogoClick}
        onDragOver={onDragOver}
        fileInputRef={fileInputRef}
        onRemoveLogo={onRemoveLogo}
        hotelLogo={form.hotelLogo}
      />

      {error && <div className="text-danger mb-3 text-center">{error}</div>}

      {success && (
        <div className="text-success mb-3 text-center">
          Registration successful! Please login.
        </div>
      )}

      <MDBBtn
        className="w-100 my-2 mb-4"
        size="md"
        type="submit"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </MDBBtn>
    </form>
  );
};

export default SignupForm;
