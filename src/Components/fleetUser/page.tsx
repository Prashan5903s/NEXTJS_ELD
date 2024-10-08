"use client";
import React, { use, useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import axios from "axios";
import { debounce } from "lodash";
import Select from "react-select";
import { SubmitHandler, useForm, Controller, set } from "react-hook-form";
import { Value } from "sass";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import LoadingIcons from 'react-loading-icons';
// import '../styles/globals.css'; // Your global styles

type IFormInput = {
  first_name: number;
  last_name: number;
  user_id: number;
  email: String;
  phone: number;
  password: String;
  confirm_password: String;
  role_id: number;
};

function FleetUserForm({ id = null }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [hoursOfService, setHoursOfService] = useState(null);
  const [homeTerminal, setHomeTerminal] = useState(null);
  const [edits, setEdits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adv, setAdv] = useState(0);
  const [userName, setUserName] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState();
  const [stateId, setStateId] = useState();
  const [cityId, setCityId] = useState();
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  async function checkEmailUniqueness(email, id = null) {
    function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        ``;
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    const token = getCookie("token");

    let emailVal = id ? id?.user?.id : null;

    try {
      if (!token) {
        console.error("No token available");
        return false; // Consider email not unique if no token
      }

      const response = await axios.get(
        `${url}/check/email/${email}/${emailVal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data === 0; // If no users found, email is unique
    } catch (error) {
      console.error("Error fetching users:", error);
      return false; // Consider email not unique on error
    }
  }

  const formValidations = {
    first_name: {
      required: "First name is required",
      maxLength: {
        value: 100,
        message: "First name cannot have more than 100 characters",
      },
      pattern: {
        value: /^[A-Za-z]+$/i,
        message: "First name should be only alphabetic characters",
      },
    },

    last_name: {
      required: "Last name is required",
      maxLength: {
        value: 100,
        message: "Last name cannot have more than 100 characters",
      },
      pattern: {
        value: /^[A-Za-z]+$/i,
        message: "Last name should be only alphabetic characters",
      },
    },

    user_id: {
      required: "User ID is required",
      maxLength: {
        value: 10,
        message: "User ID must be at most 10 characters long",
      },
      pattern: {
        value: /^[0-9]+$/i,
        message: "User ID should be numeric",
      },
    },

    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
      validate: async (email, id) => {
        const isUnique = await checkEmailUniqueness(email, id ? id : null);
        return isUnique || "Email already exists";
      },
    },

    phone: {
      required: "Phone is required",
      minLength: {
        value: 10,
        message: "Phone must be at least 10 characters long",
      },
      maxLength: {
        value: 15,
        message: "Phone must be at most 15 characters long",
      },
      pattern: {
        value: /^[0-9]+$/i,
        message: "Phone should be numeric",
      },
    },

    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
      maxLength: {
        value: 100,
        message: "Password must be at most 100 characters long",
      },
    },

    confirm_password: {
      required: "Confirm Password is required",
      minLength: {
        value: 8,
        message: "Confirm Password must have at least 8 characters",
      },
      maxLength: {
        value: 100,
        message: "Confirm Password must be at most 100 characters long",
      },
      validate: {
        matchesPreviousPassword: (value, { password }) =>
          password === value || "Passwords and confirm password should match!",
      },
    },

    role_id: {
      required: "Role id is required",
    },
  };

  // Setup useForm with defaultValues
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
    getValues,
  } = useForm<IFormInput>();

  useEffect(() => {
    function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        ``;
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    const token = getCookie("token");

    if (token) {
      axios
        .get(`${url}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          setAuthenticated(true);
          const userType = response.data.user_type;

          if (userType === "TR") {
          } else if (userType === "EC") {
            router.replace("/company/dashboard");
          } else {
            console.error("Invalid user type");
            router.replace("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          router.replace("/");
        });
    } else {
      router.replace("/");
    }
  }, [id, router, reset]);

  function getCookie(name) {
    const nameEQ = name + "=";

    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === " ") c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }

  const token = getCookie("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const Edit = async () => {
    try {
      const response = await axios.get(
        `${url}/fleet-user/${id}/edit`,
        axiosConfig
      );
      const data = response.data;
      setEdits(data);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const debouncedEdit = useCallback(
    debounce(Edit, 300), // Adjust the delay (300ms here) as needed
    [url, id]
  );

  useEffect(() => {
    debouncedEdit();
    // Cleanup to cancel debounce on component unmount
    return () => {
      debouncedEdit.cancel();
    };
  }, [debouncedEdit]);

  const Address = async () => {
    try {
      const response = await axios.get(`${url}/fleet-user/create`, axiosConfig);
      setRole(response.data);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const debouncedAddress = useCallback(debounce(Address, 300), [url]);

  useEffect(() => {
    debouncedAddress();
  }, [url, debouncedAddress]);

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  const addDriver = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/fleet-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding driver:", errorData);
        setIsLoading(false);
        return;
      } else {
        toastr["success"]("Driver added successfully!");
        router.push("/dashboard/fleet-user");
      }

      // Redirect or show success message
      // router.push('/dashboard/drivers');
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding driver:", error);
    }
  };

  const editDriver = async (id, data, token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/fleet-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating driver:", errorData);
        setIsLoading(false);
        return;
      } else {
        toastr["success"]("Fleet user successfully!");
        router.push("/dashboard/fleet-user");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating driver:", error);
    }
  };

  useEffect(() => {
    if (edits?.user) {
      const advrs = edits.user.first_name;
      setValue("first_name", advrs); // Update the form value
    }
    if (edits?.user) {
      const advrs = edits.user.last_name;
      setValue("last_name", advrs); // Update the form value
    }
    if (edits?.user) {
      const advrs = edits.user.email;
      setValue("email", advrs); // Update the form value
    }
    if (edits?.user) {
      const advrs = edits.user.mobile_no;
      setValue("phone", advrs); // Update the form value
    }
    if (edits?.userInfo) {
      const advrs = edits.userInfo.fleet_user_id;
      setValue("user_id", advrs); // Update the form value
    }
    if (edits?.role) {
      const advrs = edits.role.role_id;
      setValue("role_id", advrs); // Update the form value
    }
  }, [edits, setValue, userName]);

  const debouncedOnSubmit = debounce(async (data) => {
    if (id) {
      await editDriver(id, data, token);
    } else {
      await addDriver(data);
    }
  }, 300); // 300ms debounce delay, adjust as needed

  // Update the onSubmit function to use the debounced version
  const onSubmit = (data) => {
    debouncedOnSubmit(data);
  };

  const selectRef = useRef(null);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar pt-6 pb-2 mb-5">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex align-items-stretch"
        >
          <div className="app-toolbar-wrapper d-flex flex-stack flex-wrap gap-4 w-100">
            <div className="page-title d-flex flex-column justify-content-center gap-1 me-3">
              <h1 className="page-heading d-flex flex-column justify-content-center text-gray-900 fw-bold fs-3 m-0">
                Fleet User
              </h1>

              <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                <li className="breadcrumb-item text-muted">
                  <Link href="#" className="text-muted text-hover-primary">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-500 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted">
                  <Link href="#" className="text-muted text-hover-primary">
                    Fleet User
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-500 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted">
                  <Link href="#" className="text-muted text-hover-primary">
                    {id ? "Edit" : "Add"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <form
            className="form d-flex flex-column"
            onSubmit={handleSubmit(onSubmit)}
            id="form"
          >
            <input type="hidden" />

            <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="kt_ecommerce_add_product_general"
                  role="tabpanel"
                >
                  <div className="d-flex flex-column">
                    <div className="card card-flush py-4">
                      <div className="text-center">
                        <p className="fw-bolder fs-7">ACCOUNT & SECURITY</p>
                      </div>
                      <div className="separator my-0"></div>
                      <div className="card-body mt-4">
                        <div className="mb-5 row">
                          <label className="required form-label  col-lg-2 col-md-12 col-sm-12 col-form-label">
                            Name
                          </label>
                          <div className="col-lg-5 col-md-12 col-sm-12">
                            <input
                              type="text"
                              name="first_name"
                              className={`form-control mb-2 ${errors.first_name ? "is-invalid" : ""
                                }`}
                              placeholder="First name"
                              defaultValue={edits?.user?.first_name}
                              {...register(
                                "first_name",
                                formValidations.first_name
                              )}
                            />
                            {errors.first_name && (
                              <p className="invalid-feedback">
                                {errors.first_name.message}
                              </p>
                            )}
                          </div>
                          <div className="col-lg-5 col-md-12 col-sm-12">
                            <input
                              type="text"
                              name="last_name"
                              className={`form-control mb-2 ${errors.last_name ? "is-invalid" : ""
                                }`}
                              placeholder="Last name"
                              defaultValue={edits?.user?.last_name}
                              {...register(
                                "last_name",
                                formValidations.last_name
                              )}
                            />
                            {errors.last_name && (
                              <p className="invalid-feedback">
                                {errors.last_name.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mb-5 row">
                          <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                            User Id
                          </label>
                          <div className="col-lg-10 col-md-12 col-sm-12">
                            <input
                              type="text"
                              name="user_id"
                              className={`form-control mb-2 ${errors.user_id ? "is-invalid" : ""
                                }`}
                              placeholder="User Id"
                              defaultValue={edits?.userInfo?.fleet_user_id}
                              {...register("user_id", formValidations.user_id)}
                            />
                            {errors.user_id && (
                              <p className="invalid-feedback">
                                {errors.user_id.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mb-5 row">
                          <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                            Mobile no
                          </label>
                          <div className="col-lg-10 col-md-12 col-sm-12">
                            <input
                              type="text"
                              name="phone"
                              defaultValue={edits?.user?.mobile_no}
                              className={`form-control mb-2 ${errors.phone ? "is-invalid" : ""
                                }`}
                              placeholder="Mobile no"
                              {...register("phone", formValidations.phone)}
                            />
                            {errors.phone && (
                              <p className="invalid-feedback">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mb-5 row">
                          <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                            Email
                          </label>
                          <div className="col-lg-10 col-md-12 col-sm-12">
                            <input
                              type="email"
                              name="email"
                              {...register("email", formValidations.email)}
                              className={`form-control mb-2 ${errors.email ? "is-invalid" : ""
                                }`}
                              placeholder="Email"
                              defaultValue={edits?.user?.email}
                            />
                            {errors.email && (
                              <p className="invalid-feedback">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                        {!id && (
                          <div className="mb-5 row">
                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                              Password
                            </label>

                            <div className="col-lg-5 col-md-12 col-sm-5">
                              <div className="position-relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  className={`form-control mb-2 ${errors.password ? "is-invalid" : ""
                                    }`}
                                  placeholder="Password"
                                  autoComplete="new-password"
                                  {...register(
                                    "password",
                                    formValidations.password
                                  )}
                                />
                                <span
                                  role="button"
                                  className="position-absolute top-50 end-0 translate-middle"
                                  style={{
                                    paddingRight: "2.5rem",
                                    fontSize: "large",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
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
                              {errors.password && (
                                <p style={{ color: "red" }}>
                                  {errors.password.message}
                                </p>
                              )}
                            </div>

                            <div className="col-lg-5 col-md-12 col-sm-5">
                              <div className="position-relative">
                                <input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  name="confirm_password"
                                  className={`form-control mb-2 ${errors.confirm_password ? "is-invalid" : ""
                                    }`}
                                  placeholder="Confirm Password"
                                  {...register("confirm_password", {
                                    ...formValidations.confirm_password,
                                    validate: (value) =>
                                      value === getValues("password") ||
                                      "Passwords should match!",
                                  })}
                                />
                                <span
                                  role="button"
                                  className="position-absolute top-50 end-0 translate-middle"
                                  style={{
                                    paddingRight: "2.5rem",
                                    fontSize: "large",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                  }
                                >
                                  {showConfirmPassword ? (
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
                              {errors.confirm_password && (
                                <p style={{ color: "red" }}>
                                  {errors.confirm_password.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {role && (
                          <div className="mb-5 row">
                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                              Role
                            </label>
                            <div className="col-lg-10 col-md-12 col-sm-12">
                              <Controller
                                name="role_id"
                                control={control}
                                defaultValue={edits?.role?.role_id || ""} // Initialize default value
                                rules={formValidations.role_id}
                                render={({
                                  field: { onChange, onBlur, value, ref },
                                }) => {
                                  const selectedLanguage = role?.role.find(
                                    (data) => data.id == value
                                  );

                                  const formattedValue = selectedLanguage
                                    ? {
                                      value: selectedLanguage.id,
                                      label: selectedLanguage.name,
                                    }
                                    : null;

                                  return (
                                    <Select
                                      ref={ref}
                                      value={formattedValue} // Set the formatted value for the Select component
                                      onChange={(selectedOption) => {
                                        const newValue = selectedOption
                                          ? selectedOption.value
                                          : "";
                                        onChange(newValue); // Update form state with value
                                      }}
                                      onBlur={onBlur}
                                      options={role?.role.map((data) => ({
                                        value: data.id,
                                        label: data.name,
                                      }))}
                                      placeholder="Select Role"
                                      className={`react-select-styled react-select-lg ${errors.role_id ? "is-invalid" : ""
                                        }`}
                                      classNamePrefix="react-select"
                                      isSearchable
                                    />
                                  );
                                }}
                              />
                              {errors.role_id && (
                                <p className="invalid-feedback">
                                  {errors.role_id.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <Link href="/dashboard/drivers" className="btn-light me-5">
                  Cancel
                </Link>
                <button id='kt_sign_in_submit' className='justify-content-center btn-primary' disabled={isLoading}>
                  <span className='indicator-progress d-flex justify-content-center'>
                    {isLoading ? (
                      <LoadingIcons.TailSpin height={18} />
                    ) : id ? 'Update' : 'Save'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FleetUserForm;
