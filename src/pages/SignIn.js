import React, { useState, useRef, useEffect } from "react";
import HotelAuthForm from "../components/HotelAuthForm";
import { hotelsApi } from "../api/hotelsApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "../styles/SignUp.module.scss";

const initialForm = {
  hotelRegNo: "",
  password: "",
};

const SignIn = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // For login, only send hotelRegNo and password
      const response = await hotelsApi.loginHotel({
        hotelRegNo: form.hotelRegNo,
        password: form.password,
      });
      if (response && response.token && response.hotel) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("hotel", JSON.stringify(response.hotel));
      }
      setSuccess(true);
      toast.success("Login successful! Redirecting...", {
        position: "top-center",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to login", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
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
        <MDBRow className="justify-content-center">
          <MDBCol md="6" lg="5" xl="5">
            <div className="text-center mb-4">
              <h1
                className="my-4 display-5 fw-bold ls-tight px"
                style={{ color: "hsl(218, 81%, 95%)" }}
              >
                Welcome Back
                <br />
                <span style={{ color: "hsl(218, 81%, 75%)" }}>
                  Log in to your hotel dashboard
                </span>
              </h1>
              <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
                Manage your hotel operations, bookings, and analytics from one
                powerful dashboard. Enter your credentials to continue.
              </p>
            </div>
            <MDBCard className="my-4 bg-glass">
              <MDBCardHeader className="text-center">
                <h4 className="mb-0">Hotel Login</h4>
              </MDBCardHeader>
              <MDBCardBody className="p-5">
                <HotelAuthForm
                  mode="login"
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  success={success}
                  // The following props are not used in login mode
                  logoUploading={false}
                  logoError={""}
                  onLogoDrop={() => {}}
                  onLogoSelect={() => {}}
                  onLogoClick={() => {}}
                  onDragOver={() => {}}
                  fileInputRef={fileInputRef}
                  onRemoveLogo={() => {}}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default SignIn;
