import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
};

const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());

    for (const cookie of cookies) {
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }

    return null;
};


const AddVehicleModal = ({ id, close, open, updateVehiclesList }) => {
    const [vehicleField, setVehicleField] = useState({
        name: "",
        vin: "",
        make: "",
        model: "",
        year: "",
        fuel_type: '',
        fuel_type_primary: '',
        fuel_type_secondary: '',
        throttle_wifi: 0,
        notes: "",
        license_plate: "",
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [editData, setEditData] = useState();
    const [formValue, setFormValue] = useState({});
    const [authenticated, setAuthenticated] = useState(false);

    const changeVehicleFieldHandler = (e) => {
        setVehicleField({
            ...vehicleField,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        for (const [key, value] of Object.entries(formValidations)) {
            if (value.required && !vehicleField[key]) {
                errors[key] = `${key.replace(/_/g, ' ')} is required`;
                isValid = false;
            }
        }

        setErrors(errors);
        return isValid;
    };

    const onSubmitChange = async (e) => {
        e.preventDefault();
        if (id) {

            try {
                const token = getCookie("token");
                const response = await axios.put(`${url}/transport/vehicle/${id}`, vehicleField, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    updateVehiclesList();
                    close(false);
                    router.push("/dashboard/vehicles"); // Move the redirect after updating vehicles list
                } else {
                    console.error("Failed to save:", response.data);
                }
            } catch (error) {
                console.error("API error:", error.response.data);
                console.log("Something Wrong");

            }

        } else {

            try {
                const token = getCookie("token");
                const response = await axios.post(`${url}/transport/vehicle`, vehicleField, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    updateVehiclesList();
                    close(false);
                    router.push("/dashboard/vehicles"); // Move the redirect after updating vehicles list
                } else {
                    console.error("Failed to save:", response.data);
                }
            } catch (error) {
                console.error("API error:", error.response.data);
                console.log("Something Wrong");

            }

        }

    };

    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const token = getCookie("token");

        if (token) {
            axios.get(`${url}/user`, {
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
                return; // You may want to handle this scenario accordingly
            }

            try {
                const response = await axios.get(`${url}/transport/vehicle/create`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFormValue(response?.data || {});
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error appropriately
            }
        }

        fetchData();
    }, [url]);

    useEffect(() => {
        async function fetchEditData() {
            const token = getCookie("token");

            if (!token) {
                console.error("No token available");
                return; // You may want to handle this scenario accordingly
            }

            try {
                const response = await axios.get(`${url}/transport/vehicle/${id}/edit`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(vehicleField, response.data);


                setEditData(response.data);
                setVehicleField({
                    ...vehicleField,
                    ...response.data.vehicle
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error appropriately
            }
        }

        if (id) {
            fetchEditData();
        }
    }, [url, id]);

    useEffect(() => {
        async function fetchEditData() {
            const token = getCookie("token");

            if (!token) {
                console.error("No token available");
                return; // You may want to handle this scenario accordingly
            }

            try {
                const response = await axios.get(`${url}/transport/vehicle/${id}/edit`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(vehicleField, response.data);


                setEditData(response.data);
                setVehicleField({
                    ...vehicleField,
                    ...response.data.vehicle
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error appropriately
            }
        }

        // if (id) {
        //     fetchEditData();
        // }
    }, [url, id])

    return (
        <div className={`modal ${open ? 'showpopup' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
                <div className="modal-content">
                    <div className="modal-header">
                        {id ? (
                            <h2 className="fw-bold">Edit a Vehicle</h2>
                        ) : (
                            <h2 className="fw-bold">Add a Vehicle</h2>
                        )}
                        <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                            <i onClick={() => close(false)} className="ki ki-outline ki-cross fs-1"></i>
                        </div>
                    </div>
                    <div className="modal-body mx-5 mx-xl-15 my-7">
                        <form id="kt_modal_add_vehicle_form" className="form fv-plugins-bootstrap5 fv-plugins-framework">
                            {Object.keys(formValidations).map((field, index) => (
                                <div className="fv-row mb-7" key={index}>
                                    <label className="fs-6 fw-semibold form-label mb-2">
                                        <span className={formValidations[field].required ? "required" : ""}>
                                            {field.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </label>

                                    {field === "make" ? (
                                        <select
                                            className="form-select form-select-solid"
                                            name={field}
                                            aria-label={`Select ${field}`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField[field]}
                                        >
                                            <option value="">Select an option</option>
                                            {formValue?.make?.map(data => (
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
                                            {formValue?.option?.map(data => (
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
                                            {Array.from({ length: (2024 - 1990 + 1) }, (_, i) => 1990 + i).map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field === "license_state" ? (
                                        <select
                                            className="form-select form-select-solid"
                                            name={field}
                                            aria-label={`Select ${field}`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField[field]}
                                        >
                                            <option value="">Select an option</option>
                                            {formValue?.state?.map((data) => (
                                                <option key={data.state_id} value={data.state_id}>
                                                    {data.state_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field === "fuel_type_primary" || field === "fuel_type_secondary" ? (
                                        <input
                                            className="form-control form-control-solid"
                                            placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                            name={field}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField[field]}
                                        />
                                    ) : field === "throttle_wifi" ? (
                                        <select className="form-select form-select-solid" name={field} value={vehicleField[field]} aria-label={`Select ${field}`} onChange={changeVehicleFieldHandler}>
                                            <option value="">Select an option</option>
                                            {Object.entries(formValue?.throttle_wifi || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}

                                            )}
                                        </select>
                                    ) : (
                                        <input
                                            className="form-control form-control-solid"
                                            placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                            name={field}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField[field]}
                                        />
                                    )}

                                    {errors[field] && <div style={{ color: "red", marginTop: "5px" }}>{errors[field]}</div>}
                                </div>
                            ))}
                            <div className="form-btn-grp w-100 text-center pt-15">
                                <button type="reset" className="btn-light me-3" data-bs-dismiss="modal" aria-label="Close">
                                    Discard
                                </button>
                                <button type="submit" id="kt_modal_add_vehicle_submit" className="btn btn-primary" onClick={onSubmitChange}>
                                    <span className="indicator-label">Save</span>
                                    <span className="indicator-progress">
                                        Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVehicleModal;
