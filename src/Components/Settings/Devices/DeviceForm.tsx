"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toastr from "toastr";
import axios from "axios";
import "toastr/build/toastr.min.css";
import LoadingIcons from 'react-loading-icons';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

type IFormInput = {
    hardware: number;
    device_type: number;
    is_active: number;
    vehicle_id: number;
    gateway: number;
    gateway_serial: number;
    serial_number: string;

};

function DeviceForm({ id }) {
    const router = useRouter();
    const [device, setDevice] = useState(null);
    const [editDevice, setEditdevice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [selectedDriverStatus, setSelectedDriverStatus] = useState<number | null>(null);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const token = getCookie("token");

    let userId = id ? id : null;

    async function checkSerialNumberUniqueness(serial = null) {
        
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

        try {
            if (!token) {
                console.error("No token available");
                return false; // Consider email not unique if no token
            }

            const response = await axios.get(`${url}/check/serial/${serial}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data === 0; // If no users found, email is unique
        } catch (error) {
            console.error("Error fetching users:", error);
            return false; // Consider email not unique on error
        }
    }

    const formValidations = {
        hardware: {
            required: "Hardware is required",
        },
        device_type: {
            required: "Device type is required",
        },
        serial_number: {
            required: "Serial number is required",
            minLength: {
                value: 12,
                message: "Serial number must be at least 12 characters long",
            },
            maxLength: {
                value: 40,
                message: "Serial number must be at most 40 characters long",
            },
            pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Serial number must contain only letters and numbers",
            },
            validate: async (serial_number) => {
                const isUnique = await checkSerialNumberUniqueness(serial_number);
                return isUnique || "Serial Number already exists";
            },
        },
        vehicle_id: {},
        gateway: {
            required: "Gateway is required",
            minLength: {
                value: 12,
                message: "Gateway must be at least 12 characters long",
            },
            maxLength: {
                value: 40,
                message: "Gateway must be at most 40 characters long",
            },
            pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Gateway must contain only letters and numbers",
            },
        },
        gateway_serial: {
            required: "Gateway serial is required",
            minLength: {
                value: 12,
                message: "Gateway serial must be at least 12 characters long",
            },
            maxLength: {
                value: 40,
                message: "Gateway serial must be at most 40 characters long",
            },
            pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Gateway serial must contain only letters and numbers",
            },
        },
        is_active: {
            required: "Is active is required",
        },
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control,
    } = useForm<IFormInput>();

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: "5000",
    };

    const fetchEditdevice = useCallback(debounce(async () => {
        if (!id) return;
        try {
            const response = await fetch(`${url}/setting/driver/devices/${id}/edit`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setEditdevice(responseData);
            } else {
                const errorData = await response.json();
                toastr["error"]("Error fetching driver device: " + errorData.message);
            }
        } catch (error) {
            toastr["error"]("Error fetching driver device: " + error.message);
        }
    }, 2000), [id, url, token]);

    useEffect(() => {
        fetchEditdevice();
    }, [fetchEditdevice]);

    const fetchDevice = useCallback(debounce(async () => {
        try {
            const response = await fetch(`${url}/setting/driver/devices/create`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setDevice(responseData);
            } else {
                const errorData = await response.json();
                toastr["error"]("Error fetching device data: " + errorData.message);
            }
        } catch (error) {
            toastr["error"]("Error fetching device data: " + error.message);
        }
    }, 2000), [url, token]);

    useEffect(() => {
        fetchDevice();
    }, [fetchDevice]);


    useEffect(() => {
        if (editDevice?.device) {
            setValue("hardware", editDevice?.device?.hardware_id);
            setValue("device_type", editDevice?.device?.device_type_id || "");
            setValue("vehicle_id", editDevice.device.vehicle_id || "");
            setValue("gateway_serial", editDevice?.device.gateway_serial || "");
            setValue("gateway", editDevice?.device?.gateway || "");
            setValue("is_active", editDevice?.device?.is_active?.toString() || "");
        }
    }, [editDevice, setValue]);

    const debouncedAddDevice = useCallback(
        debounce(async (data) => {
            setIsLoading(true);
            try {
                const response = await fetch(`${url}/setting/driver/devices`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    setIsLoading(false);
                    const errorData = await response.json();
                    toastr["error"]("Error adding driver: " + errorData.message);
                } else {
                    setIsLoading(false);
                    toastr["success"]("Device added successfully!");
                    router.push("/settings/device");
                }
            } catch (error) {
                setIsLoading(false);
                toastr["error"]("Error adding driver: " + error.message);
            }
        }, 2000), // Adjust debounce delay as needed
        [url, token, router]
    );

    const debouncedEditDevice = useCallback(
        debounce(async (id, data) => {
            setIsLoading(true);
            try {
                const response = await fetch(`${url}/setting/driver/devices/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    setIsLoading(false);
                    const errorData = await response.json();
                    toastr["error"]("Error updating driver: " + errorData.message);
                } else {
                    setIsLoading(false);
                    toastr["success"]("Device updated successfully!");
                    router.push("/settings/device");
                }
            } catch (error) {
                setIsLoading(false);
                toastr["error"]("Error updating driver: " + error.message);
            }
        }, 2000), // Adjust debounce delay as needed
        [url, token, router]
    );

    const onSubmit = async (data) => {
        if (id) {
            await debouncedEditDevice(id, data);
        } else {
            await debouncedAddDevice(data);
        }
    };

    useEffect(() => {
        if (id) {

            if (editDevice && device) {
                setIsDataLoading(true);
            }

        } else {

            if (device) {
                setIsDataLoading(true);
            }

        }
    }, [id, device, editDevice])

    if (!isDataLoading) {
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
                                    <Skeleton width={180} />
                                </h1>
                                <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                                    <li className="breadcrumb-item text-muted">
                                        <Link href="#" className="text-muted text-hover-primary">
                                            <Skeleton width={60} />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                    </li>
                                    <li className="breadcrumb-item text-muted">
                                        <Link href="#" className="text-muted text-hover-primary">
                                            <Skeleton width={60} />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                    </li>
                                    <li className="breadcrumb-item text-muted">
                                        <Link href="#" className="text-muted text-hover-primary">
                                            <Skeleton width={60} />
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
                                                    <p className="fw-bolder fs-7"><Skeleton width={180} /></p>
                                                </div>
                                                <div className="separator my-0"></div>
                                                <div className="card-body mt-4">

                                                    <>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Hardware
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Device type
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Serial Number
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Gateway Serial
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Gateway
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Vehicle
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Status
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Skeleton width={660} />
                                                            </div>
                                                        </div>
                                                    </>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Skeleton width={100} />
                                    <Skeleton width={100} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

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
                                Device
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
                                        Device
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
                                                <p className="fw-bolder fs-7">{id ? 'Edit DEVICE' : 'Add DEVICE'}</p>
                                            </div>
                                            <div className="separator my-0"></div>
                                            <div className="card-body mt-4">
                                                {device && (
                                                    <>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Hardware
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Controller
                                                                    name="hardware"
                                                                    control={control}
                                                                    defaultValue={editDevice?.device?.hardware_id}
                                                                    rules={formValidations.hardware}
                                                                    render={({
                                                                        field: { onChange, onBlur, value, ref },
                                                                    }) => {
                                                                        const selectedLanguage =
                                                                            device?.hardware?.find(
                                                                                (data) => data.id == value
                                                                            );

                                                                        const formattedValue = selectedLanguage
                                                                            ? {
                                                                                value: selectedLanguage.id,
                                                                                label: selectedLanguage.hardware_name,
                                                                            }
                                                                            : null;

                                                                        return (
                                                                            <Select
                                                                                ref={ref}
                                                                                value={formattedValue}
                                                                                onChange={(selectedOption) => {
                                                                                    const newValue = selectedOption
                                                                                        ? selectedOption.value
                                                                                        : "";

                                                                                    setSelectedDriverStatus(newValue);
                                                                                    onChange(newValue);
                                                                                }}
                                                                                onBlur={onBlur}
                                                                                options={device?.hardware?.map(
                                                                                    (data) => ({
                                                                                        value: data.id,
                                                                                        label: data.hardware_name,
                                                                                    })
                                                                                )}
                                                                                placeholder="Select Hardware"
                                                                                className={`react-select-styled react-select-lg ${errors.hardware ? "is-invalid" : ""}`}
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.hardware && (
                                                                    <p style={{ color: 'red' }}>
                                                                        {errors.hardware.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Device type
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Controller
                                                                    name="device_type"
                                                                    control={control}
                                                                    defaultValue={editDevice?.device?.cargo_type_id}
                                                                    rules={formValidations.device_type}
                                                                    render={({
                                                                        field: { onChange, onBlur, value, ref },
                                                                    }) => {
                                                                        const selectedLanguage =
                                                                            device?.device_type?.find(
                                                                                (data) => data.id == value
                                                                            );

                                                                        const formattedValue = selectedLanguage
                                                                            ? {
                                                                                value: selectedLanguage.id,
                                                                                label: selectedLanguage.device_type_name,
                                                                            }
                                                                            : null;

                                                                        return (
                                                                            <Select
                                                                                ref={ref}
                                                                                value={formattedValue}
                                                                                onChange={(selectedOption) => {
                                                                                    const newValue = selectedOption
                                                                                        ? selectedOption.value
                                                                                        : "";

                                                                                    setSelectedDriverStatus(newValue);
                                                                                    onChange(newValue);
                                                                                }}
                                                                                onBlur={onBlur}
                                                                                options={device?.device_type?.map(
                                                                                    (data) => ({
                                                                                        value: data.id,
                                                                                        label: data.device_type_name,
                                                                                    })
                                                                                )}
                                                                                placeholder="Select Device Type"
                                                                                className={`react-select-styled react-select-lg ${errors.device_type ? "is-invalid" : ""}`}
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.device_type && (
                                                                    <p style={{ color: 'red' }}>
                                                                        {errors.device_type.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Serial Number
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <input
                                                                    type="text"
                                                                    name="serial_number"
                                                                    className={`form-control mb-2 ${errors.serial_number ? "is-invalid" : ""
                                                                        }`}
                                                                    placeholder="Serial Number"
                                                                    defaultValue={editDevice?.device?.serial_number}
                                                                    {...register(
                                                                        "serial_number",
                                                                        formValidations.serial_number
                                                                    )}
                                                                />
                                                                {errors.serial_number && (
                                                                    <p className="invalid-feedback">
                                                                        {errors.serial_number.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Gateway Serial
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <input
                                                                    type="text"
                                                                    name="gateway_serial"
                                                                    className={`form-control mb-2 ${errors.gateway_serial ? "is-invalid" : ""
                                                                        }`}
                                                                    placeholder="Gateway Serial"
                                                                    defaultValue={editDevice?.device?.gateway_serial}
                                                                    {...register(
                                                                        "gateway_serial",
                                                                        formValidations.gateway_serial
                                                                    )}
                                                                />
                                                                {errors.gateway_serial && (
                                                                    <p className="invalid-feedback">
                                                                        {errors.gateway_serial.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Gateway
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <input
                                                                    type="text"
                                                                    name="gateway"
                                                                    className={`form-control mb-2 ${errors.gateway ? "is-invalid" : ""
                                                                        }`}
                                                                    placeholder="Gateway"
                                                                    defaultValue={editDevice?.device?.gateway}
                                                                    {...register(
                                                                        "gateway",
                                                                        formValidations.gateway
                                                                    )}
                                                                />
                                                                {errors.gateway && (
                                                                    <p className="invalid-feedback">
                                                                        {errors.gateway.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {device && (
                                                            <div className="mb-5 row">
                                                                <label className="col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                    Vehicle
                                                                </label>
                                                                <div className="col-lg-10 col-md-12 col-sm-12">
                                                                    <Controller
                                                                        name="vehicle_id"
                                                                        control={control}
                                                                        defaultValue={editDevice?.device?.vehicle_id || ""} // Initialize default value
                                                                        rules={formValidations.vehicle_id}
                                                                        render={({
                                                                            field: { onChange, onBlur, value, ref },
                                                                        }) => {
                                                                            const selectedLanguage =
                                                                                device?.vehicle?.find(
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
                                                                                    options={device?.vehicle?.map(
                                                                                        (data) => ({
                                                                                            value: data.id,
                                                                                            label: data.name,
                                                                                        })
                                                                                    )}
                                                                                    placeholder="Select Vehicle"
                                                                                    className={`react-select-styled react-select-lg ${errors.vehicle_id ? "is-invalid" : ""
                                                                                        }`}
                                                                                    classNamePrefix="react-select"
                                                                                    isSearchable
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                    {errors.vehicle_id && (
                                                                        <p className="invalid-feedback">
                                                                            {errors.vehicle_id.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Status
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <select
                                                                    name="is_active"
                                                                    className="form-control mb-2"
                                                                    {...register("is_active", {
                                                                        required: "Please select a Status",
                                                                    })}
                                                                    aria-invalid={!errors.is_active}
                                                                >
                                                                    <option value="" disabled>
                                                                        Select Status
                                                                    </option>
                                                                    <option value="1">Active</option>
                                                                    <option value="0">Inactive</option>
                                                                </select>
                                                                {errors.is_active && (
                                                                    <p style={{ color: "red" }} className="mt-1">
                                                                        {errors.is_active.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
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

export default DeviceForm;
