'use client';
import React, { useEffect, useState } from "react";
import AddLocationModal from "./locationForm/addLocationPopup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import $ from 'jquery';
import dynamic from 'next/dynamic';

const VehicleTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [Location, setLocation] = useState([]);
    const [modalMode, setModalMode] = useState('add');
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
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
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());

        for (const cookie of cookies) {
            if (cookie.startsWith(nameEQ)) {
                return cookie.substring(nameEQ.length);
            }
        }

        return null;
    };

    const fetchLocation = async () => {
        try {
            const token = getCookie("token");
            if (!token) return;

            const response = await axios.get(`${url}/asset/location`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setLocation(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
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

        fetchLocation();
    }, [router]);

    useEffect(() => {
        const initializeDataTable = () => {
            const table = $('#locationTable').DataTable({
                paging: true,
                searching: true,
                destroy: true, // Ensure old instances are destroyed
                initComplete: function () {
                    $('#locationTable_filter').detach().appendTo('.searchBar');
                }
            });

            return table;
        };

        let tableInstance;
        if (Location && Location.locations && Location.locations.length > 0) {
            tableInstance = initializeDataTable();
        }

        return () => {
            if (tableInstance) {
                tableInstance.destroy(); // Destroy the table instance on unmount
            }
        };
    }, [Location]);

    const updateVehiclesList = () => {
        fetchLocation(); // Refresh the vehicle list
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
                        {permissn.includes(1) && (
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
                                    {Location && Location?.locations?.map(data => (
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
                                                {permissn.includes(2) && (
                                                    <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', data.id)}>
                                                        <i className="ki ki-outline ki-pencil fs-3"></i>
                                                    </button>
                                                )}
                                                <label className="form-switch form-check-solid">
                                                    <input className="form-check-input border" type="checkbox" value="" checked={data.status} onChange={() => {/* handle change */ }} />
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <AddLocationModal id={selectedVehicleId} open={showModal} close={toggleModal} updateVehiclesList={updateVehiclesList} />}
        </div>
    );
};

export default VehicleTable;
