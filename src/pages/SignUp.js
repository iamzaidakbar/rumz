import React, { useState, useRef, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { cloudinaryApi } from "../api/cloudinaryApi";
import { hotelsApi } from "../api/hotelsApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SignUp.module.scss";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useNavigate } from "react-router-dom";
import HotelAuthForm from "../components/HotelAuthForm";

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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hotel = localStorage.getItem("hotel");
    if (token && hotel) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await hotelsApi.registerHotel(form);
      setSuccess(true);
      if (response && response.token && response.hotel) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("hotel", JSON.stringify(response.hotel));
      }
      toast.success(
        `Hotel registered successfully! with Registration no.: ${response.hotelRegNo}`,
        {
          position: "top-center",
        }
      );
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to register hotel", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setForm((prev) => ({ ...prev, hotelLogo: "" }));
    setLogoError("");
  };

  return (
    <>
      <ToastContainer />
      <MDBContainer
        fluid
        className="p-5 signup-page overflow-hidden"
        style={{
          height: "100vh",
          backgroundImage:
            "linear-gradient(to right, #243949 0%, #517fa4 100%)",
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
              Take full control of your hotel's operations with our powerful
              admin dashboard. From managing room availability and handling
              guest check-ins to tracking revenue and performance analytics —
              everything you need is in one place. Sign up now to streamline
              your workflow, reduce manual tasks, and deliver exceptional guest
              experiences with ease.
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
                <HotelAuthForm
                  mode="signup"
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  success={success}
                  logoUploading={logoUploading}
                  logoError={logoError}
                  onLogoDrop={handleLogoDrop}
                  onLogoSelect={handleLogoSelect}
                  onLogoClick={handleLogoClick}
                  onDragOver={handleDragOver}
                  fileInputRef={fileInputRef}
                  onRemoveLogo={handleRemoveLogo}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default SignUp;
