"use client";
<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { debounce } from 'lodash';
import { useForm, Controller } from "react-hook-form";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import LoadingIcons from 'react-loading-icons';
=======
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
>>>>>>> origin/main

type IFormInput = {
    driver_id: number;
    vehicle_id: number;
    is_active: number;
};

function VehicleAssignForm({ id }) {
    const router = useRouter();
    const [vehicleAssign, setVehicleAssign] = useState(null);
<<<<<<< HEAD
    const [isLoading, setIsLoading] = useState(false);
=======
>>>>>>> origin/main
    const [editVehicleAssign, setEditVehicleAssign] = useState(null);
    const [selectedDriverStatus, setSelectedDriverStatus] = useState<number | null>(null);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const token = getCookie("token");

    const formValidations = {
        driver_id: {
            required: "Driver Id is required",
        },
        vehicle_id: {
            required: "Vehicle ID is required",
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

<<<<<<< HEAD
    // const addvehicleAssign = async (data) => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`${url}/setting/driver/vehicleAssigns`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(data),
    //         });

    //         if (!response.ok) {
    //             setIsLoading(false);
    //             const errorData = await response.json();
    //             toastr["error"]("Error adding driver: " + errorData.message);
    //         } else {
    //             setIsLoading(false);
    //             toastr["success"]("vehicleAssign added successfully!");
    //             router.push("/settings/organization/vehicle-assign");
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         toastr["error"]("Error adding driver: " + error.message);
    //     }
    // };


    // const editvehicleAssign = async (id, data) => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`${url}/settings/vehicle/assign/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(data),
    //         });

    //         if (!response.ok) {
    //             setIsLoading(false);
    //             const errorData = await response.json();
    //             toastr["error"]("Error updating driver: " + errorData.message);
    //         } else {
    //             setIsLoading(false);
    //             toastr["success"]("vehicleAssign updated successfully!");
    //             router.push("/settings/organization/vehicle-assign");
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         toastr["error"]("Error updating driver: " + error.message);
    //     }
    // };

    const fetchEditVehicleAssign = useCallback(debounce(async () => {
        if (!id) return;
        try {
            const response = await fetch(`${url}/settings/vehicle/assign/${id}/edit`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setEditVehicleAssign(responseData);
            } else {
                const errorData = await response.json();
                toastr["error"]("Error fetching driver vehicleAssign: " + errorData.message);
            }
        } catch (error) {
            toastr["error"]("Error fetching driver vehicleAssign: " + error.message);
        }
    }, 1000), [id, url, token]); // Adjust debounce delay as needed

    useEffect(() => {
        fetchEditVehicleAssign();
        // Cleanup function to cancel debounce when the component unmounts or dependencies change
        return () => {
            fetchEditVehicleAssign.cancel();
        };
    }, [fetchEditVehicleAssign]);

    const fetchVehicleAssign = useCallback(debounce(async () => {
        try {
            const response = await fetch(`${url}/settings/vehicle/assign/create`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setVehicleAssign(responseData);
            } else {
                const errorData = await response.json();
                toastr["error"]("Error fetching vehicleAssign data: " + errorData.message);
            }
        } catch (error) {
            toastr["error"]("Error fetching vehicleAssign data: " + error.message);
        }
    }, 1000), [url, token]); // Adjust debounce delay as needed

    useEffect(() => {
        fetchVehicleAssign();
        // Cleanup function to cancel debounce when the component unmounts or dependencies change
        return () => {
            fetchVehicleAssign.cancel();
        };
    }, [fetchVehicleAssign]);

    useEffect(() => {
        if (editVehicleAssign?.vehicleAssign) {
            setValue("driver_id", editVehicleAssign?.vehicleAssign?.driver_id);
            setValue("vehicle_id", editVehicleAssign?.vehicleAssign?.vechile_id || "");
            setValue("is_active", editVehicleAssign?.vehicleAssign?.is_active?.toString() || "");
        }
    }, [editVehicleAssign, setValue]);

    // const onSubmit = async (data) => {
    //     if (id) {
    //         await editvehicleAssign(id, data);
    //     } else {
    //         await addvehicleAssign(data);
    //     }
    // };

    const addvehicleAssign = async (data) => {
        setIsLoading(true);
=======
    const addvehicleAssign = async (data) => {
>>>>>>> origin/main
        try {
            const response = await fetch(`${url}/setting/driver/vehicleAssigns`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
<<<<<<< HEAD
                setIsLoading(false);
                const errorData = await response.json();
                toastr["error"]("Error adding driver: " + errorData.message);
            } else {
                setIsLoading(false);
=======
                const errorData = await response.json();
                toastr["error"]("Error adding driver: " + errorData.message);
            } else {
>>>>>>> origin/main
                toastr["success"]("vehicleAssign added successfully!");
                router.push("/settings/organization/vehicle-assign");
            }
        } catch (error) {
<<<<<<< HEAD
            setIsLoading(false);
=======
>>>>>>> origin/main
            toastr["error"]("Error adding driver: " + error.message);
        }
    };

<<<<<<< HEAD
    const editvehicleAssign = async (id, data) => {
        setIsLoading(true);
=======

    const editvehicleAssign = async (id, data) => {
>>>>>>> origin/main
        try {
            const response = await fetch(`${url}/settings/vehicle/assign/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
<<<<<<< HEAD
                setIsLoading(false);
                const errorData = await response.json();
                toastr["error"]("Error updating driver: " + errorData.message);
            } else {
                setIsLoading(false);
=======
                const errorData = await response.json();
                toastr["error"]("Error updating driver: " + errorData.message);
            } else {
>>>>>>> origin/main
                toastr["success"]("vehicleAssign updated successfully!");
                router.push("/settings/organization/vehicle-assign");
            }
        } catch (error) {
<<<<<<< HEAD
            setIsLoading(false);
=======
>>>>>>> origin/main
            toastr["error"]("Error updating driver: " + error.message);
        }
    };

<<<<<<< HEAD
    // Create a debounced version of the onSubmit function
    const handleSubmits = useCallback(
        debounce(async (data) => {
            if (id) {
                setIsLoading(true);
                await editvehicleAssign(id, data);
            } else {
                setIsLoading(true);
                await addvehicleAssign(data);
            }
        }, 2000), // Adjust debounce delay as needed
        [id, addvehicleAssign, editvehicleAssign]
    );

    const onSubmit = async (data) => {
        handleSubmits(data);
=======
    useEffect(() => {
        const fetchEditvehicleAssign = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${url}/settings/vehicle/assign/${id}/edit`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setEditVehicleAssign(responseData);
                } else {
                    const errorData = await response.json();
                    toastr["error"]("Error fetching driver vehicleAssign: " + errorData.message);
                }
            } catch (error) {
                toastr["error"]("Error fetching driver vehicleAssign: " + error.message);
            }
        };

        fetchEditvehicleAssign();
    }, [id, url, token]);

    useEffect(() => {
        const fetchVehicleAssign = async () => {
            try {
                const response = await fetch(`${url}/settings/vehicle/assign/create`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setVehicleAssign(responseData);
                } else {
                    const errorData = await response.json();
                    toastr["error"]("Error fetching vehicleAssign data: " + errorData.message);
                }
            } catch (error) {
                toastr["error"]("Error fetching vehicleAssign data: " + error.message);
            }
        };

        fetchVehicleAssign();
    }, [url, token]);

    useEffect(() => {
        if (editVehicleAssign?.vehicleAssign) {
            setValue("driver_id", editVehicleAssign?.vehicleAssign?.driver_id);
            setValue("vehicle_id", editVehicleAssign?.vehicleAssign?.vechile_id || "");
            setValue("is_active", editVehicleAssign?.vehicleAssign?.is_active?.toString() || "");
        }
    }, [editVehicleAssign, setValue]);

    const onSubmit = async (data) => {
        if (id) {
            await editvehicleAssign(id, data);
        } else {
            await addvehicleAssign(data);
        }
>>>>>>> origin/main
    };

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
                                Vehicle Assign
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
                                        Vehicle Assign
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
<<<<<<< HEAD
                                        <div className="card overflow-visible card-flush py-4">
                                            <div className="text-center">
                                                <p className="fw-bolder fs-7">{id ? 'Edit Vehicle Assign' : 'Add Vehicle Assign'}</p>
=======
                                        <div className="card card-flush py-4">
                                            <div className="text-center">
                                                <p className="fw-bolder fs-7">vehicleAssign</p>
>>>>>>> origin/main
                                            </div>
                                            <div className="separator my-0"></div>
                                            <div className="card-body mt-4">
                                                {vehicleAssign && (
                                                    <>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Driver
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Controller
                                                                    name="driver_id"
                                                                    control={control}
                                                                    // defaultValue={editvehicleAssign?.vehicleAssign?.hardware_id}
                                                                    rules={formValidations.driver_id}
                                                                    render={({
                                                                        field: { onChange, onBlur, value, ref },
                                                                    }) => {
                                                                        const selectedLanguage =
                                                                            vehicleAssign?.driver?.find(
                                                                                (data) => data.id == value
                                                                            );

                                                                        const formattedValue = selectedLanguage
                                                                            ? {
                                                                                value: selectedLanguage.id,
                                                                                label: `${selectedLanguage.first_name} ${selectedLanguage.last_name}`,
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
                                                                                options={vehicleAssign?.driver?.map(
                                                                                    (data) => ({
                                                                                        value: data.id,
                                                                                        label: `${data.first_name} ${data.last_name}`,
                                                                                    })
                                                                                )}
                                                                                placeholder="Select Driver"
                                                                                className={`react-select-styled react-select-lg ${errors.driver_id ? "is-invalid" : ""}`}
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.driver_id && (
                                                                    <p style={{ color: 'red' }}>
                                                                        {errors.driver_id.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Vehicle
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Controller
                                                                    name="vehicle_id"
                                                                    control={control}
                                                                    defaultValue={editVehicleAssign?.vechile_id}
                                                                    rules={formValidations.vehicle_id}
                                                                    render={({
                                                                        field: { onChange, onBlur, value, ref },
                                                                    }) => {
                                                                        const selectedLanguage =
                                                                            vehicleAssign?.vehicle?.find(
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
                                                                                value={formattedValue}
                                                                                onChange={(selectedOption) => {
                                                                                    const newValue = selectedOption
                                                                                        ? selectedOption.value
                                                                                        : "";

                                                                                    setSelectedDriverStatus(newValue);
                                                                                    onChange(newValue);
                                                                                }}
                                                                                onBlur={onBlur}
                                                                                options={vehicleAssign?.vehicle?.map(
                                                                                    (data) => ({
                                                                                        value: data.id,
                                                                                        label: data.name,
                                                                                    })
                                                                                )}
                                                                                placeholder="Select Vehicle"
                                                                                className={`react-select-styled react-select-lg ${errors.vehicle_id ? "is-invalid" : ""}`}
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.vehicle_id && (
                                                                    <p style={{ color: 'red' }}>
                                                                        {errors.vehicle_id.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
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
<<<<<<< HEAD
                                <button id='kt_sign_in_submit' className='justify-content-center btn-primary' disabled={isLoading}>
                                    <span className='indicator-progress d-flex justify-content-center'>
                                        {isLoading ? (
                                            <LoadingIcons.TailSpin height={18} />
                                        ) : id ? 'Update' : 'Save'}
=======
                                <button type="submit" className="btn-primary">
                                    <span className="indicator-label">Save</span>
                                    <span className="indicator-progress">
                                        Please wait...{" "}
                                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
>>>>>>> origin/main
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

export default VehicleAssignForm;
