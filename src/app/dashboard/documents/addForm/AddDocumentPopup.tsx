import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import axios from "axios";
import LoadingIcons from 'react-loading-icons';

const AddDocumentModal = ({ id, close, open, updateDocumentList }) => {
    const [documentField, setDocumentField] = useState({
        driver_id: "",
        document_type: "",
        file: "",
        notes: "",
        status: "",
    });

    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [editData, setEditData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [docs, setDocs] = useState();
    const [imagePreview, setImagePreview] = useState("");
    const assertURL = process.env.NEXT_PUBLIC_ASSERT_URL;
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const changeVehicleFieldHandler = (e) => {
        const { name, value, files } = e.target;
        setDocumentField((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    const getFileValidations = (id) => ({
        required: !id ? "File is required" : undefined,
        maxSize: {
            value: 2 * 1024 * 1024, // 2MB in bytes
            message: "File size must be less than 2MB",
        },
    });

    const formValidations = {
        driver_id: {
            required: "Driver id is required",
            maxLength: {
                value: 60,
                message: "Name must be at most 60 characters long",
            },
        },
        document_type: {
            required: "Document type is required",
        },
        file: getFileValidations(id),
        status: {
            required: "Status is required",
        },
        notes: {},
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        for (const [key, value] of Object.entries(formValidations)) {
            if (key === "file") {
                if (documentField.file) {
                    if (value.required && !documentField.file) {
                        errors[key] = value.required;
                        isValid = false;
                    } else {
                        if (value.maxSize && documentField.file.size > value.maxSize.value) {
                            errors[key] = value.maxSize.message;
                            isValid = false;
                        }

                        const allowedFormats = ["image/jpeg", "image/png", "pdf", "docs"];
                        if (value.validFormat && !allowedFormats.includes(documentField.file.type)) {
                            errors[key] = value.validFormat.message;
                            isValid = false;
                        }
                    }
                } else if (value.required) {
                    errors[key] = value.required;
                    isValid = false;
                }
            } else {
                if (value.required && !documentField[key]) {
                    errors[key] = value.required;
                    isValid = false;
                } else if (value.minLength && documentField[key]?.length < value.minLength.value) {
                    errors[key] = value.minLength.message;
                    isValid = false;
                } else if (value.maxLength && documentField[key]?.length > value.maxLength.value) {
                    errors[key] = value.maxLength.message;
                    isValid = false;
                } else if (value.pattern && !value.pattern.value.test(documentField[key])) {
                    errors[key] = value.pattern.message;
                    isValid = false;
                }
            }
        }

        setErrors(errors);
        return isValid;
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

    const debouncedSubmit = useCallback(debounce(async (formData, id) => {
        try {
            const token = getCookie("token");
            const urlEndpoint = id ? `${url}/dashboard/document/post/${id}` : `${url}/dashboard/documents`;
            const response = await axios.post(urlEndpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                updateDocumentList();
                close(false);
                router.refresh();
            } else {
                console.error("Failed to save:", response.data);
            }
        } catch (error) {
            console.error("API error:", error.response.data);
            console.log("Something Wrong");
        } finally {
            setIsLoading(false);
        }
    }, 300), [id, documentField]); // Adjust the debounce delay (300ms) as needed

    const onSubmitChange = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();

        for (const key in documentField) {
            if (documentField.hasOwnProperty(key)) {
                if (key === 'file' && documentField[key]) {
                    formData.append(key, documentField[key]);
                } else if (key !== 'file') {
                    formData.append(key, documentField[key]);
                }
            }
        }

        setIsLoading(true);
        debouncedSubmit(formData, id);
    };

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
                return;
            }

            try {
                const response = await axios.get(`${url}/dashboard/documents`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocs(response?.data || {});
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [url]);

    const fetchEditData = useCallback(debounce(async (id) => {
        const token = getCookie("token");
        if (!token) {
            console.error("No token available");
            return;
        }

        try {
            const response = await axios.get(`${url}/dashboard/documents/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEditData(response.data);
            setDocumentField({
                ...documentField,
                ...response.data.doc,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, 1000), [documentField, url]); // Adjust debounce delay (1000 ms) as needed

    // Use effect to call the fetch function
    useEffect(() => {
        if (id) {
            fetchEditData(id);
        }
    }, [id, fetchEditData]); // Dependency array includes fetchEditData

    return (
        <div className={`modal ${open ? 'showpopup' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="fw-bold">{id ? "Edit a Document" : "Add a Document"}</h2>
                        <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                            <i onClick={() => close(false)} className="ki ki-outline ki-cross fs-1"></i>
                        </div>
                    </div>
                    <div className="modal-body mx-5 mx-xl-15 my-7">
                        <form id="kt_modal_add_vehicle_form" className="form fv-plugins-bootstrap5 fv-plugins-framework" noValidate="novalidate" encType="multipart/form-data" onSubmit={onSubmitChange}>
                            <div className="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_add_vehicle_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: true, lg: false}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_add_vehicle_header" data-kt-scroll-wrappers="#kt_modal_add_vehicle_scroll" data-kt-scroll-offset="300px">
                                <div className="mb-7">
                                    <label className="form-label required">Driver</label>
                                    <select
                                        name="driver_id"
                                        className={`form-control ${errors.driver_id ? 'is-invalid' : ''}`}
                                        value={documentField.driver_id}
                                        onChange={changeVehicleFieldHandler}
                                    >
                                        <option value="">Select Driver</option>
                                        {docs && docs.drivers && docs.drivers.map((data) => (
                                            <option key={data.id} value={data.id}>
                                                {data.first_name} {data.last_name} ({data.mobile_no})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.driver_id && (
                                        <div className="invalid-feedback">{errors.driver_id}</div>
                                    )}
                                </div>
                                <div className="mb-7">
                                    <label className="form-label required">Document type</label>
                                    <select
                                        name="document_type"
                                        className={`form-control ${errors.document_type ? 'is-invalid' : ''}`}
                                        value={documentField.document_type}
                                        onChange={changeVehicleFieldHandler}
                                    >
                                        <option value="">Select Document type</option>
                                        {docs && docs.document_types && docs.document_types.map((data) => (
                                            <option key={data.option_id} value={data.option_id}>
                                                {data.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.document_type && (
                                        <div className="invalid-feedback">{errors.document_type}</div>
                                    )}
                                </div>
                                <div className="mb-7">
                                    <label className="form-label required">File</label>
                                    <input
                                        type="file"
                                        name="file"
                                        className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                                        onChange={changeVehicleFieldHandler}
                                    />
                                    {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                                </div>
                                <div className="mb-7">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        name="notes"
                                        className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                        value={documentField.notes}
                                        onChange={changeVehicleFieldHandler}
                                    />
                                    {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                                </div>
                                <div className="mb-7">
                                    <label className="form-label required">Status</label>
                                    <select
                                        name="status"
                                        className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                        value={documentField.status}
                                        onChange={changeVehicleFieldHandler}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                    </select>
                                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                </div>
                            </div>
                            <div className="form-btn-grp w-100 text-center pt-15">
                                <button type="reset" className="btn-light me-3" data-bs-dismiss="modal" aria-label="Close">
                                    Discard
                                </button>
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

export default AddDocumentModal;
