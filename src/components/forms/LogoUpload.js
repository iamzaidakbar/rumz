import React from "react";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

const LogoUpload = ({
  logoUploading,
  logoError,
  onLogoDrop,
  onLogoSelect,
  onLogoClick,
  onDragOver,
  fileInputRef,
  onRemoveLogo,
  hotelLogo,
}) => {
  return (
    <MDBRow>
      <MDBCol md="12">
        <div className="mb-4">
          <label className="form-label">Hotel Logo</label>
          <div
            className={`border rounded p-3 text-center ${
              logoUploading ? "opacity-50" : ""
            }`}
            style={{
              borderStyle: "dashed",
              borderColor: logoError ? "#dc3545" : "#dee2e6",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            onDrop={onLogoDrop}
            onDragOver={onDragOver}
            onClick={onLogoClick}
          >
            {hotelLogo ? (
              <div className="position-relative">
                <img
                  src={hotelLogo}
                  alt="Hotel Logo"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "100px",
                    objectFit: "contain",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute"
                  style={{ top: "-10px", right: "-10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLogo();
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
                <p className="mb-0 text-muted">
                  {logoUploading
                    ? "Uploading..."
                    : "Drag and drop logo here or click to browse"}
                </p>
                <small className="text-muted">
                  Supported formats: JPG, PNG, GIF (Max 2MB)
                </small>
              </>
            )}
          </div>
          {logoError && (
            <div className="text-danger mt-2 small">{logoError}</div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onLogoSelect}
            style={{ display: "none" }}
          />
        </div>
      </MDBCol>
    </MDBRow>
  );
};

export default LogoUpload;
