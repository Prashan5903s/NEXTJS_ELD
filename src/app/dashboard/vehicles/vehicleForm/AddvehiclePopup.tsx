'use client'
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { debounce } from 'lodash';
import Link from 'next/link';
import LoadingIcons from 'react-loading-icons';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

const formValidations = {
    name: {
        required: "Name is required",
        maxLength: {
            value: 60,
            message: "Name must be at most 60 characters long",
        },
        pattern: {
            value: /^[A-Za-z0-9\s]+$/i,
            message: "Name should be only alphanumeric characters and spaces",
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
            value: /^[A-Za-z0-9\s]+$/i,
            message: "Name should be only alphanumeric characters and spaces",
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
        required: "Fuel tank secondary is required",
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
        required: "Throttle Wifi is required",
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
        throttle_wifi: '',
        notes: "",
        license_plate: "",
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [authenticated, setAuthenticated] = useState(false);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const changeVehicleFieldHandler = (e) => {
        setVehicleField({
            ...vehicleField,
            [e.target.name]: e.target.value
        });
    };

    const useDebouncedSubmit = (callback, delay) => {
        return useCallback(debounce(callback, delay), [callback, delay]);
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        for (const [key, value] of Object.entries(formValidations)) {
            if (value.required && !vehicleField[key]) {
                errors[key] = `${key.replace(/_/g, ' ')} is required`;
                isValid = false;
            } else if (value.minLength && vehicleField[key]?.length < value.minLength.value) {
                errors[key] = value.minLength.message;
                isValid = false;
            } else if (value.maxLength && vehicleField[key]?.length > value.maxLength.value) {
                errors[key] = value.maxLength.message;
                isValid = false;
            } else if (value.pattern && !value.pattern.value.test(vehicleField[key])) {
                errors[key] = value.pattern.message;
                isValid = false;
            }
        }

        setErrors(errors);
        return isValid;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            return; // Stop form submission if validation fails
        }

        setIsLoading(true);
        try {
            const token = getCookie("token");
            const apiUrl = id ? `${url}/transport/vehicle/${id}` : `${url}/transport/vehicle`;
            const method = id ? axios.put : axios.post;
            const response = await method(apiUrl, vehicleField, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                updateVehiclesList();
                close(false);
                router.push("/dashboard/vehicles");
            } else {
                console.error("Failed to save:", response.data);
            }
        } catch (error) {
            console.error("API error:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Create debounced function
    const debouncedSubmit = useDebouncedSubmit(handleFormSubmit, 1000); // Adjust delay as needed

    const onSubmitChange = async (e) => {
        e.preventDefault();
        debouncedSubmit(); // Call the debounced function
    };

    const fetchData = useCallback(debounce(async () => {
        const token = getCookie("token");
        if (!token) return;

        try {
            const response = await axios.get(`${url}/transport/vehicle/create`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormValue(response.data || {});
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }, 1000), [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchEditData = useCallback(debounce(async (id) => {
        const token = getCookie("token");
        if (!token) return;

        try {
            const response = await axios.get(`${url}/transport/vehicle/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEditData(response.data);
            setVehicleField(response.data.vehicle || {});
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }, 1000), [url]);

    useEffect(() => {
        if (id) {
            fetchEditData(id);
        }
    }, [id, fetchEditData]);

    useEffect(() => {
        if (id) {
            if (editData && vehicleField && formValue) {
                setIsDataLoading(true);
            }
        }
    }, [id, editData, vehicleField, formValue])

    useEffect(() => {

        if (!id) {
            if (Object.keys(formValue).length > 0) {
                setIsDataLoading(true);
            }
        }
    }, [
        formValue
    ])

    if (!isDataLoading) {
        return (
            <div className={`modal ${open ? 'showpopup' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="fw-bold"><Skeleton width={180} /></h2>
                            <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                                <i onClick={() => close(false)} className="ki ki-outline ki-cross fs-1"></i>
                            </div>
                        </div>
                        <div className="modal-body mx-5 mx-xl-15 my-7">
                            <form id="kt_modal_add_vehicle_form" className="form fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={onSubmitChange}>
                                {Object.keys(formValidations).map((field, index) => (
                                    <div className="fv-row mb-7" key={index}>
                                        <label className="fs-6 fw-semibold form-label mb-2">
                                            <span className={formValidations[field].required ? "required" : ""}>
                                                {field.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </label>

                                        {field === "make" ? (
                                            <Skeleton width={680} />
                                        ) : field === "fuel_type" ? (
                                            <Skeleton width={680} />
                                        ) : field === "year" ? (
                                            <Skeleton width={680} />
                                        ) : field === "license_state" ? (
                                            <Skeleton width={680} />
                                        ) : field === "fuel_type_primary" || field === "fuel_type_secondary" ? (
                                            <Skeleton width={680} />
                                        ) : field === "throttle_wifi" ? (
                                            <Skeleton width={680} />
                                        ) : (
                                            <Skeleton width={680} />
                                        )}
                                    </div>
                                ))}
                                <div className="d-flex justify-content-center">
                                    <Skeleton width={100} />
                                    <Skeleton width={100} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        <form id="kt_modal_add_vehicle_form" className="form fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={onSubmitChange}>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVehicleModal;
