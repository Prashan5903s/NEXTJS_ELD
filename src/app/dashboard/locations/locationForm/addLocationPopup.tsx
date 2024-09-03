'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingIcons from 'react-loading-icons';

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
  tags: {
    // Optional field
  },
  note: {
    // Optional field
  },
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
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();
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
    });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

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
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

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

  const debouncedFormSubmission = debounce(handleFormSubmission, 1000);

  const onSubmitChange = (e) => {
    e.preventDefault();
    if (validateForm()) {
      debouncedFormSubmission();
    }
  };

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

        setLoctn(response?.data || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [url]);

  useEffect(() => {
    async function fetchEditData() {
      if (!id) return; // Only fetch if `id` exists
      const token = getCookie("token");

      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await axios.get(
          `${url}/asset/location/${id}/edit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, [url, id]);

  return (
    <div
      className={`modal ${open ? "showpopup" : ""}`}
      style={{ display: open ? "block" : "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered w-95 h-90 mw-650px mh-350px">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bold">{id ? "Edit Location" : "Add Location"}</h2>
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
              onSubmit={onSubmitChange}
            >
              {Object.keys(formValidations).map((field, index) => (
                <div className="fv-row mb-7" key={index}>
                  <label className="fs-6 fw-semibold form-label mb-2">
                    <span
                      className={
                        formValidations[field]?.required ? "required" : ""
                      }
                    >
                      {field.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </label>

                  {field === "address" || field === "note" ? (
                    <textarea
                      className="form-control form-control-solid"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      name={field}
                      onChange={changeVehicleFieldHandler}
                      value={locationField[field]}
                    />
                  ) : field === "address_type" ? (
                    <div className="d-flex flex-wrap gap-3 mt-3 mb-2">
                      {loctn?.address_types &&
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
                      className="form-control form-control-solid"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      name={field}
                      onChange={changeVehicleFieldHandler}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
