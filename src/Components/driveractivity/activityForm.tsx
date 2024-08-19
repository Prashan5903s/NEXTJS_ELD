"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

type IFormInput = {
    driver_status: number;
    driver_id: number;
    vehicle_id: number;
    message_reason: string;
};

function ActivityForm({ id }) {
    const router = useRouter();
    const [activity, setActivity] = useState(null);
    const [editActivity, setEditActivity] = useState(null);
    const [selectedDriverStatus, setSelectedDriverStatus] = useState<number | null>(null);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const token = getCookie("token");

    const formValidations = {
        driver_status: {
            required: "Driver status is required",
        },
        driver_id: {
            required: "Driver Id is required",
        },
        vehicle_id: {
            required: "Vehicle ID is required",
        },
        message_reason: {
            required: "Message reason is required",
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

    const addActivity = async (data) => {
        try {
            const response = await fetch(`${url}/driver/work/activity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toastr["error"]("Error adding driver: " + errorData.message);
            } else {                
                toastr["success"]("Driver activity successfully!");
                router.push("/settings/organization/driver-activity");
            }
        } catch (error) {
            toastr["error"]("Error adding driver: " + error.message);
        }
    };


    const editactivity = async (id, data) => {
        try {
            const response = await fetch(`${url}/driver/work/activity/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toastr["error"]("Error updating driver: " + errorData.message);
            } else {
                toastr["success"]("Driver activity updated successfully!");
                router.push("/settings/organization/driver-activity");
            }
        } catch (error) {
            toastr["error"]("Error updating driver: " + error.message);
        }
    };

    useEffect(() => {
        const fetchEditActivity = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${url}/driver/work/activity/${id}/edit`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setEditActivity(responseData);
                    setSelectedDriverStatus(responseData.log.current_shift_status || null);
                } else {
                    const errorData = await response.json();
                    toastr["error"]("Error fetching driver activity: " + errorData.message);
                }
            } catch (error) {
                toastr["error"]("Error fetching driver activity: " + error.message);
            }
        };

        fetchEditActivity();
    }, [id, url, token]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`${url}/driver/work/activity/create`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setActivity(responseData);
                } else {
                    const errorData = await response.json();
                    toastr["error"]("Error fetching activity data: " + errorData.message);
                }
            } catch (error) {
                toastr["error"]("Error fetching activity data: " + error.message);
            }
        };

        fetchActivity();
    }, [url, token]);

    useEffect(() => {
        if (editActivity?.log) {
            const driverStatus = editActivity.log.current_shift_status || 0;
            setSelectedDriverStatus(driverStatus);
            setValue("driver_status", driverStatus);
            setValue("driver_id", editActivity.log.driver_id || "");
            setValue("vehicle_id", editActivity.log.vehicle_id || "");
            setValue("message_reason", editActivity.log.message_reason || "");
        }
    }, [editActivity, setValue]);

    useEffect(() => {
        if (selectedDriverStatus == 5) {
            setValue("message_reason", editActivity?.log?.message_reason || "");
        } else {
            setValue("message_reason", ""); // Optionally clear the field if status is not 5
        }
    }, [selectedDriverStatus, setValue, editActivity]);

    const onSubmit = async (data) => {
        if (id) {
            await editactivity(id, data);
        } else {
            await addActivity(data);
        }
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
                                Driver Activity
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
                                        Driver Activity
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
                                                <p className="fw-bolder fs-7">DRIVER & ACTIVITY</p>
                                            </div>
                                            <div className="separator my-0"></div>
                                            <div className="card-body mt-4">
                                                {activity && (
                                                    <>
                                                        <div className="mb-5 row">
                                                            <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                Driver status
                                                            </label>
                                                            <div className="col-lg-10 col-md-12 col-sm-12">
                                                                <Controller
                                                                    name="driver_status"
                                                                    control={control}
                                                                    defaultValue={editActivity?.log?.current_shift_status}
                                                                    rules={formValidations.driver_status}
                                                                    render={({
                                                                        field: { onChange, onBlur, value, ref },
                                                                    }) => {
                                                                        const selectedLanguage =
                                                                            activity?.listOption?.find(
                                                                                (data) => data.option_id == value
                                                                            );

                                                                        const formattedValue = selectedLanguage
                                                                            ? {
                                                                                value: selectedLanguage.option_id,
                                                                                label: selectedLanguage.title,
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
                                                                                options={activity?.listOption?.map(
                                                                                    (data) => ({
                                                                                        value: data.option_id,
                                                                                        label: data.title,
                                                                                    })
                                                                                )}
                                                                                placeholder="Select Driver Status"
                                                                                className={`react-select-styled react-select-lg ${errors.driver_status ? "is-invalid" : ""}`}
                                                                                classNamePrefix="react-select"
                                                                                isSearchable
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.driver_status && (
                                                                    <p className="invalid-feedback">
                                                                        {errors.driver_status.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {!id && activity && (
                                                            <div className="mb-5 row">
                                                                <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                    Driver
                                                                </label>
                                                                <div className="col-lg-10 col-md-12 col-sm-12">
                                                                    <Controller
                                                                        name="driver_id"
                                                                        control={control}
                                                                        defaultValue={editActivity?.log?.driver_id || ""} // Initialize default value
                                                                        rules={formValidations.driver_id}
                                                                        render={({
                                                                            field: { onChange, onBlur, value, ref },
                                                                        }) => {
                                                                            const selectedLanguage =
                                                                                activity?.driver?.find(
                                                                                    (data) => data.id === value
                                                                                );

                                                                            const formattedValue = selectedLanguage
                                                                                ? {
                                                                                    value: selectedLanguage.id,
                                                                                    label: selectedLanguage.first_name,
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
                                                                                    options={activity?.driver?.map(
                                                                                        (data) => ({
                                                                                            value: data.id,
                                                                                            label: data.first_name,
                                                                                        })
                                                                                    )}
                                                                                    placeholder="Select Driver"
                                                                                    className={`react-select-styled react-select-lg ${errors.driver_id ? "is-invalid" : ""
                                                                                        }`}
                                                                                    classNamePrefix="react-select"
                                                                                    isSearchable
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                    {errors.driver_id && (
                                                                        <p className="invalid-feedback">
                                                                            {errors.driver_id.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {!id && activity && (
                                                            <div className="mb-5 row">
                                                                <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                    Vehicle
                                                                </label>
                                                                <div className="col-lg-10 col-md-12 col-sm-12">
                                                                    <Controller
                                                                        name="vehicle_id"
                                                                        control={control}
                                                                        defaultValue={editActivity?.log?.vehicle_id || ""} // Initialize default value
                                                                        rules={formValidations.vehicle_id}
                                                                        render={({
                                                                            field: { onChange, onBlur, value, ref },
                                                                        }) => {
                                                                            const selectedLanguage =
                                                                                activity?.vechile?.find(
                                                                                    (data) => data.id === value
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
                                                                                    options={activity?.vechile?.map(
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
                                                        {selectedDriverStatus == 5 && (
                                                            <div className="mb-5 row">
                                                                <label className="required col-lg-2 col-md-12 col-sm-12 col-form-label">
                                                                    Message reason
                                                                </label>
                                                                <div className="col-lg-10 col-md-12 col-sm-12">
                                                                    <textarea
                                                                        name="message_reason"
                                                                        className={`form-control mb-2 ${errors.message_reason ? "is-invalid" : ""}`}
                                                                        placeholder="Message reason"
                                                                        defaultValue={editActivity?.log?.message_reason}
                                                                        style={{ height: "150px" }}
                                                                        {...register("message_reason", {
                                                                            validate: (value) => {
                                                                                if (selectedDriverStatus == 5 && !value) {
                                                                                    return "Message reason is required";
                                                                                }
                                                                                return true;
                                                                            },
                                                                        })}
                                                                    />
                                                                    {errors.message_reason && (
                                                                        <p className="invalid-feedback">
                                                                            {errors.message_reason.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
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
                                <button type="submit" className="btn-primary">
                                    <span className="indicator-label">Save</span>
                                    <span className="indicator-progress">
                                        Please wait...{" "}
                                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
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

export default ActivityForm;
