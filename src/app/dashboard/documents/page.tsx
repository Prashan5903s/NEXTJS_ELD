'use client'
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ImagePopupModal from "./addForm/ImagePopup";
import AddDocumentModal from "./addForm/AddDocumentPopup";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import $ from 'jquery';
import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles

const DocumentTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [imageModal, setImageShowModal] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [docs, setDocs] = useState([]);
    const [datas, setData] = useState([]);
    const [Errors, setError] = useState();
    const [modalMode, setModalMode] = useState('add');
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [imageToShow, setImageToShow] = useState(null); // Add state for modal image
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [permissn, setPermissn] = useState([]);
    const assetUrl = process.env.NEXT_PUBLIC_ASSERT_URL;

    const fetchPermissions = useCallback(
        debounce(async () => {
            setLoading(true); // Set loading state to true before fetching permissions
            try {
                const perms = await getPermissions();
                setPermissn(perms);
            } catch (error) {

                // setError('Error fetching permissions: ' + error.message);
            } finally {
            }
        }, 1000), // Debounce time in milliseconds
        [] // No dependencies, this will only be created once
    );

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]); // Dependency on the debounced function

    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const openModal = (mode, vehicleId = null) => {
        setModalMode(mode);
        setSelectedVehicleId(vehicleId);
        setShowModal(true);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleImageModal = () => {
        setImageShowModal(!imageModal)
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

    const fetchDocuments = useCallback(
        debounce(async () => {
            setLoading(true);
            const token = getCookie("token");
            if (!token) return;
            try {
                // Replace this URL with the actual endpoint for fetching documents
                const response = await axios.get(`${url}/dashboard/documents`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDocs(response.data.documents || []);
                setData(response.data || []);
                setLoading(false); // Set loading to false once data is fetched
            } catch (err) {
                setLoading(false); // Set loading to false once data is fetched
                console.error('Error fetching documents: ' + err.message);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        }, 1000), // Debounce time in milliseconds
        [] // Dependencies if any
    );

    const handleEyeClick = (image) => {
        setImageToShow(image); // Set the image to show in modal
        setImageShowModal(true); // Open the modal
    };

    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            axios.get(`${url}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setAuthenticated(true);
                    if (response.data.user_type === "TR") {
                        // Do something specific for TR users
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

        fetchDocuments();
    }, [router]);

    useEffect(() => {
        const initializeDataTable = () => {
            if ($.fn.DataTable.isDataTable('#vehicleTable')) {
                $('#vehicleTable').DataTable().destroy(); // Destroy previous instance
            }

            $('#vehicleTable').DataTable({
                paging: true,
                searching: true,
                destroy: true,
                initComplete: function () {
                    $('#vehicleTable_filter').detach().appendTo('.searchBar');
                }
            });
        };

        if (vehicles.length > 0) {
            initializeDataTable();
        }

        return () => {
            if ($.fn.DataTable.isDataTable('#vehicleTable')) {
                $('#vehicleTable').DataTable().destroy();
            }
        };
    }, [docs]);

    const updateDocumentList = () => {
        fetchDocuments(); // Refresh the vehicle list
    };

    return (
        <div className="listItems">
            <div className="topBar">
                <div className="title">
                    <h2>Documents List</h2>
                    <div className="path">Dashboard Documents</div>
                </div>
            </div>
            <div className="mainList">
                <div className="row mt-3 card card-flush card-body pt-0">
                    <div className="searchBar">
                        <div className="search" id="search-container">
                            {/* Search input will be moved by DataTable's initComplete */}
                        </div>
                        {permissn.includes(1) && (
                            <div className="btnGroup">
                                <button onClick={() => openModal('add')} className="btn-primary">
                                    <i className='ki-outline ki-plus-square fs-3 mr-2' style={{ marginRight: '8px' }}></i>
                                    Add Documents
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <div className="table-responsive">
                            {loading ? (
                                <table className="table-row-dashed fs-6 gy-5 dataTable no-footer" id="kt_tr_u_table">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th className="min-w-125px" style={{ width: 308.733 }}>DRIVER</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>DOCUMENT TYPE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>FILE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>NOTE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>STATUS</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>Joined Date</th>
                                            {permissn.includes(2) && (
                                                <th className="text-end min-w-100px" style={{ width: 100 }}>Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 fw-semibold">
                                        {/* Skeleton loaders for rows */}
                                        {[...Array(5)].map((_, index) => (
                                            <tr key={index}>
                                                <td className="d-flex align-items-center">
                                                    <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                                        <Skeleton circle={true} height={50} width={50} />
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <Skeleton width={100} />
                                                        <Skeleton width={150} />
                                                    </div>
                                                </td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={150} /></td>
                                                {permissn.includes(2) && (
                                                    <td className="text-end"><Skeleton width={100} /></td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table id="vehicleTable" className="align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer">
                                    <thead>
                                        <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                            <th className="min-w-125px">Driver</th>
                                            <th className="min-w-125px">Document type</th>
                                            <th className="min-w-125px">File</th>
                                            <th className="min-w-125px">Note</th>
                                            <th className="min-w-125px">Status</th>
                                            <th className="min-w-125px">Created</th>
                                            <th className="text-end min-w-100px">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-semibold text-gray-600">
                                        {docs && docs.length > 0 ? (
                                            docs.map(data => {
                                                // Find the corresponding driver data
                                                const driver = datas && datas?.drivers.find(daty => daty.id == data.driver_id);
                                                const dtype = datas && datas?.document_types.find(daty => daty.option_id == data.document_type);
                                                return (
                                                    <tr key={data.id}>
                                                        <td>
                                                            {driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver'}
                                                        </td>
                                                        <td>{dtype && dtype.title}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-icon btn-active-light-primary"
                                                                onClick={() => handleEyeClick(`${assetUrl}/documents/${data.image}`)}
                                                            >
                                                                <i className="ki ki-outline ki-eye fs-3"></i>
                                                            </button>
                                                        </td>
                                                        <td>{data.note}</td>
                                                        <td>
                                                            <div className={`badge badge-light-${data.status == 1 ? 'success' : 'danger'}`}>
                                                                {data.status == 1 ? 'Active' : 'Inactive'}
                                                            </div>
                                                        </td>
                                                        <td>{formattedDate(data.created_at)}</td>
                                                        <td className="text-end">
                                                            {permissn.includes(2) && (
                                                                <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', data.id)}>
                                                                    <i className="ki ki-outline ki-pencil fs-3"></i>
                                                                </button>
                                                            )}
                                                            <label className="form-switch form-check-solid">
                                                                <input
                                                                    className="form-check-input border"
                                                                    type="checkbox"
                                                                    checked={data.status}
                                                                    onChange={() => {/* handle change */ }}
                                                                />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Document Image</h5>
                                <button type="button" className="close" onClick={() => setImageToShow(null)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {imageToShow && <img src={imageToShow} alt="Document" style={{ width: '100%', height: 'auto' }} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {
                imageModal &&
                <ImagePopupModal
                    id={imageToShow}
                    open={imageModal}
                    close={toggleImageModal}
                    onRequestClose={() => setImageShowModal(false)}
                    imageSrc={imageToShow}
                />
            }
            {showModal && <AddDocumentModal id={selectedVehicleId} open={showModal} close={toggleModal} updateDocumentList={updateDocumentList} />}
        </div>
    );
};

export default DocumentTable;
