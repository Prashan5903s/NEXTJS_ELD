'use client';
<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> origin/main
import AddVehicleModal from './vehicleForm/AddvehiclePopup';
import axios from "axios";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import $ from 'jquery';
import dynamic from 'next/dynamic';
<<<<<<< HEAD
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles
=======
>>>>>>> origin/main

const VehicleTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [modalMode, setModalMode] = useState('add');
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
<<<<<<< HEAD
    const [loading, setLoading] = useState(true); // Add loading state
=======
>>>>>>> origin/main
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [permissn, setPermissn] = useState([]);

    const fetchPermissions = debounce(async (setPermissn) => {
        try {
            const perms = await getPermissions();
            setPermissn(perms);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    }, 300); // Adjust the debounce delay as needed

    useEffect(() => {
        fetchPermissions(setPermissn);
    }, []); // Empty dependency array ensures this runs only once

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

    const getCookie = (name) => {
<<<<<<< HEAD
=======
        // Your jQuery code
>>>>>>> origin/main
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());

        for (const cookie of cookies) {
            if (cookie.startsWith(nameEQ)) {
                return cookie.substring(nameEQ.length);
            }
        }

        return null;
    };

<<<<<<< HEAD
    // Function to fetch vehicles
    const fetchVehicles = async () => {
        setLoading(true); // Set loading to true before fetching
=======

    const fetchVehicles = async () => {
>>>>>>> origin/main
        try {
            const token = getCookie("token");
            if (!token) return;

            const response = await axios.get(`${url}/transport/vehicle`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setVehicles(response.data.vehicles || []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
<<<<<<< HEAD
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Debounced fetchVehicles function
    const debouncedFetchVehicles = useCallback(debounce(fetchVehicles, 300), [url]);

    // Fetch user data and vehicles
=======
        }
    };

>>>>>>> origin/main
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

<<<<<<< HEAD
        debouncedFetchVehicles(); // Call the debounced function

    }, [router, debouncedFetchVehicles]);
=======
        fetchVehicles();
    }, [router]);
>>>>>>> origin/main

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
    }, [vehicles]);

    const updateVehiclesList = () => {
<<<<<<< HEAD
        debouncedFetchVehicles(); // Refresh the vehicle list
=======
        fetchVehicles(); // Refresh the vehicle list
>>>>>>> origin/main
    };

    return (
        <div className="listItems">
            <div className="topBar">
                <div className="title">
                    <h2>Vehicles List</h2>
                    <div className="path">Dashboard Assets Vehicles</div>
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
                                    Add Vehicle
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <div className="table-responsive">
<<<<<<< HEAD
                            {loading ? (
                                <table className="table-row-dashed fs-6 gy-5 dataTable no-footer" id="kt_tr_u_table">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th className="min-w-125px" style={{ width: 308.733 }}>NAME</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>VIN</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>MAKE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>MODEL</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>YEAR</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>HIGH ACCELERATION SETTING TYPE</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>NOTES</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>LICENSE PLATE</th>
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
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
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
                                            <th className="min-w-125px">Name</th>
                                            <th className="min-w-125px">VIN</th>
                                            <th className="min-w-125px">Make</th>
                                            <th className="min-w-125px">Model</th>
                                            <th className="min-w-125px">Year</th>
                                            <th className="min-w-125px">Harsh Acceleration Setting Type</th>
                                            <th className="min-w-125px">Notes</th>
                                            <th className="min-w-125px">License Plate</th>
                                            <th className="min-w-125px">Status</th>
                                            <th className="min-w-125px">Created</th>
                                            <th className="text-end min-w-100px">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-semibold text-gray-600">
                                        {vehicles.length > 0 ? (
                                            vehicles.map(vehicle => (
                                                <tr key={vehicle.id}>
                                                    <td>{vehicle.name}</td>
                                                    <td>{vehicle.vin}</td>
                                                    <td>{vehicle.make}</td>
                                                    <td>{vehicle.model}</td>
                                                    <td>{vehicle.year}</td>
                                                    <td>{vehicle.harsh_acceleration_setting_type}</td>
                                                    <td>{vehicle.notes}</td>
                                                    <td>{vehicle.license_plate}</td>
                                                    <td>
                                                        <div className={`badge badge-light-${vehicle.status ? 'success' : 'danger'}`}>
                                                            {vehicle.status ? 'Active' : 'De-active'}
                                                        </div>
                                                    </td>
                                                    <td>{formattedDate(vehicle.created_at)}</td>
                                                    <td className="text-end">
                                                        {permissn.includes(2) && (
                                                            <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', vehicle.id)}>
                                                                <i className="ki ki-outline ki-pencil fs-3"></i>
                                                            </button>
                                                        )}
                                                        <label className="form-switch form-check-solid">
                                                            <input className="form-check-input border" type="checkbox" value="" checked={vehicle.status} onChange={() => {/* handle change */ }} />
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
=======
                            <table id="vehicleTable" className="align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer">
                                <thead>
                                    <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                        <th className="min-w-125px">Name</th>
                                        <th className="min-w-125px">VIN</th>
                                        <th className="min-w-125px">Make</th>
                                        <th className="min-w-125px">Model</th>
                                        <th className="min-w-125px">Year</th>
                                        <th className="min-w-125px">Harsh Acceleration Setting Type</th>
                                        <th className="min-w-125px">Notes</th>
                                        <th className="min-w-125px">License Plate</th>
                                        <th className="min-w-125px">Status</th>
                                        <th className="min-w-125px">Created</th>
                                        <th className="text-end min-w-100px">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="fw-semibold text-gray-600">
                                    {vehicles.map(vehicle => (
                                        <tr key={vehicle.id}>
                                            <td>{vehicle.name}</td>
                                            <td>{vehicle.vin}</td>
                                            <td>{vehicle.make}</td>
                                            <td>{vehicle.model}</td>
                                            <td>{vehicle.year}</td>
                                            <td>{vehicle.harsh_acceleration_setting_type}</td>
                                            <td>{vehicle.notes}</td>
                                            <td>{vehicle.license_plate}</td>
                                            <td>
                                                <div className={`badge badge-light-${vehicle.status ? 'success' : 'danger'}`}>
                                                    {vehicle.status ? 'Active' : 'De-active'}
                                                </div>
                                            </td>
                                            <td>{formattedDate(vehicle.created_at)}</td>
                                            <td className="text-end">
                                                {permissn.includes(2) && (
                                                    <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', vehicle.id)}>
                                                        <i className="ki ki-outline ki-pencil fs-3"></i>
                                                    </button>
                                                )}
                                                <label className="form-switch form-check-solid">
                                                    <input className="form-check-input border" type="checkbox" value="" checked={vehicle.status} onChange={() => {/* handle change */ }} />
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
>>>>>>> origin/main
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <AddVehicleModal id={selectedVehicleId} open={showModal} close={toggleModal} updateVehiclesList={updateVehiclesList} />}
        </div>
    );
};

export default VehicleTable;
