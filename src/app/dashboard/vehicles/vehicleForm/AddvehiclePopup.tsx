import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { debounce } from 'lodash';
import LoadingIcons from 'react-loading-icons';

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
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
        fuel_type: "",
        fuel_tank_primary: "",
        fuel_tank_secondary: "",
        throttle_wifi: "",
        license_plate: "",
        license_state: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [formValue, setFormValue] = useState({});
    const [editData, setEditData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [licenseStates, setLicenseStates] = useState([]);
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const changeVehicleFieldHandler = (e) => {
        setVehicleField({
            ...vehicleField,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        for (const [key, validation] of Object.entries(formValidations)) {
            if (validation.required && !vehicleField[key]) {
                newErrors[key] = validation.required;
                isValid = false;
            } else if (validation.minLength && vehicleField[key]?.length < validation.minLength.value) {
                newErrors[key] = validation.minLength.message;
                isValid = false;
            } else if (validation.maxLength && vehicleField[key]?.length > validation.maxLength.value) {
                newErrors[key] = validation.maxLength.message;
                isValid = false;
            } else if (validation.pattern && !validation.pattern.value.test(vehicleField[key])) {
                newErrors[key] = validation.pattern.message;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

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

    const onSubmitChange = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const token = getCookie("token");
            const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

            if (id) {
                const response = await axios.put(`${url}/transport/vehicle/${id}`, vehicleField, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    updateVehiclesList();
                    close(false);
                    router.push("/dashboard/vehicles");
                } else {
                    setIsLoading(false);
                    console.error("Failed to save:", response.data);
                }
            } else {
                setIsLoading(true);

                const response = await axios.post(`${url}/transport/vehicle`, vehicleField, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    updateVehiclesList();
                    close(false);
                    router.push("/dashboard/vehicles");
                } else {
                    setIsLoading(false);
                    console.error("Failed to save:", response.data);
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error.response?.data || error);
        }
    };

    useEffect(() => {
        const token = getCookie("token");

        if (token) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
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
    }, [router]);

    useEffect(() => {
        async function fetchData() {
            const token = getCookie("token");

            if (!token) {
                console.error("No token available");
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transport/vehicle/create`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFuelTypes(response.data.fuelTypes || []);
                setLicenseStates(response.data.licenseStates || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const getCookie = (name) => {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());

        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].startsWith(nameEQ)) {
                return cookies[i].substring(nameEQ.length);
            }
        }

        return null;
    };

    // Debounced function
    const debouncedFetchEditData = useCallback(debounce(async () => {
        const token = getCookie("token");

        if (!token) {
            console.error("No token available");
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transport/vehicle/${id}/edit`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditData(response.data);
            setVehicleField({
                ...vehicleField,
                ...response.data.vehicle
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, 300), [vehicleField, id]);

    useEffect(() => {
        if (id) {
            debouncedFetchEditData();
        }
    }, [id, debouncedFetchEditData]);

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
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            <span className="required">
                                                Name
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Name"
                                            value={vehicleField.name}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="vin">
                                            <span className="required">
                                                VIN
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="vin"
                                            name="vin"
                                            placeholder="VIN"
                                            value={vehicleField.vin}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.vin ? 'is-invalid' : ''}`}
                                        />
                                        {errors.vin && <div className="invalid-feedback">{errors.vin}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="vin">
                                            <span className="required">
                                                Make
                                            </span>
                                        </label>
                                        <select
                                            className="form-select form-select-solid"
                                            name='make'
                                            aria-label={`Select Make`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField.make}
                                        >
                                            <option value="">Select an option</option>
                                            {formValue?.make?.map(data => (
                                                <option key={data.option_id} value={data.option_id}>
                                                    {data.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.make && <div style={{ color: 'red' }}>{errors.make}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="model">
                                            <span className="required">
                                                Model
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            placeholder="Model"
                                            value={vehicleField.model}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                                        />
                                        {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="year">
                                            <span className="required">
                                                Year
                                            </span>
                                        </label>
                                        <select
                                            className="form-select form-select-solid"
                                            name="year"
                                            aria-label={`Select year`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField.year}
                                        >
                                            <option value="">Select an option</option>
                                            {Array.from({ length: (2024 - 1990 + 1) }, (_, i) => 1990 + i).map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        {errors && errors.year && <div style={{ color: 'red' }}>{errors.year}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="fuel_type">
                                            <span className="required">
                                                Fuel Type
                                            </span>
                                        </label>
                                        <select
                                            className="form-select form-select-solid"
                                            name="fuel_type"
                                            aria-label={`Select Fuel Type`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField.fuel_type}
                                        >
                                            <option value="">Select an option</option>
                                            {formValue?.option?.map(data => (
                                                <option key={data.option_id} value={data.option_id}>
                                                    {data.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.fuel_type && <div style={{ color: 'red' }}>{errors.fuel_type}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="fuel_tank_primary">
                                            <span className="required">
                                                Fuel Tank Primary
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fuel_tank_primary"
                                            name="fuel_tank_primary"
                                            placeholder="Fuel Tank Primary"
                                            value={vehicleField.fuel_tank_primary}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.fuel_tank_primary ? 'is-invalid' : ''}`}
                                        />
                                        {errors.fuel_tank_primary && <div className="invalid-feedback">{errors.fuel_tank_primary}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="fuel_tank_secondary">
                                            <span className="required">
                                                Fuel Tank Secondary
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fuel_tank_secondary"
                                            name="fuel_tank_secondary"
                                            placeholder="Fuel Tank Secondary"
                                            value={vehicleField.fuel_tank_secondary}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.fuel_tank_secondary ? 'is-invalid' : ''}`}
                                        />
                                        {errors.fuel_tank_secondary && <div className="invalid-feedback">{errors.fuel_tank_secondary}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="throttle_wifi">
                                            <span className="required">
                                                Throttle Wifi
                                            </span>
                                        </label>
                                        <select className="form-select form-select-solid" name="throttle_wifi" value={vehicleField.throttle_wifi} aria-label={`Select Throttle Wifi`} onChange={changeVehicleFieldHandler}>
                                            <option value="">Select Throttle Wifi</option>
                                            {Object.entries(formValue?.throttle_wifi || {}).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.throttle_wifi && <div style={{ color: 'red' }}>{errors.throttle_wifi}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="License state">
                                            <span className="required">
                                                License State
                                            </span>
                                        </label>
                                        <select
                                            className="form-select form-select-solid"
                                            name="license_state"
                                            aria-label={`Select License State`}
                                            onChange={changeVehicleFieldHandler}
                                            value={vehicleField.license_state}
                                        >
                                            <option value="">Select an option</option>
                                            {formValue && formValue.state && formValue?.state?.map((data) => (
                                                <option key={data.state_id} value={data.state_id}>
                                                    {data.state_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.license_state && <div style={{ color: 'red' }}>{errors.license_state}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="license_plate">
                                            <span className="required">
                                                License Plate
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="license_plate"
                                            name="license_plate"
                                            placeholder="License Plate"
                                            value={vehicleField.license_plate}
                                            onChange={changeVehicleFieldHandler}
                                            className={`form-control ${errors.license_plate ? 'is-invalid' : ''}`}
                                        />
                                        {errors && errors.license_plate && <div className="invalid-feedback">{errors.license_plate}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="notes">Notes</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            placeholder="Note"
                                            value={vehicleField.notes}
                                            onChange={changeVehicleFieldHandler}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-btn-grp w-100 text-center pt-15">
                                <button type="button" className="btn btn-light me-3" onClick={() => close(false)}>Cancel</button>
                                <button id='kt_sign_in_submit' className='justify-content-center btn-primary' disabled={isLoading}>
                                    <span className='indicator-progress d-flex justify-content-center'>
                                        {isLoading ? <LoadingIcons.TailSpin height={18} /> : id ? "Update" : "Save"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AddVehicleModal;
