"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import LoadingIcons from "react-loading-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the validation schema with yup
const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

function Login() {
  interface User {
    token: string;
    user_type: string;
    // Add other properties you expect in the user object
  }

  interface SessionData {
    user?: User;
    // Add other properties you expect in the session data
  }

  const { data: session } = useSession() as { data?: SessionData };
  const token = session?.user?.token;

  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      // Check user type and redirect immediately
      const userType = session.user?.user_type;
      if (userType === "EC") {
        router.replace("/company/page");
      } else if (userType === "TR") {
        router.replace("/dashboard");
      }
    }
  }, [session, router]);

  useEffect(() => {
      if (token) {
          axios
              .get(`${url}/user`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              })
              .then((response) => {
                  const userType = response.data.user_type;

                  if (userType === "EC") {
                      router.push("/company/dashboard");
                  } else if (userType === "TR") {
                      router.push("/dashboard");
                  } else {
                      // console.error("Invalid user type");
                  }
              })
              .catch((error) => {
                  console.error("Error fetching user data:", error);
                  router.push("/");
              });
      }
  }, [router, url, token]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...data,
      });

      if (result.error) {
        setError("email", { type: "manual", message: result.error });
      } else {
        // Redirect based on user type
        const userType = data.user_type; // Change this line if necessary

        if (userType === "EC") {
          router.push("/company/page");
        } else if (userType === "TR") {
          router.push("/dashboard");
        } else {
          // console.error("Invalid user type");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="form w-100"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
      </div>

      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Email"
              className="form-control bg-transparent"
              type="email"
              autoComplete="off"
            />
          )}
        />
        {errors.email && (
          <div className="text-danger">{errors.email.message}</div>
        )}
      </div>

      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Password
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <div className="position-relative">
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="off"
                className="form-control bg-transparent"
              />
              <span
                role="button"
                className="position-absolute top-50 start-100 translate-middle"
                style={{ paddingRight: "2.5rem", fontSize: "large" }}
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? (
                  <i className="ki-duotone ki-eye-slash">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </i>
                ) : (
                  <i className="ki-duotone ki-eye">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                )}
              </span>
            </div>
          )}
        />
        {errors.password && (
          <div className="text-danger">{errors.password.message}</div>
        )}
      </div>

      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        <Link href="/Auth/ResetPassword" className="link-primary">
          Forgot Password ?
        </Link>
      </div>

      <div className="d-grid mb-10">
        <button
          id="kt_sign_in_submit"
          className="justify-content-center btn-primary"
          disabled={isLoading}
        >
          <span className="indicator-progress d-flex justify-content-center">
            {isLoading ? <LoadingIcons.TailSpin height={18} /> : "Login"}
          </span>
        </button>
      </div>
    </form>
  );
}

export default Login;
