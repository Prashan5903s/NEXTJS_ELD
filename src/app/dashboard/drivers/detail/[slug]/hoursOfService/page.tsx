<<<<<<< HEAD
"use client";
import React, { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
=======
// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import StepLineChart from "../../../../../../Components/driverdetails/StepLineChart";
// import { DateRangePicker } from "react-date-range";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css";
// import { useParams } from "next/navigation";
// import 'react-loading-skeleton/dist/skeleton.css';
// import LineChart from "../../../../../../Components/GraphComponents/LineChart";
// import { useJsApiLoader } from '@react-google-maps/api';

// export default function HoursOfService({ params }) {
//   const driverId = params.slug;
//   const [isDateOpen, setIsDateOpen] = useState(new Set());
//   const [isAllOpen, setIsAllOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [dropdown, setDropdown] = useState(false);
//   const [isViolation, setIsViolation] = useState(false); // Example initialization
//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);

//   const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: MapKey,
//     libraries: ['geometry', 'drawing'],
//   });

//   const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   const [data, setData] = useState(null);
//   const [detail, setDetail] = useState(null);
//   const [log, setLog] = useState([]);
//   const [addrssStart, setAddrssStart] = useState(null);
//   const [addrssEnd, setAddrssEnd] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const [isHourOpen, setIsHourOpen] = useState(false);
//   const { slug } = useParams();

//   const today = new Date();
//   const pastDate = new Date(today);
//   pastDate.setDate(today.getDate() - 7);

//   // Function to format a date as yyyy-mm-dd
//   function formatDate(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   const [date_start, setDateStart] = useState(formatDate(pastDate));
//   const [date_end, setDateEnd] = useState(formatDate(today));

//   // Set default date range to today and 7 days back
//   useEffect(() => {
//     setDateRange([
//       {
//         startDate: pastDate,
//         endDate: today,
//         key: "selection",
//       },
//     ]);
//   }, []);

//   function getCookie(name) {
//     const nameEQ = `${name}=`;
//     const cookies = document.cookie.split(';').map(cookie => cookie.trim());

//     for (let i = 0; i < cookies.length; i++) {
//       if (cookies[i].startsWith(nameEQ)) {
//         return cookies[i].substring(nameEQ.length);
//       }
//     }

//     return null;
//   }

//   const token = getCookie("token");

//   useEffect(() => {
//     if (!slug) return;

//     const fetchDriverDetails = async () => {
//       try {
//         const response = await fetch(`${BackEND}/driver/hos/detail/${slug}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const result = await response.json();

//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDriverDetails();
//   }, []);

//   useEffect(() => {
//     if (!slug || !date_start || !date_end) return;

//     const fetchLogs = async () => {
//       setLoading(true); // Ensure loading state is true when fetching logs
//       try {
//         const response = await fetch(`${BackEND}/driver/date/log/${slug}/${date_start}/${date_end}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const result = await response.json();

//         setLog(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false); // Ensure loading state is false after fetching logs
//       }
//     };

//     fetchLogs();
//   }, [slug, date_start, date_end]); // Depend on slug, date_start, and date_end


//   const handleDropdown = () => {
//     setDropdown(!dropdown);
//   };

//   const handleCollapseAll = () => {
//     setIsAllOpen(false);
//     setIsDateOpen(new Set());
//   };

//   const handleExpandAll = () => {
//     const allIndexes = new Set(finalData.map((_, index) => index));
//     setIsDateOpen(allIndexes);
//     setIsAllOpen(true);
//   };

//   const handleToggleDate = (index) => {
//     const newExpandedRows = new Set(isDateOpen);
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);
//     }

//     setIsDateOpen(newExpandedRows);
//     setIsAllOpen(newExpandedRows.size === finalData.length);
//   };

//   const handleSelect = (ranges) => {
//     setDateRange([ranges.selection]); // Update the date range state

//     // Update date_start and date_end based on the selected range
//     const startDate = formatDate(ranges.selection.startDate);
//     const endDate = formatDate(ranges.selection.endDate);

//     setDateStart(startDate);
//     setDateEnd(endDate);

//     setOpen(false); // Close the date range picker
//   };


//   const toggleDatePicker = () => {
//     setOpen(!open);
//   };

//   function addrToLatLng(lat, lng) {
//     return new Promise((resolve, reject) => {
//       if (window.google) { // Ensure Google Maps API is loaded
//         if (!isNaN(lat) && !isNaN(lng)) {
//           const geocoder = new window.google.maps.Geocoder();
//           const latLng = new window.google.maps.LatLng(lat, lng);

//           geocoder.geocode({ location: latLng }, (results, status) => {
//             if (status === window.google.maps.GeocoderStatus.OK) {
//               if (results[0]) {
//                 const startAddress = results[0].formatted_address;
//                 resolve(startAddress);
//               } else {
//                 console.log('No results found');
//                 reject('No results found');
//               }
//             } else {
//               console.error('Geocoder failed due to: ' + status);
//               reject('Geocoder failed: ' + status);
//             }
//           });
//         } else {
//           reject('Invalid latitude or longitude');
//         }
//       } else {
//         reject('Google Maps API not loaded');
//       }
//     });
//   }

//   // React Functional Component
//   const AddressCell = ({ lat, lng }) => {
//     const [address, setAddress] = useState('...');

//     useEffect(() => {
//       const fetchAddress = async () => {
//         try {
//           const addr = await addrToLatLng(lat, lng);
//           setAddress(addr as string)
//         } catch (error) {
//           console.error(error);
//           setAddress('Error retrieving address');
//         }
//       };

//       if (lat !== undefined && lng !== undefined) {
//         fetchAddress();
//       }
//     }, [lat, lng]);

//     return (
//       <td className="text-start">
//         {address}
//       </td>
//     );
//   };


//   const tableData = Array.isArray(log) && log.length > 0 ? log.map(logEntry => {

//     const dateKey = Object.keys(logEntry)[0];

//     const entryData = logEntry[dateKey][0];

//     const entryDatas = logEntry[dateKey];

//     const startLoc = logEntry[dateKey][3];

//     const endLoc = logEntry[dateKey][4];

//     const dataEntry = logEntry[dateKey][2];

//     var data_shift = [];
//     var data_cycle = [];
//     var data_drive = [];
//     var data_break = [];

//     var startAddress = null;

//     var endAddress = null;

//     let total_viol = "00:00:00";
//     let shiftViol = "00:00:00"; // Initialize to "00:00:00"
//     let cycViol = "00:00:00";   // Initialize to "00:00:00"
//     let breakViol = "00:00:00"; // Initialize to "00:00:00"
//     let driveViol = "00:00:00"; // Initialize to "00:00:00"
//     let shiftData = entryData.Shift_data;
//     let cycleData = entryData.cycle_data;
//     let breakData = entryData.eight_hour_break_violation;
//     let driveData = entryData.driver_eleven_viol_data;



//     if (isLoaded && window.google) {
//       // if (Array.isArray(startLoc) && startLoc !== undefined && startLoc !== null) {
//       if (Array.isArray(startLoc) && startLoc.length === 2 && !isNaN(startLoc[0]) && !isNaN(startLoc[1])) {
//         const geocoder = new window.google.maps.Geocoder();
//         const latLng = new window.google.maps.LatLng(startLoc[0], startLoc[1]);

//         geocoder.geocode({ location: latLng }, (results, status) => {
//           if (status === window.google.maps.GeocoderStatus.OK) {
//             if (results[0]) {
//               startAddress = results[0].formatted_address;
//               setAddrssStart(startAddress);

//             } else {
//               console.log('No results found');
//             }
//           } else {
//             console.error('Geocoder failed due to: ' + status);
//           }
//         })
//       }

//       // if (Array.isArray(endLoc) && endLoc !== undefined && endLoc !== null) {
//       if (Array.isArray(endLoc) && endLoc.length === 2 && !isNaN(endLoc[0]) && !isNaN(endLoc[1])) {
//         const geocoder = new window.google.maps.Geocoder();
//         const latLng = new window.google.maps.LatLng(endLoc[0], endLoc[1]);

//         geocoder.geocode({ location: latLng }, (results, status) => {
//           if (status === window.google.maps.GeocoderStatus.OK) {
//             if (results[0]) {
//               endAddress = results[0].formatted_address;
//               setAddrssEnd(endAddress);
//             } else {
//               console.log('No results found');
//             }
//           } else {
//             console.error('Geocoder failed due to: ' + status);
//           }
//         })
//       }
//     }

//     if (endLoc == undefined || endLoc == null) {
//       setAddrssEnd('');
//     }

//     if (startLoc == undefined || startLoc == null) {
//       setAddrssStart('');
//     }


//     // Function to convert hh:mm:ss to total seconds
//     function timeToSeconds(time) {
//       if (!time) return 0; // Return 0 if time is undefined or null
//       let parts = time.split(':');
//       return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
//     }

//     // Function to convert total seconds to hh:mm:ss
//     function secondsToTime(seconds) {
//       let hours = Math.floor(seconds / 3600);
//       let minutes = Math.floor((seconds % 3600) / 60);
//       let secs = seconds % 60;

//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }

//     function formatTimeDate(timestamp) {
//       const date = new Date(timestamp);

//       let hours = date.getUTCHours();
//       const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//       const day = String(date.getUTCDate()).padStart(2, '0');
//       const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//       const year = date.getUTCFullYear();

//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12;
//       hours = hours ? hours : 12; // the hour '0' should be '12'
//       const formattedHours = String(hours).padStart(2, '0');

//       return `${formattedHours}:${minutes} ${ampm}`;
//     }


//     if (shiftData) {

//       // Calculate shiftViol
//       if (shiftData.length === 0) {

//         shiftViol = "00:00:00";

//       } else {

//         var time_start = formatTimeDate(shiftData[0].violation_startTime);

//         var time_end = formatTimeDate(shiftData[0].violation_endTime);

//         var reason = 'Shift Duty Limit';

//         shiftViol = shiftData[0].violation_duration;

//         data_shift.push([time_start, time_end, reason, shiftViol]);

//       }

//     } else {

//       shiftViol = "00:00:00";

//     }

//     if (cycleData) {

//       // Calculate cycViol
//       if (cycleData.length === 0) {

//         cycViol = "00:00:00";

//       } else {

//         var start_times = formatTimeDate(cycleData[0].violation_startTime);

//         var end_times = formatTimeDate(cycleData[0].violation_endTime);

//         var reason = 'Cycle duty limit';

//         cycViol = cycleData[0].violation_duration; // Assuming cycleData is an array of objects

//         data_cycle.push([start_times, end_times, reason, cycViol])

//       }

//     } else {

//       cycViol = "00:00:00";

//     }

//     if (breakData) {

//       // Calculate breakViol
//       if (breakData.length === 0) {

//         breakViol = "00:00:00";

//       } else {

//         var start_times = formatTimeDate(breakData[0].violation_start_time);

//         var end_times = formatTimeDate(breakData[0].violation_end_date);

//         var reason = 'Eight hours break limit';

//         breakViol = breakData[0].break_violation; // Assuming breakData is an array of objects

//         data_break.push([start_times, end_times, reason, breakViol]);

//       }

//     } else {

//       breakViol = "00:00:00";

//     }

//     if (breakData) {

//       // Calculate driveViol
//       if (driveData.length === 0) {

//         driveViol = "00:00:00";

//       } else {

//         var start_timess = formatTimeDate(driveData.drive_start_time);

//         var end_timess = formatTimeDate(driveData.drive_end_time);

//         var reason = "Drive shift limit";

//         driveViol = driveData.drive_violate; // Assuming driveData is an array of objects

//         data_drive.push([start_timess, end_timess, reason, driveViol]);

//       }

//     } else {

//       driveViol = "00:00:00";

//     }

//     var data_total = [data_shift, data_cycle, data_break, data_drive];

//     // Convert each violation to total seconds and sum them up
//     let totalSeconds = 0;
//     totalSeconds += timeToSeconds(shiftViol);
//     totalSeconds += timeToSeconds(cycViol);
//     totalSeconds += timeToSeconds(breakViol);
//     totalSeconds += timeToSeconds(driveViol);

//     // Convert total seconds back to hh:mm:ss format
//     total_viol = secondsToTime(totalSeconds);

//     return {
//       logs: entryDatas,
//       datas: dataEntry,
//       total: data_total,
//       date: dateKey,
//       shift: entryData.total_shift_time || '00:00:00',
//       driving: entryData.total_drive_time || '00:00:00',
//       inViolation: total_viol || '00:00:00',
//       from: addrssStart || '',
//       to: addrssEnd || '',
//       details: entryData.details || '',
//       Icon: entryData.Icon || '',
//       path1: entryData.path1 || '',
//       path2: entryData.path2 || '',
//       path3: entryData.path3 || ''
//     };
//   }) : [];

//   console.log("Table data", tableData);


//   const filteredData = tableData.filter((row) => {
//     const currentYear = new Date().getFullYear();
//     const rowDate = new Date(`${row.date}, ${currentYear}`);
//     return rowDate >= dateRange[0].startDate && rowDate <= dateRange[0].endDate;
//   });

//   const finalData = filteredData.length > 0 ? filteredData : tableData;

//   return (
//     <div className="container-fluid">
//       <Link
//         href={`/dashboard/drivers/detail/${driverId}`}
//         className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
//       >
//         <i className="ki-duotone ki-left"></i> Back
//       </Link>
//       <div className="d-flex justify-content-between">
//         <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
//           Hours of Service Report -{" "}
//           <span className="border-bottom border-3 border-dark">
//             {data && data[0] && data[0][0] ? data[0][0].first_name : "N/A"}  {data && data[0] && data[0][0] ? data[0][0].last_name : "N/A"}
//           </span>{" "}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             role="button"
//             fill="currentColor"
//             className="bi bi-star mb-2"
//             viewBox="0 0 16 16"
//             style={{ color: "rgb(199 150 29)" }}
//           >
//             <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
//           </svg>
//         </h3>
//         <button
//           className="btn btn-sm btn-icon btn-active-color-primary"
//           data-kt-menu-trigger="click"
//           data-kt-menu-placement="bottom-end"
//         >
//           <i className="ki-outline ki-dots-square fs-2"></i>
//         </button>
//       </div>

//       <div className="border border-2 rounded mt-5">
//         <div className="d-flex justify-content-around">
//           <div className="p-5">
//             <p>Duty status</p>
//             <span className="badge text-bg-dark fs-5">{data && data[0] && data[0][5] ? data[0][5] : ""}</span>
//           </div>
//           <div className="p-5">
//             <p>Time in current status</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][2] ? data[0][2] : "00:00:00"}</span>
//           </div>
//           <div className="p-5">
//             <p>Vehicle Name</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][1] ? data[0][1].name : ""}</span>
//           </div>
//           <div className="p-5">
//             <p>Time until break</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][8] ? data[0][8] : "00:00:00"}</span>
//           </div>
//           <div className="p-5">
//             <p>Drive remaining</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][7] ? data[0][7] : "00:00:00"}</span>
//           </div>
//           <div className="p-5">
//             <p>Shift remaining</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][4] ? data[0][4] : "00:00:00"}</span>
//           </div>
//           <div className="p-5">
//             <p>Cycle remaining</p>
//             <span className="fs-5 fw-semibold">{data && data[0] && data[0][6] ? data[0][6] : "00:00:00"}</span>
//           </div>
//           {/* <div className="p-5">
//             <p>Cycle tomorrow</p>
//             <span className="fs-5 fw-semibold">70:00</span>
//           </div> */}
//         </div>
//       </div>

//       <div className="border border-end-0 border-start-0 border-2 mt-5">
//         <div className="d-flex justify-content-between">
//           <div className="p-4">
//             <input
//               type="text"
//               role="button"
//               readOnly
//               onClick={toggleDatePicker}
//               value={`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
//               style={{
//                 padding: "10px",
//                 textAlign: "center",
//                 border: "2px solid #ccc",
//                 borderRadius: "4px",
//                 width: "200px",
//               }}
//             />

//             {open && (
//               <div style={{ position: "absolute", zIndex: 1000 }}>
//                 <DateRangePicker
//                   ranges={dateRange}
//                   onChange={handleSelect}
//                   showSelectionPreview={true}
//                   moveRangeOnFirstSelection={false}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="text-end p-4 position-relative">
//             <div
//               className="form-check form-switch form-check-reverse position-absolute top-50 start-0 translate-middle me-4"
//               style={{ paddingRight: "16rem" }}
//             >
//               <label className="form-check-label text-secondary">
//                 Show status details
//               </label>
//               <input
//                 className="form-check-input mt-1"
//                 type="checkbox"
//                 role="switch"
//                 id="flexSwitchCheckChecked"
//               />
//             </div>
//             <button
//               type="button"
//               className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary me-4"
//               onClick={handleDropdown}
//             >
//               Transfer Logs <i className="ki-duotone ki-down"></i>
//             </button>

//             <ul
//               className={`dropdown-menu ${dropdown ? "show" : ""} py-4`}
//               style={{ transform: "translate3d(-235.2px, 4px, 0px)" }}
//             >
//               <li>
//                 <a className="dropdown-item" href="#">
//                   Action
//                 </a>
//               </li>
//               <li>
//                 <a className="dropdown-item" href="#">
//                   Another action
//                 </a>
//               </li>
//               <li>
//                 <a className="dropdown-item" href="#">
//                   Something else here
//                 </a>
//               </li>
//             </ul>
//             <button
//               className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary me-4"
//               onClick={handleExpandAll}
//             >
//               Expand All
//             </button>
//             <button
//               className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
//               onClick={handleCollapseAll}
//             >
//               Collapse All
//             </button>
//           </div>
//         </div>
//       </div>

//       <table className="mt-6 table gs-7 gy-7 gx-7">
//         <tbody>
//           <tr className="fs-7">
//             <td className="text-start">DATE(PDT)</td>
//             <td className="text-start">SHIFT</td>
//             <td className="text-start">DRIVING</td>
//             <td className="text-start">IN VIOLATION</td>
//             <td className="text-start">FROM</td>
//             <td className="text-start">TO</td>
//             <td className="text-start">DETAILS</td>
//           </tr>

//           {finalData?.map((row, index) => (
//             <React.Fragment key={index}>
//               <tr>
//                 <td
//                   className="text-start fw-bolder"
//                   role="button"
//                   onClick={() => handleToggleDate(index)}
//                 >
//                   <i
//                     className={`ki-duotone ${isDateOpen.has(index) || isAllOpen ? "ki-up" : "ki-down"
//                       } fs-5 me-2 fw-bolder`}
//                   ></i>
//                   {row.date}
//                 </td>
//                 <td className="text-start">{row.shift}</td>
//                 <td className="text-start">{row.driving}</td>
//                 <td className={`text-start ${isViolation ? 'text-danger' : ''}`}>
//                   {row.inViolation !== "00:00:00" && (
//                     <i className="ki-duotone me-2 align-middle alert-danger">
//                       <span className="badge bg-danger-subtle text-danger-emphasis fs-5">{row.inViolation}</span>
//                     </i>
//                   )}
//                   {row.inViolation === "00:00:00" && (
//                     <i className="ki-duotone me-2 align-middle">
//                       <span className="fs-6">{row.inViolation}</span>
//                     </i>
//                   )}

//                 </td>
//                 <td className="text-start">{row.from}</td>
//                 <td className="text-start">{row.to}</td>
//                 <td className="text-start">
//                   {row && (
//                     <i
//                       className={`ki-duotone ${row} me-2 align-middle alert-danger`}
//                     >
//                       <span className={`${row}`}></span>
//                       <span className={`${row}`}></span>
//                       <span className={`${row}`}></span>
//                     </i>
//                   )}
//                   {row.details}
//                 </td>
//               </tr>
//               {(isDateOpen.has(index) || isAllOpen) && (
//                 <tr>
//                   <td colSpan={7}>
//                     <div className="border rounded-3 shadow">
//                       <div className="text-start m-5 fs-6">
//                         <div className="d-flex justify-content-between">
//                           <span className="fw-medium">
//                             Carrier Name:{" "}
//                             <span className="fw-normal">
//                               {" "}
//                               {row.logs[1][3].career_name}
//                             </span>
//                           </span>
//                           {/* <span className="fw-medium">
//                             ELD Provider & ID:{" "}
//                             <span className="fw-normal"> Samsara (82k7)</span>
//                           </span> */}
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Carrier Address:{" "}
//                             <span className="fw-normal">
//                               {" "}
//                               3190 S Elm Ave Fresno CA 93706
//                             </span>
//                           </span>
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Carrier US DOT Number:{" "}
//                             <span className="fw-normal"> {row.logs[1][3].carrer_us_dot_number}</span>
//                           </span>
//                         </div>
//                       </div>
//                       <div className="separator my-5"></div>
//                       <div className="text-start m-5 fs-6">
//                         <div className="d-flex justify-content-between">
//                           <span className="fw-medium">
//                             Driver:{" "}
//                             <span className="fw-normal border-bottom border-dark-subtle">
//                               {row.logs[1][0].first_name} {row.logs[1][0].last_name}
//                             </span>
//                           </span>
//                           <span className="fw-medium">
//                             Shipping ID: <span className="fw-normal">-</span>
//                           </span>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                           <span className="fw-medium">
//                             App:{" "}
//                             <span className="fw-normal">
//                               Signed out from v.2420.202.12103
//                             </span>
//                           </span>
//                           <span className="fw-medium">
//                             Trailer: <span className="fw-normal"></span>
//                           </span>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                           <span className="fw-medium">
//                             Driver License:{" "}
//                             <span className="fw-normal">{row.logs[1][3].licenseNumber}</span>
//                           </span>
//                           <span className="fw-medium">
//                             Distance: <span className="fw-normal">- mi</span>
//                           </span>
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Ruleset:{" "}
//                             <span className="fw-normal">
//                               USA Property (8/70)
//                             </span>
//                           </span>
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Vehicles: <span className="fw-normal">-</span>
//                           </span>
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Home Terminal Name:{" "}
//                             <span className="fw-normal">
//                               {row.logs[1][3].home_terminal_name}
//                             </span>
//                           </span>
//                         </div>
//                         <div>
//                           <span className="fw-medium">
//                             Home Terminal Address:{" "}
//                             <span className="fw-normal">
//                               {row.logs[1][3].home_terminal.name}
//                             </span>
//                           </span>
//                         </div>
//                       </div>
//                       <div className="separator my-5"></div>
//                       <div className="m-5">
//                         <div className="d-flex justify-content-between">
//                           <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
//                             {row.logs[1][0].first_name} {row.logs[1][0].last_name} -{" "}
//                             <span className="">{row.date}</span>
//                           </h3>
//                           <button
//                             className="btn btn-sm btn-icon btn-active-color-primary"
//                             data-kt-menu-trigger="click"
//                             data-kt-menu-placement="bottom-end"
//                           >
//                             <i className="ki-outline ki-dots-square fs-2"></i>
//                           </button>
//                         </div>
//                         <div className="m-5">
//                           {/* <LineChart /> */}
//                         </div>
//                         <table className="mt-6 table gs-7 gy-4 gx-9 border">
//                           <tbody>
//                             <tr className="fs-6 fw-bolder border-bottom">
//                               <td className="text-start">Time</td>
//                               <td className="text-start">Duration</td>
//                               <td className="text-start">Status</td>
//                               <td className="text-start">Remark</td>
//                               <td className="text-start">Vehicle</td>
//                               <td className="text-start">Odometer</td>
//                               <td className="text-start">Location</td>
//                             </tr>
//                             {row?.datas?.length > 0 ? (
//                               row.datas.map((data, index) => (
//                                 <tr className="fs-7" key={index}>
//                                   <td className="text-start">
//                                     <span className="fs-6 fw-semibold">
//                                       {data[4]} -
//                                     </span>
//                                     <div>
//                                       <span>{data[5]}</span>
//                                     </div>
//                                   </td>
//                                   <td className="text-start">{data[0]}</td>
//                                   <td className="text-start">
//                                     <span className="badge text-bg-dark fs-7">
//                                       {data[1]}
//                                     </span>
//                                   </td>
//                                   <td className="text-start">{data[2]}</td>
//                                   <td className="text-start">{data[3]}</td>
//                                   <td className="text-start">{data[7]}</td>
//                                   {data[6] && Array.isArray(data[6]) && (
//                                     <AddressCell lat={data[6][0]} lng={data[6][1]} />
//                                   )}
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr className="fs-7">
//                                 <td className="text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
//                                   No data present
//                                 </td>
//                               </tr>
//                             )}


//                           </tbody>
//                         </table>
//                         <div className="alert  bg-danger-subtle d-flex align-items-center p-5 mb-10 mt-6">
//                           <div className="text-start">
//                             <i className="ki-duotone ki-duotone ki-information-5 me-2 align-middle alert-danger fs-1">
//                               <span className="path1"></span>
//                               <span className="path2"></span>
//                               <span className="path3"></span>
//                             </i>

//                             <span className="mb-1 text-start fs-6 fw-bolder">
//                               HOS Violation {row.inViolation}
//                             </span>
//                             {row?.total && row.total.length > 0 ? (
//                               row.total[0].map((data, index) => (
//                                 <div key={index} className="ms-8 mt-2 fs-7">
//                                   <div className="border-bottom border-dark">
//                                     <span className="fw-medium">
//                                       {data[0]} - {data[1]} ({data[3]})
//                                     </span>
//                                   </div>
//                                   <div className="text-body-secondary">
//                                     <span>{data[2]}</span>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No data available</p>
//                             )}
//                             {row?.total && row.total.length > 0 ? (
//                               row.total[1].map((data, index) => (
//                                 <div key={index} className="ms-8 mt-2 fs-7">
//                                   <div className="border-bottom border-dark">
//                                     <span className="fw-medium">
//                                       {data[0]} - {data[1]} ({data[3]})
//                                     </span>
//                                   </div>
//                                   <div className="text-body-secondary">
//                                     <span>{data[2]}</span>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No data available</p>
//                             )}
//                             {row?.total && row.total.length > 0 ? (
//                               row.total[2].map((data, index) => (
//                                 <div key={index} className="ms-8 mt-2 fs-7">
//                                   <div className="border-bottom border-dark">
//                                     <span className="fw-medium">
//                                       {data[0]} - {data[1]} ({data[3]})
//                                     </span>
//                                   </div>
//                                   <div className="text-body-secondary">
//                                     <span>{data[2]}</span>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No data available</p>
//                             )}
//                             {row?.total && row.total.length > 0 ? (
//                               row.total[3].map((data, index) => (
//                                 <div key={index} className="ms-8 mt-2 fs-7">
//                                   <div className="border-bottom border-dark">
//                                     <span className="fw-medium">
//                                       {data[0]} - {data[1]} ({data[3]})
//                                     </span>
//                                   </div>
//                                   <div className="text-body-secondary">
//                                     <span>{data[2]}</span>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No data available</p>
//                             )}


//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect, lazy, Suspense, memo } from "react";
>>>>>>> origin/main
import Link from "next/link";
import StepLineChart from "@/Components/driverdetails/StepLineChart";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useParams } from "next/navigation";
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
const LineChart = lazy(() => import('@/Components/GraphComponents/LineChart'));
import { debounce } from 'lodash';
import { useJsApiLoader } from '@react-google-maps/api';
<<<<<<< HEAD
import LoadingIcons from 'react-loading-icons';
=======
>>>>>>> origin/main


export default function HoursOfService({ params }) {
  const MemoizedLineChart = memo(LineChart);

  const driverId = params.slug;
  const [isDateOpen, setIsDateOpen] = useState(new Set());
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
  const [isGraphLoading, setGraphLoading] = useState(false);
=======
>>>>>>> origin/main
  const [dropdown, setDropdown] = useState(false);
  const [isViolation, setIsViolation] = useState(false); // Example initialization
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [graphDataMap, setGraphDataMap] = useState({}); // Store graph data by date key
  const [addrssStart, setAddrssStart] = useState(null);
  const [addrssEnd, setAddrssEnd] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHourOpen, setIsHourOpen] = useState(false);
  const { slug } = useParams();

  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 7);

  // Function to format a date as yyyy-mm-dd
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [date_start, setDateStart] = useState(formatDate(pastDate));
  const [date_end, setDateEnd] = useState(formatDate(today));

  // Set default date range to today and 7 days back
  useEffect(() => {
    setDateRange([
      {
        startDate: pastDate,
        endDate: today,
        key: "selection",
      },
    ]);
  }, []);

  const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MapKey,
    libraries: ['geometry', 'drawing'],
  });

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }

  const token = getCookie("token");

<<<<<<< HEAD
  const fetchDriverDetails = useCallback(
    debounce(async () => {
      if (!slug) return;

      setLoading(true);

      try {
        const response = await fetch(`${BackEND}/driver/hos/detail/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
=======
  useEffect(() => {
    if (!slug) return;

    const fetchDriverDetails = async () => {
      try {
        const response = await fetch(`${BackEND}/driver/hos/detail/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
>>>>>>> origin/main
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
<<<<<<< HEAD
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);

=======
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setData(result);
>>>>>>> origin/main
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
<<<<<<< HEAD
    }, 1000), // Debounce time in milliseconds
    [slug, BackEND, token]
  );

  // Use useEffect to call the debounced fetch function
  useEffect(() => {
    fetchDriverDetails();
  }, [fetchDriverDetails]);

  const fetchLogs = useCallback(
    debounce(async () => {
      if (!slug || !date_start || !date_end) return;

      setLoading(true); // Ensure loading state is true when fetching logs

      try {
        const response = await fetch(`${BackEND}/driver/date/log/${slug}/${date_start}/${date_end}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
=======
    };

    fetchDriverDetails();
  }, []);

  useEffect(() => {
    if (!slug || !date_start || !date_end) return;

    const fetchLogs = async () => {
      setLoading(true); // Ensure loading state is true when fetching logs
      try {
        const response = await fetch(`${BackEND}/driver/date/log/${slug}/${date_start}/${date_end}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
>>>>>>> origin/main
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
<<<<<<< HEAD
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setLog(result);

=======
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setLog(result);
>>>>>>> origin/main
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Ensure loading state is false after fetching logs
      }
<<<<<<< HEAD
    }, 1000), // Debounce time in milliseconds
    [slug, date_start, date_end, BackEND, token]
  );

  // Use useEffect to call the debounced fetch function
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
=======
    };

    fetchLogs();
  }, [slug, date_start, date_end]); // Depend on slug, date_start, and date_end
>>>>>>> origin/main

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleCollapseAll = () => {
    setIsAllOpen(false);
    setIsDateOpen(new Set());
  };

  const handleExpandAll = () => {
    const allIndexes = new Set(finalData.map((_, index) => index));
    setIsDateOpen(allIndexes);
    setIsAllOpen(true);
  };

  const handleToggleDate = (index) => {
    const newExpandedRows = new Set(isDateOpen);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }

    setIsDateOpen(newExpandedRows);
    setIsAllOpen(newExpandedRows.size === finalData.length);
  };

<<<<<<< HEAD
=======



>>>>>>> origin/main
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]); // Update the date range state

    // Update date_start and date_end based on the selected range
    const startDate = formatDate(ranges.selection.startDate);
    const endDate = formatDate(ranges.selection.endDate);

    setDateStart(startDate);
    setDateEnd(endDate);

    setOpen(false); // Close the date range picker
  };

<<<<<<< HEAD
=======

>>>>>>> origin/main
  const toggleDatePicker = () => {
    setOpen(!open);
  };

<<<<<<< HEAD
  const graphHosData = useCallback(
    debounce(async (date) => {
      setLoading(true); // Set loading state to true before fetching logs
      try {
        const response = await fetch(`${BackEND}/graph/chart/data/${driverId}/${date}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;

      } catch (err) {
        setError(err.message);
        return null; // Return null if the request fails
      } finally {
        setLoading(false); // Ensure loading state is false after fetching logs
      }
    }, 1000), // Debounce time in milliseconds
    [BackEND, driverId, token] // Dependencies
  );

  const fetchGraphData = async (dateKey) => {
    setLoading(true); // Set loading state to true before fetching
    try {
      const result = await graphHosData(dateKey);
      if (result) {
        setGraphDataMap(prev => ({ ...prev, [dateKey]: result }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Ensure loading state is false after fetching
=======

  const graphHosData = async (date) => {
    setLoading(true); // Set loading state to true before fetching logs
    try {
      const response = await fetch(`${BackEND}/graph/chart/data/${driverId}/${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result;

    } catch (err) {
      setError(err.message);
      return null; // Return null or a default value if the request fails
    } finally {
      setLoading(false); // Ensure loading state is false after fetching logs
    }
  };

  const fetchGraphData = async (dateKey) => {
    setLoading(true);
    try {
      const result = await graphHosData(dateKey);
      setGraphDataMap(prev => ({ ...prev, [dateKey]: result }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  useEffect(() => {
    if (Array.isArray(log) && log.length > 0) {
      log.forEach(logEntry => {
        const dateKey = Object.keys(logEntry)[0];
        if (!graphDataMap[dateKey]) { // Only fetch if data is not already fetched
          fetchGraphData(dateKey);
        }
      });
    }
  }, [log]); // Dependency on log array

  const tableData = Array.isArray(log) && log.length > 0 ? log.map(logEntry => {

    const dateKey = Object.keys(logEntry)[0];

    const graphData = graphDataMap[dateKey]; // Access the graph data from state

    const entryData = logEntry[dateKey][0];

    const entryDatas = logEntry[dateKey];

    const startLoc = logEntry[dateKey][3];

    const endLoc = logEntry[dateKey][4];

    const dataEntry = logEntry[dateKey][2];

    var data_shift = [];
    var data_cycle = [];
    var data_drive = [];
    var data_break = [];

    var startAddress = null;

    var endAddress = null;

    let total_viol = "00:00:00";
    let shiftViol = "00:00:00"; // Initialize to "00:00:00"
    let cycViol = "00:00:00";   // Initialize to "00:00:00"
    let breakViol = "00:00:00"; // Initialize to "00:00:00"
    let driveViol = "00:00:00"; // Initialize to "00:00:00"
    let shiftData = entryData.Shift_data;
    let cycleData = entryData.cycle_data;
    let breakData = entryData.eight_hour_break_violation;
    let driveData = entryData.driver_eleven_viol_data;

    if (isLoaded && window.google) {
      // if (Array.isArray(startLoc) && startLoc !== undefined && startLoc !== null) {
      if (Array.isArray(startLoc) && startLoc.length === 2 && !isNaN(startLoc[0]) && !isNaN(startLoc[1])) {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(startLoc[0], startLoc[1]);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              startAddress = results[0].formatted_address;
              setAddrssStart(startAddress);

            } else {
              console.log('No results found');
            }
          } else {
            console.error('Geocoder failed due to: ' + status);
          }
        })
      }

      // if (Array.isArray(endLoc) && endLoc !== undefined && endLoc !== null) {
      if (Array.isArray(endLoc) && endLoc.length === 2 && !isNaN(endLoc[0]) && !isNaN(endLoc[1])) {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(endLoc[0], endLoc[1]);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              endAddress = results[0].formatted_address;
              setAddrssEnd(endAddress);
            } else {
              console.log('No results found');
            }
          } else {
            console.error('Geocoder failed due to: ' + status);
          }
        })
      }
    }

    if (endLoc == undefined || endLoc == null) {
      setAddrssEnd('');
    }

    if (startLoc == undefined || startLoc == null) {
      setAddrssStart('');
    }


    // Function to convert hh:mm:ss to total seconds
    function timeToSeconds(time) {
      if (!time) return 0; // Return 0 if time is undefined or null
      let parts = time.split(':');
      return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
    }

    // Function to convert total seconds to hh:mm:ss
    function secondsToTime(seconds) {
      let hours = Math.floor(seconds / 3600);
      let minutes = Math.floor((seconds % 3600) / 60);
      let secs = seconds % 60;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function formatTimeDate(timestamp) {
      const date = new Date(timestamp);

      let hours = date.getUTCHours();
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getUTCFullYear();

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedHours = String(hours).padStart(2, '0');

      return `${formattedHours}:${minutes} ${ampm}`;
    }


    if (shiftData) {

      // Calculate shiftViol
      if (shiftData.length === 0) {

        shiftViol = "00:00:00";

      } else {

        var time_start = formatTimeDate(shiftData[0].violation_startTime);

        var time_end = formatTimeDate(shiftData[0].violation_endTime);

        var reason = 'Shift Duty Limit';

        shiftViol = shiftData[0].violation_duration;

        data_shift.push([time_start, time_end, reason, shiftViol]);

      }

    } else {

      shiftViol = "00:00:00";

    }

    if (cycleData) {

      // Calculate cycViol
      if (cycleData.length === 0) {

        cycViol = "00:00:00";

      } else {

        var start_times = formatTimeDate(cycleData[0].violation_startTime);

        var end_times = formatTimeDate(cycleData[0].violation_endTime);

        var reason = 'Cycle duty limit';

        cycViol = cycleData[0].violation_duration; // Assuming cycleData is an array of objects

        data_cycle.push([start_times, end_times, reason, cycViol])

      }

    } else {

      cycViol = "00:00:00";

    }

    if (breakData) {

      // Calculate breakViol
      if (breakData.length === 0) {

        breakViol = "00:00:00";

      } else {

        var start_times = formatTimeDate(breakData[0].violation_start_time);

        var end_times = formatTimeDate(breakData[0].violation_end_date);

        var reason = 'Eight hours break limit';

        breakViol = breakData[0].break_violation; // Assuming breakData is an array of objects

        data_break.push([start_times, end_times, reason, breakViol]);

      }

    } else {

      breakViol = "00:00:00";

    }

    if (breakData) {

      // Calculate driveViol
      if (driveData.length === 0) {

        driveViol = "00:00:00";

      } else {

        var start_timess = formatTimeDate(driveData.drive_start_time);

        var end_timess = formatTimeDate(driveData.drive_end_time);

        var reason = "Drive shift limit";

        driveViol = driveData.drive_violate; // Assuming driveData is an array of objects

        data_drive.push([start_timess, end_timess, reason, driveViol]);

      }

    } else {

      driveViol = "00:00:00";

    }

    var data_total = [data_shift, data_cycle, data_break, data_drive];

    // Convert each violation to total seconds and sum them up
    let totalSeconds = 0;
    totalSeconds += timeToSeconds(shiftViol);
    totalSeconds += timeToSeconds(cycViol);
    totalSeconds += timeToSeconds(breakViol);
    totalSeconds += timeToSeconds(driveViol);

    // Convert total seconds back to hh:mm:ss format
    total_viol = secondsToTime(totalSeconds);

    return {
      logs: entryDatas,
      datas: dataEntry,
      total: data_total,
      date: dateKey,
      shift: entryData.total_shift_time || '00:00:00',
      driving: entryData.total_drive_time || '00:00:00',
      inViolation: total_viol || '00:00:00',
      from: addrssStart || '',
      to: addrssEnd || '',
      details: entryData.details || '',
      Icon: entryData.Icon || '',
      path1: entryData.path1 || '',
      path2: entryData.path2 || '',
      path3: entryData.path3 || '',
      graphDatas: graphData || '',
    };
  }) : [];

  const filteredData = tableData.filter((row) => {
    const currentYear = new Date().getFullYear();
    const rowDate = new Date(`${row.date}, ${currentYear}`);
    return rowDate >= dateRange[0].startDate && rowDate <= dateRange[0].endDate;
  });

  const finalData = filteredData.length > 0 ? filteredData : tableData;

  return (
    <div className="container-fluid">
      <Link
        href={`/dashboard/drivers/detail/${driverId}`}
        className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
      >
        <i className="ki-duotone ki-left"></i> Back
      </Link>
      <div className="d-flex justify-content-between">
        <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
          Hours of Service Report -{" "}
          <span className="border-bottom border-3 border-dark">
            {data && data[0] && data[0][0] ? data[0][0].first_name : "N/A"}  {data && data[0] && data[0][0] ? data[0][0].last_name : "N/A"}
          </span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            role="button"
            fill="currentColor"
            className="bi bi-star mb-2"
            viewBox="0 0 16 16"
            style={{ color: "rgb(199 150 29)" }}
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
          </svg>
        </h3>
        <button
          className="btn btn-sm btn-icon btn-active-color-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          <i className="ki-outline ki-dots-square fs-2"></i>
        </button>
      </div>

      <div className="border border-2 rounded mt-5">
        <div className="d-flex justify-content-around">
          <div className="p-5">
            <p>Duty status</p>
            <span className="badge text-bg-dark fs-5">{data && data[0] && data[0][5] ? data[0][5] : ""}</span>
          </div>
          <div className="p-5">
            <p>Time in current status</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][2] ? data[0][2] : "00:00:00"}</span>
          </div>
          <div className="p-5">
            <p>Vehicle Name</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][1] ? data[0][1].name : ""}</span>
          </div>
          <div className="p-5">
            <p>Time until break</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][8] ? data[0][8] : "00:00:00"}</span>
          </div>
          <div className="p-5">
            <p>Drive remaining</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][7] ? data[0][7] : "00:00:00"}</span>
          </div>
          <div className="p-5">
            <p>Shift remaining</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][4] ? data[0][4] : "00:00:00"}</span>
          </div>
          <div className="p-5">
            <p>Cycle remaining</p>
            <span className="fs-5 fw-semibold">{data && data[0] && data[0][6] ? data[0][6] : "00:00:00"}</span>
          </div>
          <div className="p-5">
            <p>Cycle tomorrow</p>
            <span className="fs-5 fw-semibold">70:00</span>
          </div>
        </div>
      </div>

      <div className="border border-end-0 border-start-0 border-2 mt-5">
        <div className="d-flex justify-content-between">
          <div className="p-4">
            <input
              type="text"
              role="button"
              readOnly
              onClick={toggleDatePicker}
              value={`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
              style={{
                padding: "10px",
                textAlign: "center",
                border: "2px solid #ccc",
                borderRadius: "4px",
                width: "200px",
              }}
            />

            {open && (
              <div style={{ position: "absolute", zIndex: 1000 }}>
                <DateRangePicker
                  ranges={dateRange}
                  onChange={handleSelect}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                />
              </div>
            )}
          </div>

          <div className="text-end p-4 position-relative">
            <div
              className="form-check form-switch form-check-reverse position-absolute top-50 start-0 translate-middle me-4"
              style={{ paddingRight: "16rem" }}
            >
              <label className="form-check-label text-secondary">
                Show status details
              </label>
              <input
                className="form-check-input mt-1"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
              />
            </div>
            <button
              type="button"
              className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary me-4"
              onClick={handleDropdown}
            >
              Transfer Logs <i className="ki-duotone ki-down"></i>
            </button>

            <ul
              className={`dropdown-menu ${dropdown ? "show" : ""} py-4`}
              style={{ transform: "translate3d(-235.2px, 4px, 0px)" }}
            >
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
            <button
              className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary me-4"
              onClick={handleExpandAll}
            >
              Expand All
            </button>
            <button
              className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
              onClick={handleCollapseAll}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      <table className="mt-6 table gs-7 gy-7 gx-7">
        <tbody>
          <tr className="fs-7">
            <td className="text-start">DATE(PDT)</td>
            <td className="text-start">SHIFT</td>
            <td className="text-start">DRIVING</td>
            <td className="text-start">IN VIOLATION</td>
            <td className="text-start">FROM</td>
            <td className="text-start">TO</td>
            <td className="text-start">DETAILS</td>
          </tr>

          {finalData?.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td
                  className="text-start fw-bolder"
                  role="button"
                  onClick={() => handleToggleDate(index)}
                >
                  <i
                    className={`ki-duotone ${isDateOpen.has(index) || isAllOpen ? "ki-up" : "ki-down"
                      } fs-5 me-2 fw-bolder`}
                  ></i>
                  {row.date}
                </td>
                <td className="text-start">{row.shift}</td>
                <td className="text-start">{row.driving}</td>
                <td className={`text-start ${isViolation ? 'text-danger' : ''}`}>
                  {row.inViolation !== "00:00:00" && (
                    <i className="ki-duotone me-2 align-middle alert-danger">
                      <span className="badge bg-danger-subtle text-danger-emphasis fs-5">{row.inViolation}</span>
                    </i>
                  )}
                  {row.inViolation === "00:00:00" && (
                    <i className="ki-duotone me-2 align-middle">
                      <span className="fs-6">{row.inViolation}</span>
                    </i>
                  )}

                </td>
                <td className="text-start">{row.from}</td>
                <td className="text-start">{row.to}</td>
                <td className="text-start">
                  {row && (
                    <i
                      className={`ki-duotone ${row} me-2 align-middle alert-danger`}
                    >
                      <span className={`${row}`}></span>
                      <span className={`${row}`}></span>
                      <span className={`${row}`}></span>
                    </i>
                  )}
                  {row.details}
                </td>
              </tr>
              {(isDateOpen.has(index) || isAllOpen) && (
                <tr>
                  <td colSpan={7}>
                    <div className="border rounded-3 shadow">
                      <div className="text-start m-5 fs-6">
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">
                            Carrier Name:{" "}
                            <span className="fw-normal">
                              {" "}
                              {row.logs[1][3].career_name}
                            </span>
                          </span>
                          {/* <span className="fw-medium">
                            ELD Provider & ID:{" "}
                            <span className="fw-normal"> Samsara (82k7)</span>
                          </span> */}
                        </div>
                        <div>
                          <span className="fw-medium">
                            Carrier Address:{" "}
                            <span className="fw-normal">
                              {" "}
                              3190 S Elm Ave Fresno CA 93706
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">
                            Carrier US DOT Number:{" "}
                            <span className="fw-normal"> {row.logs[1][3].carrer_us_dot_number}</span>
                          </span>
                        </div>
                      </div>
                      <div className="separator my-5"></div>
                      <div className="text-start m-5 fs-6">
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">
                            Driver:{" "}
                            <span className="fw-normal border-bottom border-dark-subtle">
                              {row.logs[1][0].first_name} {row.logs[1][0].last_name}
                            </span>
                          </span>
                          <span className="fw-medium">
                            Shipping ID: <span className="fw-normal">-</span>
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">
                            App:{" "}
                            <span className="fw-normal">
                              Signed out from v.2420.202.12103
                            </span>
                          </span>
                          <span className="fw-medium">
                            Trailer: <span className="fw-normal"></span>
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">
                            Driver License:{" "}
                            <span className="fw-normal">{row.logs[1][3].licenseNumber}</span>
                          </span>
                          <span className="fw-medium">
                            Distance: <span className="fw-normal">- mi</span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">
                            Ruleset:{" "}
                            <span className="fw-normal">
                              USA Property (8/70)
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">
                            Vehicles: <span className="fw-normal">-</span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">
                            Home Terminal Name:{" "}
                            <span className="fw-normal">
                              {row.logs[1][3].home_terminal_name}
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">
                            Home Terminal Address:{" "}
                            <span className="fw-normal">
                              {row.logs[1][3].home_terminal.name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="separator my-5"></div>
                      <div className="m-5">
                        <div className="d-flex justify-content-between">
                          <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
                            {row.logs[1][0].first_name} {row.logs[1][0].last_name} -{" "}
                            <span className="">{row.date}</span>
                          </h3>
                          <button
                            className="btn btn-sm btn-icon btn-active-color-primary"
                            data-kt-menu-trigger="click"
                            data-kt-menu-placement="bottom-end"
                          >
                            <i className="ki-outline ki-dots-square fs-2"></i>
                          </button>
                        </div>
                        <Suspense fallback={<Skeleton height={200} />}>
                          <MemoizedLineChart params={row.graphDatas} />
                        </Suspense>
                        <table className="mt-6 table gs-7 gy-4 gx-9 border">
                          <tbody>
                            <tr className="fs-6 fw-bolder border-bottom">
                              <td className="text-start">Time</td>
                              <td className="text-start">Duration</td>
                              <td className="text-start">Status</td>
                              <td className="text-start">Remark</td>
                              <td className="text-start">Vehicle</td>
                              <td className="text-start">Odometer</td>
                              <td className="text-start">Location</td>
                            </tr>
                            {row?.datas?.length > 0 ? (
                              row.datas.map((data, index) => (
                                <tr className="fs-7" key={index}>
                                  <td className="text-start">
                                    <span className="fs-6 fw-semibold">
                                      {data[4]} -
                                    </span>
                                    <div>
                                      <span>{data[5]}</span>
                                    </div>
                                  </td>
                                  <td className="text-start">{data[0]}</td>
                                  <td className="text-start">
                                    <span className="badge text-bg-dark fs-7">
                                      {data[1]}
                                    </span>
                                  </td>
                                  <td className="text-start">{data[2]}</td>
                                  <td className="text-start">{data[3]}</td>
                                  <td className="text-start">-</td>
                                  <td className="text-start">
                                    5.2mi ENE Shafter,CA
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr className="fs-7">
                                <td className="text-center fw-bold">No data present</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div className="alert  bg-danger-subtle d-flex align-items-center p-5 mb-10 mt-6">
                          <div className="text-start">
                            <i className="ki-duotone ki-duotone ki-information-5 me-2 align-middle alert-danger fs-1">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                            <span className="mb-1 text-start fs-6 fw-bolder">
                              HOS Violation {row.inViolation}
                            </span>
                            {row?.total && row.total.length > 0 ? (
                              row.total[0].map((data, index) => (
                                <div key={index} className="ms-8 mt-2 fs-7">
                                  <div className="border-bottom border-dark">
                                    <span className="fw-medium">
                                      {data[0]} - {data[1]} ({data[3]})
                                    </span>
                                  </div>
                                  <div className="text-body-secondary">
                                    <span>{data[2]}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No data available</p>
                            )}
                            {row?.total && row.total.length > 0 ? (
                              row.total[1].map((data, index) => (
                                <div key={index} className="ms-8 mt-2 fs-7">
                                  <div className="border-bottom border-dark">
                                    <span className="fw-medium">
                                      {data[0]} - {data[1]} ({data[3]})
                                    </span>
                                  </div>
                                  <div className="text-body-secondary">
                                    <span>{data[2]}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No data available</p>
                            )}
                            {row?.total && row.total.length > 0 ? (
                              row.total[2].map((data, index) => (
                                <div key={index} className="ms-8 mt-2 fs-7">
                                  <div className="border-bottom border-dark">
                                    <span className="fw-medium">
                                      {data[0]} - {data[1]} ({data[3]})
                                    </span>
                                  </div>
                                  <div className="text-body-secondary">
                                    <span>{data[2]}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No data available</p>
                            )}
                            {row?.total && row.total.length > 0 ? (
                              row.total[3].map((data, index) => (
                                <div key={index} className="ms-8 mt-2 fs-7">
                                  <div className="border-bottom border-dark">
                                    <span className="fw-medium">
                                      {data[0]} - {data[1]} ({data[3]})
                                    </span>
                                  </div>
                                  <div className="text-body-secondary">
                                    <span>{data[2]}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
