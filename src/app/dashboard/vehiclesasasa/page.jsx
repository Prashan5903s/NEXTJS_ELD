"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import ToggleSwitch from "../../../Components/statustoggle";
import AddVehicleModal from "./vehicleForm/AddvehiclePopup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";

export const dummyArray = [
  {
    id: "1",
    name: "Harry",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1984",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "2",
    name: "Vikas",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "3",
    name: "kumar",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "4",
    name: "Aditya",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1999",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "5",
    name: "Anil",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1997",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "6",
    name: "Baljinder",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "7",
    name: "Shivam",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2000",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "8",
    name: "Ajay",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1999",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "9",
    name: "Palak",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2001",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "10",
    name: "Sonu",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2002",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "11",
    name: "Vijay",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "12",
    name: "Vikrant",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1992",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "13",
    name: "Rinku",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1984",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "14",
    name: "Simren",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "15",
    name: "RR",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "16",
    name: "Vinod",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1999",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "17",
    name: "Sarder",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1997",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "18",
    name: "Tanveer",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "19",
    name: "vishal",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2000",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "20",
    name: "Gorva",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1999",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "21",
    name: "Rana",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2001",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "22",
    name: "Rajdeep",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "2002",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "23",
    name: "Rajni",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1995",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
  {
    id: "24",
    name: "Akshay",
    VIN: "ghjhh",
    serial: "bjhg",
    Make: "hghg",
    Model: "hsgs",
    Year: "1992",
    Harsh: "ddfdr",
    Notes: "ssdd",
    License: "swswd",
    Status: "Active",
    Created: "10 Apr 2024, 12:18 pm",
    Actions: "",
  },
];
const VehicleTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5, 15, 25);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissn, setPermissn] = useState([]);
  const [listData, setListData] = useState(dummyArray);

  const toggleModal = () => {
    setShowModal(!showModal); // Function to toggle modal visibility
  };
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    function getCookie(name) {
      const nameEQ = name + "=";

      const ca = document.cookie.split(";");

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === " ") c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }

      return null;
    }

    const token = getCookie("token");

    if (token) {
      axios
        .get(`${url}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAuthenticated(true);
          if (response.data.user_type === "TR") {
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
  }, []);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const searchFilter = dummyArray.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setListData(searchFilter.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const searchProduct = (value) => {
    handlePageChange(1)
    if (value.length >= 0) setSearchTerm(value);
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
            <div className="search">
              <input
                className="form-control form-control-solid w-250px ps-12"
                type="text"
                placeholder="Search Product"
                onKeyUp={(e) => searchProduct(e.target.value)}
              />
            </div>
            {permissn.includes(1) && (
              <div className="btnGroup">
                <button onClick={toggleModal} className="btn-primary">
                  <i
                    className="ki-outline ki-plus-square fs-3 mr-2"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Add Vehicle
                </button>
              </div>
            )}
          </div>
          <div className="dataTables_wrapper dt-bootstrap4 no-footer">
            <div className="table-responsive">
              <table
                className=" align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer"
                aria-describedby="kt_vehicles_table_info"
              >
                <thead>
                  <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-50px">S.No</th>
                    <th className="min-w-125px">Name</th>
                    <th className="min-w-125px">VIN</th>
                    <th className="min-w-125px">Serial</th>
                    <th className="min-w-125px">Make</th>
                    <th className="min-w-125px">Model</th>
                    <th className="min-w-125px">Year</th>
                    <th className="min-w-125px">
                      Harsh Acceleration Setting Type
                    </th>
                    <th className="min-w-125px">Notes</th>
                    <th className="min-w-125px">License Plate</th>
                    <th className="min-w-125px">Status</th>
                    <th className="min-w-125px">Created</th>
                    {permissn.includes(2) && (
                      <th className="text-end min-w-100px">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="fw-semibold ">
                  {/* First Row */}
                  {listData.map((vehicle, index) => (
                    <tr key={vehicle.id} className="odd">
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{vehicle.name}</td>
                      <td>{vehicle.VIN}</td>
                      <td>{vehicle.serial}</td>
                      <td>{vehicle.Make}</td>
                      <td>{vehicle.Model}</td>
                      <td>{vehicle.Year}</td>
                      <td>{vehicle.Harsh}</td>
                      <td>{vehicle.Notes}</td>
                      <td>{vehicle.License}</td>
                      <td>
                        <div className="badge badge-light-success">
                          {vehicle.Status}
                        </div>
                      </td>
                      <td>{vehicle.Created}</td>
                      {permissn.includes(2) && (
                        <td className="text-end">
                          <button className="btn btn-icon btn-active-light-primary w-30px h-30px me-3">
                            <i className="ki ki-outline ki-pencil fs-3"></i>
                          </button>
                          <ToggleSwitch />
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
                <select
                  name="kt_customers_table_length"
                  aria-controls="kt_customers_table"
                  className="form-select form-select-solid form-select-sm"
                  id="dt-length-1"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                </select>
                <label htmlFor="dt-length-1"></label>
              </div>
            </div>
            <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
              <div className="dt-paging paging_simple_numbers">
                <ul className="pagination">
                  <li
                    className={`dt-paging-button page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <Link
                      href="#"
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="previous"></i>
                    </Link>
                  </li>
                  {Array.from(
                    { length: Math.ceil(searchFilter.length / itemsPerPage) },
                    (_, index) => (
                      <li
                        key={index}
                        className={`dt-paging-button page-item ${currentPage == index + 1 ? 'active' : ''}`}
                      >
                        <Link
                          href="#"
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Link>
                      </li>
                    )
                  )}
                  <li
                    className={`dt-paging-button page-item ${currentPage ===
                      Math.ceil(searchFilter.length / itemsPerPage)
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <Link
                      href="#"
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="next"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <AddVehicleModal open={showModal} close={setShowModal} />}
    </div>
  );
};

export default VehicleTable;
