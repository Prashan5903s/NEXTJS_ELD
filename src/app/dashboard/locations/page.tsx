'use client';
import React, { useEffect, useState, useCallback } from "react";
import AddLocationModal from "./locationForm/addLocationPopup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import $ from 'jquery';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LocationTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [modalMode, setModalMode] = useState('add');
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [permissions, setPermissions] = useState([]);

    const fetchPermissions = debounce(async () => {
        try {
            const perms = await getPermissions();
            setPermissions(perms);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    }, 1000);

    useEffect(() => {
        fetchPermissions();
    }, []);

    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const openModal = (mode, locationId = null) => {
        setModalMode(mode);
        setSelectedLocationId(locationId);
        setShowModal(true); // Ensure the modal is opened after setting the mode and ID
    };

    const toggleModal = () => {
        setShowModal(!showModal);
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

    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            axios.get(`${url}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setAuthenticated(true);
                    if (response.data.user_type === "TR") {
                        // Handle TR user
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

        fetchLocation();
    }, [router]);

    useEffect(() => {
        if (locationData.length > 0) {
            const tableInstance = $('#locationTable').DataTable({
                paging: true,
                searching: true,
                destroy: true,
                initComplete: function () {
                    $('#locationTable_filter').detach().appendTo('.searchBar');
                }
            });

            return () => {
                tableInstance.destroy(); // Correctly destroy the table instance
            };
        }
    }, [locationData]);

    // Function to fetch location data
    const fetchLocation = async () => {
        setLoading(true); // Set loading to true when starting to fetch data
        try {
            const token = getCookie("token");
            if (!token) return;

            const response = await axios.get(`${url}/asset/location`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setLocationData(response.data.locations || []);
        } catch (error) {
            console.error('Error fetching location data:', error);
        } finally {
            setLoading(false); // Set loading to false when data fetching is complete
        }
    };

    // Debounced fetchLocation function
    const debouncedFetchLocation = useCallback(debounce(fetchLocation, 1000), [url]);

    // Function to update location list
    const updateLocationList = () => {
        debouncedFetchLocation(); // Refresh the location list with debouncing
    };

    return (
        <div className="listItems">
            <div className="topBar">
                <div className="title">
                    <h2>Locations List</h2>
                    <div className="path">Dashboard Assets Location</div>
                </div>
            </div>
            <div className="mainList">
                <div className="row mt-3 card card-flush card-body pt-0">
                    <div className="searchBar">
                        <div className="search" id="search-container">
                            {/* Search input will be moved by DataTable's initComplete */}
                        </div>
                        {permissions.includes(4) && (
                            <div className="btnGroup">
                                <button onClick={() => openModal('add')} className="btn-primary">
                                    <i className='ki-outline ki-plus-square fs-3 mr-2' style={{ marginRight: '8px' }}></i>
                                    Add Location
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
                                            <th className="min-w-125px" style={{ width: 308.733 }}>NAME</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>ADDRESS</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>ADDRESS TYPE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>HIGH ACCELERATING SETTING TYPE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>NOTES</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>STATUS</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>CREATED</th>
                                            <th className="text-end min-w-100px" style={{ width: 100 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 fw-semibold">
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
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td className="text-end"><Skeleton width={100} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table id="locationTable" className="align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer">
                                    <thead>
                                        <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                            <th className="min-w-125px">Name</th>
                                            <th className="min-w-125px">Address</th>
                                            <th className="min-w-125px">Harsh Acceleration Setting Type</th>
                                            <th className="min-w-125px">Notes</th>
                                            <th className="min-w-125px">Status</th>
                                            <th className="min-w-125px">Created</th>
                                            <th className="text-end min-w-100px">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-semibold text-gray-600">
                                        {locationData && locationData.map(data => (
                                            <tr key={data.id}>
                                                <td>{data.name}</td>
                                                <td>{data.address}</td>
                                                <td>{data.tags}</td>
                                                <td>{data.note}</td>
                                                <td>
                                                    <div className={`badge badge-light-${data.status ? 'success' : 'danger'}`}>
                                                        {data.status ? 'Active' : 'De-active'}
                                                    </div>
                                                </td>
                                                <td>{formattedDate(data.created_at)}</td>
                                                <td className="text-end">
                                                    {permissions.includes(5) && (
                                                        <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', data.id)}>
                                                            <i className="ki ki-outline ki-pencil fs-3"></i>
                                                        </button>
                                                    )}
                                                    <label className="form-switch form-check-solid">
                                                        <input
                                                            className="form-check-input border"
                                                            type="checkbox"
                                                            value=""
                                                            checked={data.status}
                                                            onChange={() => {/* handle change */ }}
                                                        />
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <AddLocationModal id={selectedLocationId} open={showModal} close={toggleModal} updatedLocationData={updateLocationList} />}
        </div>
    );
};

export default LocationTable;
