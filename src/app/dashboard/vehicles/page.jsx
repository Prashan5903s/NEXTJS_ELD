'use client';
import React, { useEffect, useState, useCallback } from "react";
import AddVehicleModal from './vehicleForm/AddvehiclePopup';
import axios from "axios";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel
} from '@tanstack/react-table';

const VehicleTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [modalMode, setModalMode] = useState('add');
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
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
    }, 300);

    useEffect(() => {
        fetchPermissions(setPermissn);
    }, []);

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

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const token = getCookie("token");
            if (!token) return;

            const response = await axios.get(`${url}/transport/vehicle`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setVehicles(response.data.vehicles || []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchVehicles = useCallback(debounce(fetchVehicles, 300), [url]);

    useEffect(() => {
        debouncedFetchVehicles();
    }, [debouncedFetchVehicles]);

    const updateVehiclesList = () => {
        debouncedFetchVehicles();
    };

    // Define columns
    const columns = React.useMemo(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'VIN', accessorKey: 'vin' },
            { header: 'Make', accessorKey: 'make' },
            { header: 'Model', accessorKey: 'model' },
            { header: 'Year', accessorKey: 'year' },
            { header: 'Harsh Acceleration Setting Type', accessorKey: 'harsh_acceleration_setting_type' },
            { header: 'Notes', accessorKey: 'notes' },
            { header: 'License Plate', accessorKey: 'license_plate' },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) => (
                    <div className={`badge badge-light-${info.getValue() ? 'success' : 'danger'}`}>
                        {info.getValue() ? 'Active' : 'De-active'}
                    </div>
                )
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (info) => formattedDate(info.getValue())
            },
            {
                header: 'Actions',
                cell: (info) => (
                    <div className="text-end">
                        {permissn.includes(2) && (
                            <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3" onClick={() => openModal('edit', info.row.original.id)}>
                                <i className="ki ki-outline ki-pencil fs-3"></i>
                            </button>
                        )}
                        <label className="form-switch form-check-solid">
                            <input className="form-check-input border" type="checkbox" checked={info.row.original.status} onChange={() => {/* handle change */ }} />
                        </label>
                    </div>
                )
            }
        ],
        [formattedDate, permissn]
    );

    // Create table instance
    const table = useReactTable({
        data: vehicles,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
    });

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
                            <input
                                type="text"
                                value={globalFilter || ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search..."
                                className="form-control"
                            />
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
                            {loading ? (
                                <table className="table-row-dashed fs-6 gy-5 dataTable no-footer" id="kt_tr_u_table">
                                    <thead>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                                                ))}
                                            </tr>
                                        ))}
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
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                <td><Skeleton width={150} /></td>
                                                {
                                                    permissn.includes(2) && (
                                                        <td className="text-end"><Skeleton width={100} /></td>
                                                    )
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer">
                                    <thead>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map(row => (
                                            <tr key={row.id}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="pagination">
                                <div className="pagination-controls">
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        <strong>
                                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                        </strong>
                                    </span>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="page-size">
                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => table.setPageSize(Number(e.target.value))}
                                    >
                                        {[10, 20, 30, 40, 50].map(pageSize => (
                                            <option key={pageSize} value={pageSize}>
                                                Show {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <AddVehicleModal id={selectedVehicleId} open={showModal} close={toggleModal} updateVehiclesList={updateVehiclesList} />}
        </div>
    );
};

export default VehicleTable;
