'use client'
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import axios from "axios";
import FleetUserForm from "@/Components/fleetUser/page";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

const DriverTable = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const asset_url = process.env.NEXT_PUBLIC_ASSERT_URL;
    const router = useRouter();
    const [fleet, setFleet] = useState([]);
    const [driver, setDriver] = useState([]);
    const [permissn, setPermissn] = useState([]);
    const [data, setData] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    const fetchPermissions = debounce(async (setPermissn) => {
        try {
            const perms = await getPermissions();
            setPermissn(perms);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    }, 1000); // Adjust the debounce delay as needed

    useEffect(() => {
        fetchPermissions(setPermissn);
    }, []); // Empty dependency array ensures this runs only once

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

    // Function to fetch user data
    const fetchUsers = async () => {
        setLoading(true); // Set loading to true when starting to fetch data
        try {
            const token = getCookie('token');
            if (!token) {
                console.error('No token available');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${url}/fleet-user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFleet(response.data.user);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Ensure loading state is updated
        }
    };

    // Debounced fetchUsers function
    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 1000), [url]);

    useEffect(() => {
        debouncedFetchUsers(); // Call the debounced function
    }, [debouncedFetchUsers]);


    if (loading) {
        // Render loading effect while data is being fetched
        return (
            <div className="listItems">
                <div className="topBar">
                    <div className="title">
                        <h2>Fleet user List</h2>
                        <div className="path">Dashboard Fleet User</div>
                    </div>
                </div>
                <div className="mainList">
                    <div className="row mt-3 card card-flush card-body pt-0">
                        <div className="searchBar">
                            <div className="search">
                                <input
                                    className="form-control form-control-solid w-250px ps-12"
                                    type="text"
                                    placeholder="Search Product"
                                />
                            </div>
                            {permissn.includes(10) && (
                                <div className="btnGroup">
                                    <Link href='./fleet-user/formFleet' className="btn-primary">
                                        <i className='ki-outline ki-plus-square fs-3' style={{ marginRight: '8px' }}></i>
                                        Add Fleet User
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                            <div className="table-responsive">
                                <table className="table-row-dashed fs-6 gy-5 dataTable no-footer" id="kt_tr_u_table">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th className="min-w-125px" style={{ width: 308.733 }}>User & roles</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>Mobile No</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>Status</th>
                                            <th className="min-w-125px" style={{ width: 125 }}>Joined Date</th>
                                            {permissn.includes(11) && (
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
                                                {permissn.includes(11) && (
                                                    <td className="text-end"><Skeleton width={100} /></td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row py-5">
                            <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar">
                                <div className="d-flex align-items-center">
                                    <select name="kt_customers_table_length" aria-controls="kt_customers_table" className="form-select form-select-solid form-select-sm" id="dt-length-1">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <label htmlFor="dt-length-1"></label>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                                <div className="dt-paging paging_simple_numbers">
                                    <ul className="pagination">
                                        <li className="dt-paging-button page-item disabled">
                                            <Link href='' className="page-link previous" aria-controls="kt_customers_table" aria-disabled="true" aria-label="Previous" data-dt-idx="previous">
                                                <i className="previous"></i>
                                            </Link>
                                        </li>
                                        <li className="dt-paging-button page-item active">
                                            <Link href="#" className="page-link" aria-controls="kt_customers_table" aria-current="page" data-dt-idx="0" >1</Link>
                                        </li>
                                        <li className="dt-paging-button page-item">
                                            <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="1" >2</Link>
                                        </li>
                                        <li className="dt-paging-button page-item">
                                            <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="2" >3</Link>
                                        </li>
                                        <li className="dt-paging-button page-item">
                                            <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="3" >4</Link>
                                        </li>
                                        <li className="dt-paging-button page-item">
                                            <Link href="#" className="page-link next" aria-controls="kt_customers_table" aria-label="Next" data-dt-idx="next" >
                                                <i className="next"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    // Once loading is complete, render the table
    return (
        <div className="listItems">
            <div className="topBar">
                <div className="title">
                    <h2>Fleet User List</h2>
                    <div className="path">Dashboard Fleet User</div>
                </div>
            </div>
            <div className="mainList">
                <div className="row mt-3 card card-flush card-body pt-0">
                    <div className="searchBar">
                        <div className="search">
                            <input
                                className="form-control form-control-solid w-250px ps-12"
                                type="text"
                                placeholder="Search Product"
                            />
                        </div>
                        {permissn.includes(10) && (
                            <div className="btnGroup">
                                <Link href='./fleet-user/formFleet' className="btn-primary">
                                    <i className='ki-outline ki-plus-square fs-3' style={{ marginRight: '8px' }}></i>
                                    Add Fleet User
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <div className="table-responsive">
                            <table className="table-row-dashed fs-6 gy-5 dataTable no-footer" id="kt_tr_u_table">
                                <thead>
                                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                        <th className="min-w-125px" style={{ width: 308.733 }}>User & roles</th>
                                        <th className="min-w-125px" style={{ width: 125 }}>Mobile No</th>
                                        <th className="min-w-125px" style={{ width: 125 }}>Status</th>
                                        <th className="min-w-125px" style={{ width: 125 }}>Joined Date</th>
                                        {permissn.includes(11) && (
                                            <th className="text-end min-w-100px" style={{ width: 100 }}>Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 fw-semibold">
                                    {fleet && fleet.map((data) => (
                                        <tr className="odd" key={data.id}>
                                            <td className="d-flex align-items-center">
                                                {permissn.includes(36) ? (
                                                    <Link href={`/dashboard/drivers/detail/${data.id}`} legacyBehavior>
                                                        <a className="d-flex align-items-center text-reset text-decoration-none">
                                                            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                                                <div className="symbol-label">
                                                                    <Image
                                                                        src={data.avatar_image ? `${asset_url}/whiteLabel/${data.avatar_image}` : `${asset_url}/assets/img/profile.jpg`}
                                                                        alt={data.first_name}
                                                                        width={50}
                                                                        height={50}
                                                                        layout="responsive"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                {data.first_name} {data.last_name}
                                                                <span>{data.email}</span>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                ) : (
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                                            <div className="symbol-label">
                                                                <Image
                                                                    src={data.avatar_image ? `${asset_url}/whiteLabel/${data.avatar_image}` : `${asset_url}/assets/img/profile.jpg`}
                                                                    alt={data.first_name}
                                                                    width={50}
                                                                    height={50}
                                                                    layout="responsive"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            {data.first_name} {data.last_name}
                                                            <span>{data.email}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {/* {driver.country_code.split(',')[0].trim()} */}
                                                {data.mobile_no}
                                            </td>
                                            <td>
                                                {data.is_active === 1 ? (
                                                    <div className="badge badge-light-success">Active</div>
                                                ) : (
                                                    <div className="badge badge-light-danger">Inactive</div>
                                                )}
                                            </td>
                                            <td>{new Date(data.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} {new Date(data.created_at).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            {permissn.includes(11) && (
                                                <td className="text-end">
                                                    <Link href={`./fleet-user/editFleet/${data.id}`} className="btn btn-light btn-active-light-primary btn-flex btn-center btn-sm">
                                                        Actions <i className="ki ki-outline ki-down fs-5 ms-1"></i>
                                                    </Link>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row py-5">
                        <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar">
                            <div className="d-flex align-items-center">
                                <select name="kt_customers_table_length" aria-controls="kt_customers_table" className="form-select form-select-solid form-select-sm" id="dt-length-1">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label htmlFor="dt-length-1"></label>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                            <div className="dt-paging paging_simple_numbers">
                                <ul className="pagination">
                                    <li className="dt-paging-button page-item disabled">
                                        <Link href='' className="page-link previous" aria-controls="kt_customers_table" aria-disabled="true" aria-label="Previous" data-dt-idx="previous">
                                            <i className="previous"></i>
                                        </Link>
                                    </li>
                                    <li className="dt-paging-button page-item active">
                                        <Link href="#" className="page-link" aria-controls="kt_customers_table" aria-current="page" data-dt-idx="0">1</Link>
                                    </li>
                                    <li className="dt-paging-button page-item">
                                        <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="1">2</Link>
                                    </li>
                                    <li className="dt-paging-button page-item">
                                        <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="2">3</Link>
                                    </li>
                                    <li className="dt-paging-button page-item">
                                        <Link href="#" className="page-link" aria-controls="kt_customers_table" data-dt-idx="3">4</Link>
                                    </li>
                                    <li className="dt-paging-button page-item">
                                        <Link href="#" className="page-link next" aria-controls="kt_customers_table" aria-label="Next" data-dt-idx="next">
                                            <i className="next"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverTable;
