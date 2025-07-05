import React, { useRef, useEffect } from "react";
import HotelAuthForm from "../components/HotelAuthForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
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
  const { formData, errors, isSubmitting, setIsSubmitting, handleChange } =
    useForm(initialForm);
  const { login } = useAuth();
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hotel = localStorage.getItem("hotel");
    if (token && hotel) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({
        hotelRegNo: formData.hotelRegNo,
        password: formData.password,
      });

      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      // Error is already handled by useAuth hook
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
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
                  form={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  loading={isSubmitting}
                  error={Object.values(errors).join(", ")}
                  success={false}
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
