"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
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

const ActivityTable = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const asset_url = process.env.NEXT_PUBLIC_ASSERT_URL;
  const router = useRouter();
  const [device, setDevice] = useState([]);
  const [permissn, setPermissn] = useState([]);
  const [data, setData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchPermissions = debounce(async (setPermissn) => {
    try {
      const perms = await getPermissions();
      setPermissn(perms);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }, 2000); // Adjust the debounce delay as needed

  useEffect(() => {
    fetchPermissions(setPermissn);
  }, []); // Empty dependency array ensures this runs only once

  const fetchUsers = async () => {
    function getCookie(name) {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith(nameEQ)) {
          return cookies[i].substring(nameEQ.length);
        }
      }

      return null;
    }

    const token = getCookie("token");
    if (!token) {
      console.error("No token available");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${url}/setting/driver/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setDevice(response.data.device);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 2000), [url]);

  useEffect(() => {
    debouncedFetchUsers();
  }, [debouncedFetchUsers]);

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
      { header: "Device Type", accessorKey: "device_type.device_type_name" },
      { header: "Hardware", accessorKey: "hardware.hardware_name" },
      { header: "Serial Number", accessorKey: "serial_number" },
      { header: "Gateway Serial", accessorKey: "gateway_serial" },
      { header: "Gateway", accessorKey: "gateway" },
      { header: "Vehicle", accessorKey: "vehicle.name" },
      {
        header: "Actions",
        cell: (info) => (
          <div className="text-end">
            {permissn.includes(34) && (
              <Link
                href={`./device/${info.row.original.id}`}
                className="btn btn-light btn-active-light-primary btn-flex btn-center btn-sm"
              >
                Actions <i className="ki ki-outline ki-down fs-5 ms-1"></i>
              </Link>
            )}
          </div>
        ),
      },
    ],
    [permissn]
  );

  const table = useReactTable({
    data: device,
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
      <div className="listItems">
        <div className="topBar">
          <div className="title">
            <h2>Device List</h2>
            <div className="path">Dashboard Drivers</div>
          </div>
        </div>
        <div className="mainList">
          <div className="row mt-3 card card-flush card-body pt-0">
            <div className="searchBar">
              <div className="search">
                <input
                  className="form-control form-control-solid w-250px ps-12"
                  type="text"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search Device"
                />
              </div>
              {permissn.includes(33) && (
                <div className="btnGroup">
                  <Link
                    href="./drivers/twoColumnDriverFrom"
                    className="btn-primary"
                  >
                    <i
                      className="ki-outline ki-plus-square fs-3"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Add Device
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
                        {permissn.includes(11) && (
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
    );
  }

  // Once loading is complete, render the table
  return (
    <div className="listItems">
      <div className="topBar">
        <div className="title">
          <h2>Device List</h2>
          <div className="path">Dashboard Drivers</div>
        </div>
      </div>
      <div className="mainList">
        <div className="row mt-3 card card-flush card-body pt-0">
          <div className="searchBar">
            <div className="search">
              <input
                className="form-control form-control-solid w-250px ps-12"
                type="text"
                placeholder="Search Device"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            {permissn.includes(33) && (
              <div className="btnGroup">
                <Link href="./device/device-add" className="btn-primary">
                  <i
                    className="ki-outline ki-plus-square fs-3"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Add Device
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
  );
};

export default ActivityTable;
