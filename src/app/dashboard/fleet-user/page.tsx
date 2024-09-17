"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSession } from 'next-auth/react';
import { debounce } from "lodash";
import { getPermissions } from "@/Components/permission/page";
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import Skeleton CSS

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

const FLeetTable = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const asset_url = process.env.NEXT_PUBLIC_ASSERT_URL;
  const router = useRouter();
  const [fleet, setFleet] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [permissn, setPermissn] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  interface User {
    token: string;
    // Add other properties you expect in the user object
  }

  interface SessionData {
    user?: User;
    // Add other properties you expect in the session data
  }

  const { data: session } = useSession() as { data?: SessionData } || {};

  const token = session && session.user && session?.user?.token;

  const fetchPermissions = useCallback(
    debounce(async (token) => {
      try {
        const perms = await getPermissions(token);
        setPermissn(perms);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setTimeout(() => fetchPermissions(token), 5000); // Retry after 5 seconds
        } else {
          console.error("Error fetching permissions:", error);
        }
      }
    }, 1000), // Increase debounce to 2 seconds
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchPermissions(token);
    }
  }, [fetchPermissions, token]);

  // Function to fetch user data
  const fetchUsers = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      if (!token) {
        console.error("No token available");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${url}/fleet-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFleet(response.data.user);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  // Debounced fetchUsers function
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 1000), [url, token]);

  useEffect(() => {
    if (token) {
      debouncedFetchUsers(); // Call the debounced function
    }
  }, [debouncedFetchUsers, token]);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const columns = React.useMemo(
    () => [
      {
        header: "User & Roles",
        accessorKey: "first_name", // Placeholder, not used in cell rendering
        cell: (info) => {
          const { first_name, last_name, email, avatar_image, id } =
            info.row.original; // Access the correct data
          return (
            <div className="d-flex align-items-center">
              <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                <div className="symbol-label">
                  <Image
                    src={
                      avatar_image
                        ? `${asset_url}/whiteLabel/${avatar_image}`
                        : `${asset_url}/assets/img/profile.jpg`
                    }
                    alt={first_name}
                    width={50}
                    height={50}
                    layout="responsive"
                  />
                </div>
              </div>
              <div className="d-flex flex-column">
                {first_name} {last_name}
                <span>{email}</span>
              </div>
            </div>
          );
        },
      },
      { header: "Mobile No", accessorKey: "mobile_no" },
      {
        header: "Status",
        accessorKey: "is_active",
        cell: (info) => (
          <div
            className={`badge badge-light-${info.getValue() ? "success" : "danger"
              }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </div>
        ),
      },
      {
        header: "Created",
        accessorKey: "created_at",
        cell: (info) => formattedDate(info.getValue()),
      },
      {
        header: "Actions",
        accessorKey: "id",
        cell: (info) => (
          <div className="text-end">
            {permissn && permissn.length > 0 && permissn.includes(11) && (
              <td className="text-end">
                <Link
                  href={`./fleet-user/editFleet/${info.getValue()}`}
                  className="btn btn-light btn-active-light-primary btn-flex btn-center btn-sm"
                >
                  Actions <i className="ki ki-outline ki-down fs-5 ms-1"></i>
                </Link>
              </td>
            )}
          </div>
        ),
      },
    ],
    [formattedDate, permissn]
  );

  const table = useReactTable({
    data: fleet,
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

  if (loading) {
    // Render loading effect while data is being fetched
    return (
      <>
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
                  <Skeleton width={150} height={20} />
                </div>
                {permissn && permissn.length > 0 && permissn.includes(10) && (
                  <div className="btnGroup">
                    <Link href="./fleet-user/formFleet" className="btn-primary">
                      <i
                        className="ki-outline ki-plus-square fs-3"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Add Fleet User
                    </Link>
                  </div>
                )}
              </div>
              <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                <div className="table-responsive">
                  <table
                    className="table-row-dashed fs-6 gy-5 dataTable no-footer"
                    id="kt_tr_u_table"
                  >
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
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
                          <td>
                            <Skeleton width={150} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={150} />
                          </td>
                          <td>
                            <Skeleton width={150} />
                          </td>
                          {permissn && permissn.length > 0 && permissn.includes(11) && (
                            <td className="text-end">
                              <Skeleton width={100} />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Once loading is complete, render the table
  return (
    <>
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
                  placeholder="Search Fleet User"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
              {permissn && permissn.length > 0 && permissn.includes(10) && (
                <div className="btnGroup">
                  <Link href="./fleet-user/formFleet" className="btn-primary">
                    <i
                      className="ki-outline ki-plus-square fs-3"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Add Fleet User
                  </Link>
                </div>
              )}
            </div>
            <div className="dataTables_wrapper dt-bootstrap4 no-footer">
              <div className="table-responsive">
                <table
                  className="table-row-dashed fs-6 gy-5 dataTable no-footer"
                  id="kt_tr_u_table"
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="text-gray-600 fw-semibold">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="d-flex py-4">
                      <select
                        className="form-select bg-gray-100 border-0"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        style={{ width: "auto", display: "inline-block" }}
                      >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="ms-4 py-4">
                      {(() => {
                        const pageSize = table.getState().pagination.pageSize;
                        const pageIndex = table.getState().pagination.pageIndex;
                        const totalRows = table.getCoreRowModel().rows.length;
                        const startRow = pageIndex * pageSize + 1;
                        const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
                        return `Showing ${startRow} to ${endRow} of ${totalRows} records`;
                      })()}
                    </div>
                  </div>
                  <nav aria-label="Table pagination">
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${!table.getCanPreviousPage() ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          <i className="fs-1 ki-left ki-outline"></i>
                        </button>
                      </li>
                      {Array.from({ length: table.getPageCount() }).map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${table.getState().pagination.pageIndex === index
                            ? "active p-0 btn-primary"
                            : ""
                            }`}
                        >
                          <button
                            className={`page-link ${table.getState().pagination.pageIndex === index
                              ? "p-0 btn-primary text-white"
                              : ""
                              }`}
                            onClick={() => table.setPageIndex(index)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${!table.getCanNextPage() ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          <i className="fs-1 ki-right ki-outline"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FLeetTable;
