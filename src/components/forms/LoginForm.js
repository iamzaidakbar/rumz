import React from "react";
import { MDBBtn, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";

const LoginForm = ({ form, onChange, onSubmit, loading, error, success }) => {
  return (
    <form onSubmit={onSubmit} autoComplete="off">
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
            value={form.password || ""}
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
    </form>
  );
};

export default LoginForm;
