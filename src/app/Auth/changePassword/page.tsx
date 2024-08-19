"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const initialValues = {
  email: "",
  password: "",
  password_confirmation: "",
};

export default function NewPasswordForm() {
  const [formValues, setFormValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();
  const pathName = usePathname();
  const front_url = process.env.NEXT_PUBLIC_FRONTEND_API_URL;

  useEffect(() => {

    // Retrieve email from local storage
    const email = localStorage.getItem("emailVal");

    // Set email in form values
    setFormValues((prevValues) => ({ ...prevValues, email }));

    // Fetch token from query parameters
    const searchParams = new URLSearchParams(window.location.search);

    const token = searchParams.get("token");
    
    setToken(token);

  }, [router, pathName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (formValues.password !== formValues.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/password/reset",
        {
          ...formValues,
          token,
        }
      );
      setMessage(response.data.message);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/Auth/login");
      }, 3000);
    } catch (error) {
      setError("Failed to reset password");
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-center flex-column flex-lg-row-fluid">
      <div className="w-lg-500px p-10">
        <form
          className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
          noValidate
          onSubmit={handleSubmit}
          id="kt_new_password_form"
        >
          <div className="text-center mb-10">
            <h1 className="text-gray-900 fw-bolder mb-3">Setup New Password</h1>
            <div className="text-gray-500 fw-semibold fs-6">
              Have you already reset the password?
              <Link href="/Auth/login">
                <span className="link-primary fw-bold">Sign in</span>
              </Link>
            </div>
          </div>

          {message && (
            <div className="alert alert-success">
              <div className="alert-text font-weight-bold">{message}</div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger">
              <div className="alert-text font-weight-bold">{error}</div>
            </div>
          )}

          <div className="fv-row mb-8">
            <label className="form-label fw-bolder text-gray-900 fs-6">Email</label>
            <input
              placeholder="Email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="off"
              className="form-control bg-transparent"
              readOnly
            />
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert"></span>
              </div>
            </div>
          </div>

          <div className="fv-row mb-8" data-kt-password-meter="true">
            <label className="form-label fw-bolder text-gray-900 fs-6">New Password</label>
            <div className="position-relative mb-3">
              <input
                type="password"
                placeholder="New Password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                autoComplete="off"
                className="form-control bg-transparent"
              />
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert"></span>
                </div>
              </div>
            </div>
            <div className="text-muted">
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </div>
          </div>

          <div className="fv-row mb-8">
            <label className="form-label fw-bolder text-gray-900 fs-6">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={formValues.password_confirmation}
              onChange={handleChange}
              autoComplete="off"
              className="form-control bg-transparent"
            />
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert"></span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              id="kt_new_password_submit"
              className="btn btn-lg btn-primary w-100 mb-5"
              style={{ color: "#fff" }}
              disabled={loading}
            >
              {!loading && <span className="indicator-label">Reset Password</span>}
              {loading && (
                <span className="indicator-progress" style={{ display: "block" }}>
                  Please wait...{" "}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <Link href="/Auth/login">
              <button
                type="button"
                id="btn btn-lg btn-primary w-100 mb-5"
                className="btn btn-lg w-100 mb-5"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
