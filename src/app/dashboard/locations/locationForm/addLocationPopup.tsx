<<<<<<< HEAD
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingIcons from 'react-loading-icons';
=======
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
>>>>>>> origin/main

const formValidations = {
  name: {
    required: "Name is required",
    maxLength: {
      value: 60,
      message: "Name must be at most 60 characters long",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/i,
      message: "Name should be only alphabetic characters and spaces",
    },
  },
  address: {
    required: "Address is required",
    maxLength: {
      value: 60,
      message: "Address must be at most 60 characters long",
    },
  },
  address_type: {
    required: "Address type is required",
  },
<<<<<<< HEAD
  tags: {
    // Optional field
  },
  note: {
    // Optional field
  },
=======
  vin: {
    required: "VIN is required",
    minLength: {
      value: 17,
      message: "VIN must be at least 17 characters long",
    },
    maxLength: {
      value: 20,
      message: "VIN must be at most 20 characters long",
    },
    pattern: {
      value: /^[0-9]+$/i,
      message: "VIN should be only numeric",
    },
  },
  make: {
    required: "Make is required",
  },
  fuel_type: {
    required: "Fuel type is required",
  },
  model: {
    required: "Model is required",
    maxLength: {
      value: 60,
      message: "Model must be at most 60 characters long",
    },
    pattern: {
      value: /^[A-Za-z]+$/i,
      message: "Model should be only alphabetic characters",
    },
  },
  year: {
    required: "Year is required",
  },
  license_state: {
    required: "License state is required",
  },
  fuel_tank_primary: {
    required: "Fuel tank primary is required",
    maxLength: {
      value: 4,
      message: "Fuel tank primary must be at most 4 characters long",
    },
    pattern: {
      value: /^[0-9]+$/i,
      message: "Fuel tank primary should be only numeric",
    },
  },
  fuel_tank_secondary: {
    required: "License state is required",
    maxLength: {
      value: 4,
      message: "Fuel tank secondary must be at most 4 characters long",
    },
    pattern: {
      value: /^[0-9]+$/i,
      message: "Fuel tank secondary should be only numeric",
    },
  },
  throttle_wifi: {
    required: "Throttle Wifi  is required",
  },
  license_plate: {
    required: "License Plate is required",
    minLength: {
      value: 6,
      message: "License Plate must be at least 6 characters long",
    },
    maxLength: {
      value: 30,
      message: "License Plate must be at most 30 characters long",
    },
  },
  notes: {},
>>>>>>> origin/main
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
};

<<<<<<< HEAD
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const AddLocationModal = ({ id, close, open, updatedLocationData }) => {
  const [locationField, setLocationField] = useState({
    name: "",
    address: "",
    address_type: "",
    tags: "",
    note: "",
=======
const AddLocationModal = ({ id, close, open, updateVehiclesList }) => {
  const [vehicleField, setVehicleField] = useState({
    name: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    fuel_type: "",
    fuel_type_primary: "",
    fuel_type_secondary: "",
    throttle_wifi: 0,
    notes: "",
    license_plate: "",
>>>>>>> origin/main
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [loctn, setLoctn] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const changeVehicleFieldHandler = (e) => {
    const { name, value } = e.target;
    setLocationField({
      ...locationField,
      [name]: value,
=======
  const [editData, setEditData] = useState();
  const [formValue, setFormValue] = useState({});
  const [loctn, setLoctn] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  const changeVehicleFieldHandler = (e) => {
    setVehicleField({
      ...vehicleField,
      [e.target.name]: e.target.value,
>>>>>>> origin/main
    });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

<<<<<<< HEAD
    ["name", "address", "address_type"].forEach((key) => {
      if (formValidations[key]?.required && !locationField[key]) {
        errors[key] = formValidations[key].required;
        isValid = false;
      }
    });

    if (locationField.name && formValidations.name) {
      if (locationField.name.length > formValidations.name.maxLength.value) {
        errors.name = formValidations.name.maxLength.message;
        isValid = false;
      }
      if (!formValidations.name.pattern.value.test(locationField.name)) {
        errors.name = formValidations.name.pattern.message;
        isValid = false;
      }
    }

    if (locationField.address && formValidations.address) {
      if (locationField.address.length > formValidations.address.maxLength.value) {
        errors.address = formValidations.address.maxLength.message;
=======
    for (const [key, value] of Object.entries(formValidations)) {
      if (value.required && !vehicleField[key]) {
        errors[key] = `${key.replace(/_/g, " ")} is required`;
>>>>>>> origin/main
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

<<<<<<< HEAD
  const handleFormSubmission = async () => {
    const token = getCookie("token");
    if (!token) {
      console.error("No token available");
      return;
    }
    try {
      setIsLoading(true);

      const apiUrl = id ? `${url}/asset/location/${id}` : `${url}/asset/location`;
      const method = id ? "put" : "post";

      const response = await axios({
        method,
        url: apiUrl,
        data: locationField,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        updatedLocationData(); // Refresh the location list
        close(false); // Close the modal
        router.push("/dashboard/locations"); // Redirect
      } else {
        console.error("Failed to save/update:", response.data);
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFormSubmission = debounce(handleFormSubmission, 300);

  const onSubmitChange = (e) => {
    e.preventDefault();
    if (validateForm()) {
      debouncedFormSubmission();
    }
  };

=======
  const onSubmitChange = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        const token = getCookie("token");
        const response = await axios.put(
          `${url}/transport/vehicle/${id}`,
          vehicleField,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          updateVehiclesList();
          close(false);
          router.push("/dashboard/vehicles");
        } else {
          console.error("Failed to save:", response.data);
        }
      } catch (error) {
        console.error("API error:", error.response.data);
      }
    } else {
      try {
        const token = getCookie("token");
        const response = await axios.post(
          `${url}/transport/vehicle`,
          vehicleField,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          updateVehiclesList();
          close(false);
          router.push("/dashboard/vehicles");
        } else {
          console.error("Failed to save:", response.data);
        }
      } catch (error) {
        console.error("API error:", error.response.data);
      }
    }
  };

  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

>>>>>>> origin/main
  useEffect(() => {
    const token = getCookie("token");

    if (token) {
      axios
        .get(`${url}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAuthenticated(true);
          if (response.data.user_type === "TR") {
            // handle TR user
          } else if (response.data.user_type === "EC") {
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
  }, [router, url]);

  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");

      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await axios.get(`${url}/asset/location`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

<<<<<<< HEAD
        setLoctn(response?.data || {});
=======
        setLoctn(response?.data);
>>>>>>> origin/main
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [url]);

<<<<<<< HEAD
  useEffect(() => {
    async function fetchEditData() {
      if (!id) return; // Only fetch if `id` exists
=======
  console.log("Location", loctn?.address_types);

  useEffect(() => {
    async function fetchEditData() {
>>>>>>> origin/main
      const token = getCookie("token");

      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await axios.get(
<<<<<<< HEAD
          `${url}/asset/location/${id}/edit`,
=======
          `${url}/transport/vehicle/${id}/edit`,
>>>>>>> origin/main
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

<<<<<<< HEAD
        const { location } = response.data;
        setEditData(location);
        setLocationField({
          name: location.name || "",
          address: location.address || "",
          address_type: location.type || "", // Assuming `type` corresponds to `address_type`
          tags: location.tags || "",
          note: location.note || "",
        });
      } catch (error) {
        console.error("Error fetching edit data:", error);
      }
    }

    fetchEditData();
=======
        setEditData(response.data);
        setVehicleField({
          ...vehicleField,
          ...response.data.vehicle,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (id) {
      fetchEditData();
    }
>>>>>>> origin/main
  }, [url, id]);

  return (
    <div
      className={`modal ${open ? "showpopup" : ""}`}
<<<<<<< HEAD
      style={{ display: open ? "block" : "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered w-95 h-90 mw-650px mh-350px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">{id ? "Edit Location" : "Add Location"}</h2>
=======
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            {id ? (
              <h2 className="fw-bold">Edit Location</h2>
            ) : (
              <h2 className="fw-bold">Add Location</h2>
            )}
>>>>>>> origin/main
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              data-bs-dismiss="modal"
            >
              <i
                onClick={() => close(false)}
                className="ki ki-outline ki-cross fs-1"
              ></i>
            </div>
          </div>
          <div className="modal-body mx-5 mx-xl-15 my-7">
            <form
              id="kt_modal_add_vehicle_form"
              className="form fv-plugins-bootstrap5 fv-plugins-framework"
<<<<<<< HEAD
              onSubmit={onSubmitChange}
=======
>>>>>>> origin/main
            >
              {Object.keys(formValidations).map((field, index) => (
                <div className="fv-row mb-7" key={index}>
                  <label className="fs-6 fw-semibold form-label mb-2">
                    <span
                      className={
<<<<<<< HEAD
                        formValidations[field]?.required ? "required" : ""
=======
                        formValidations[field].required ? "required" : ""
>>>>>>> origin/main
                      }
                    >
                      {field.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </label>

<<<<<<< HEAD
                  {field === "address" || field === "note" ? (
=======
                  {field === "make" ? (
                    <select
                      className="form-select form-select-solid"
                      name={field}
                      aria-label={`Select ${field}`}
                      onChange={changeVehicleFieldHandler}
                      value={vehicleField[field]}
                    >
                      <option value="">Select an option</option>
                      {formValue?.make?.map((data) => (
                        <option key={data.option_id} value={data.option_id}>
                          {data.title}
                        </option>
                      ))}
                    </select>
                  ) : field === "fuel_type" ? (
                    <select
                      className="form-select form-select-solid"
                      name={field}
                      aria-label={`Select ${field}`}
                      onChange={changeVehicleFieldHandler}
                      value={vehicleField[field]}
                    >
                      <option value="">Select an option</option>
                      {formValue?.option?.map((data) => (
                        <option key={data.option_id} value={data.option_id}>
                          {data.title}
                        </option>
                      ))}
                    </select>
                  ) : field === "year" ? (
                    <select
                      className="form-select form-select-solid"
                      name={field}
                      aria-label={`Select ${field}`}
                      onChange={changeVehicleFieldHandler}
                      value={vehicleField[field]}
                    >
                      <option value="">Select an option</option>
                      {Array.from(
                        { length: 2024 - 1990 + 1 },
                        (_, i) => 1990 + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  ) : field === "address" ? (
>>>>>>> origin/main
                    <textarea
                      className="form-control form-control-solid"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      name={field}
                      onChange={changeVehicleFieldHandler}
<<<<<<< HEAD
                      value={locationField[field]}
=======
                      value={vehicleField[field]}
>>>>>>> origin/main
                    />
                  ) : field === "address_type" ? (
                    <div className="d-flex flex-wrap gap-3 mt-3 mb-2">
                      {loctn?.address_types &&
<<<<<<< HEAD
                        Object.entries(loctn.address_types).map(([key, value]) => (
                          <div key={key}>
                            <input
                              className="form-check-input me-3 cursor-pointer"
                              name="address_type"
                              type="radio"
                              value={key}
                              id={key}  // Ensure this ID is unique
                              onChange={changeVehicleFieldHandler}
                              checked={locationField.address_type == key}
                            />
                            <label
                              className="form-check-label fs-6"
                              htmlFor={key} // Use the same ID as in the input
                            >
                              {value}
                            </label>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <input
                      type="text"
=======
                        Object.entries(loctn.address_types).map(
                          ([key, value]) => (
                            <div key={key}>
                              <input
                                className="form-check-input me-3 cursor-pointer"
                                name="type"
                                type="radio"
                                value={key}
                                id={value.replace(/\s+/g, "_").toLowerCase()}
                              />
                              <label
                                className="form-check-label cursor-pointer"
                                htmlFor={value
                                  .replace(/\s+/g, "_")
                                  .toLowerCase()}
                              >
                                <div className="fw-bold text-gray-800">
                                  {value}
                                </div>
                              </label>
                            </div>
                          )
                        )}
                    </div>
                  ) : field === "throttle_wifi" ? (
                    <select
                      className="form-select form-select-solid"
                      name={field}
                      value={vehicleField[field]}
                      aria-label={`Select ${field}`}
                      onChange={changeVehicleFieldHandler}
                    >
                      <option value="">Select an option</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  ) : (
                    <input
                      type={field.includes("password") ? "password" : "text"}
>>>>>>> origin/main
                      className="form-control form-control-solid"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      name={field}
                      onChange={changeVehicleFieldHandler}
<<<<<<< HEAD
                      value={locationField[field]}
                    />
                  )}
                  {errors[field] && (
                    <div className="text-danger mt-2">{errors[field]}</div>
                  )}
                </div>
              ))}

              <div className="form-btn-grp w-100 text-center pt-15">
                <div className="form-btn-grp w-100 text-center pt-15">
                  <button
                    type="reset"
                    className="btn-light me-3"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Discard
                  </button>
                  <button id='kt_sign_in_submit' className='justify-content-center btn-primary'>
                    <span className='indicator-progress d-flex justify-content-center'>
                      {isLoading ? <LoadingIcons.TailSpin height={18} /> : id ? "Update" : "Save"}
                    </span>
                  </button>
                </div>
=======
                      value={vehicleField[field]}
                    />
                  )}
                  {errors[field] && (
                    <div className="fv-plugins-message-container invalid-feedback">
                      <div>{errors[field]}</div>
                    </div>
                  )}
                </div>
              ))}
              <div className="form-btn-grp w-100 text-center pt-15">
                <button
                  type="reset"
                  className="btn-light me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  id="kt_modal_add_vehicle_submit"
                  className="btn btn-primary"
                  onClick={onSubmitChange}
                >
                  <span className="indicator-label">Save</span>
                  <span className="indicator-progress">
                    Please wait...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
>>>>>>> origin/main
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
