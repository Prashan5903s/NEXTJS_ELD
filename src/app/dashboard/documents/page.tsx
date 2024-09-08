"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ImagePopupModal from "./addForm/ImagePopup";
import AddDocumentModal from "./addForm/AddDocumentPopup";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { getPermissions } from "@/Components/permission/page";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

const DocumentTable = () => {

  interface Driver {
    id: number;
    first_name: string;
    last_name: string;
  }

  interface DocumentType {
    option_id: number;
    title: string;
  }

  interface Datas {
    drivers: Driver[];
    document_types: DocumentType[];
    // Other properties if needed
  }

  // Initialize state with an empty object matching the Datas interface
  const [datas, setData] = useState<Datas>({ drivers: [], document_types: [] });

  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [docs, setDocs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [Errors, setError] = useState();
  const [modalMode, setModalMode] = useState("add");
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
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
    setImageShowModal(!imageModal);
  };

  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocs(response.data.documents || []);
        setData(response.data || []);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setLoading(false); // Set loading to false once data is fetched
        console.error("Error fetching documents: " + err.message);
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
    fetchDocuments();
  }, [fetchDocuments]);

  const updateDocumentList = () => {
    fetchDocuments(); // Refresh the vehicle list
  };

  const columns = React.useMemo(
    () => [
      {
        header: "Driver",
        accessorKey: "driver_name", // Custom accessorKey for rendering
        cell: (info) => {
          const driver = datas?.drivers.find(
            (driver) => driver.id === info.row.original.driver_id
          );
          return driver
            ? `${driver.first_name} ${driver.last_name}`
            : "Unknown Driver";
        },
      },
      {
        header: "Document type",
        accessorKey: "document_type_title", // Custom accessorKey for rendering
        cell: (info) => {
          const dtype = datas?.document_types.find(
            (dtype) => dtype.option_id == info.row.original.document_type
          );
          return dtype ? dtype.title : dtype;
        },
      },
      {
        header: "File",
        accessorKey: "image",
        cell: (info) => (
          <button
            className="btn btn-icon btn-active-light-primary"
            onClick={() =>
              handleEyeClick(`${assetUrl}/documents/${info.getValue()}`)
            }
          >
            <i className="ki ki-outline ki-eye fs-3"></i>
          </button>
        ),
      },
      { header: "Note", accessorKey: "note" },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => (
          <div
            className={`badge badge-light-${info.getValue() == 1 ? "success" : "danger"
              }`}
          >
            {info.getValue() == 1 ? "Active" : "Inactive"}
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
            {permissn.includes(2) && (
              <button
                className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                onClick={() => openModal("edit", info.row.original.id)}
              >
                <i className="ki ki-outline ki-pencil fs-3"></i>
              </button>
            )}
            <label className="form-switch form-check-solid">
              <input
                className="form-check-input border"
                type="checkbox"
                checked={info.row.original.status}
                onChange={() => {
                  /* handle change */
                }}
              />
            </label>
          </div>
        ),
      },
    ],
    [formattedDate, permissn, datas]
  );

  const table = useReactTable({
    data: docs,
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
      {/* Header and Search bar */}
      <div className="topBar">
        <div className="title">
          <h2>Documents List</h2>
          <div className="path">Dashboard Documents</div>
        </div>
      </div>
      <div className="mainList">
        <div className="row mt-3 card card-flush card-body pt-0">
          <div className="searchBar">
            <div className="search">
              <input
                className="form-control form-control-solid w-250px ps-12"
                type="text"
                placeholder="Search Document"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="search" id="search-container"></div>
            {permissn.includes(1) && (
              <div className="btnGroup">
                <button
                  onClick={() => openModal("add")}
                  className="btn-primary"
                >
                  <i
                    className="ki-outline ki-plus-square fs-3 mr-2"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Add Documents
                </button>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="dataTables_wrapper dt-bootstrap4 no-footer">
            <div className="table-responsive">
              {loading ? (
                <table
                  className="table-row-dashed fs-6 gy-5 dataTable no-footer"
                  id="kt_tr_u_table"
                >
                  <thead>
                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-125px" style={{ width: 308.733 }}>
                        DRIVER
                      </th>
                      <th className="min-w-125px" style={{ width: 125 }}>
                        DOCUMENT TYPE
                      </th>
                      <th className="min-w-125px" style={{ width: 125 }}>
                        FILE
                      </th>
                      <th className="min-w-125px" style={{ width: 125 }}>
                        NOTE
                      </th>
                      <th className="min-w-125px" style={{ width: 125 }}>
                        STATUS
                      </th>
                      <th className="min-w-125px" style={{ width: 125 }}>
                        Joined Date
                      </th>
                      {permissn.includes(2) && (
                        <th
                          className="text-end min-w-100px"
                          style={{ width: 100 }}
                        >
                          Actions
                        </th>
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
                        <td>
                          <Skeleton width={150} />
                        </td>
                        <td>
                          <Skeleton width={100} />
                        </td>
                        <td>
                          <Skeleton width={150} />
                        </td>
                        {permissn.includes(2) && (
                          <td className="text-end">
                            <Skeleton width={100} />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table
                  id="vehicleTable"
                  className="align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer"
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
                  <tbody className="fw-semibold text-gray-600">
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
              )}
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

      {imageModal && (
        <ImagePopupModal
          id={imageToShow}
          open={imageModal}
          close={toggleImageModal}
          imageSrc={imageToShow}
        />
      )}
      {showModal && (
        <AddDocumentModal
          id={selectedVehicleId}
          open={showModal}
          close={toggleModal}
          updateDocumentList={updateDocumentList}
        />
      )}
    </div>
  );
};

export default DocumentTable;
