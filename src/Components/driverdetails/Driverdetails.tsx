// // "use client";
// // import React, { useEffect, useState, useCallback } from "react";
// // import Link from "next/link";
// // import classes from "./DriverDetails.module.css";
// // import StepLineChart from "./StepLineChart";
// // import { useParams } from "next/navigation";
// // import { debounce } from 'lodash';
// // import Skeleton from "react-loading-skeleton";
// // import dynamic from 'next/dynamic';
// // import "react-loading-skeleton/dist/skeleton.css";
// // import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
// // import myImage from '../../../public/logo/a.png'; // Ensure this path is correct
// // import LineChart from "../GraphComponents/LineChart";

// // const mapContainerStyle = {
// //   height: "86vh",
// //   width: "100%",
// // };

// // const center = {
// //   lat: 34.4142989,
// //   lng: -112.2301242,
// // };

// // export default function Driverdetails() {
// //   const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
// //   const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

// //   const { isLoaded } = useJsApiLoader({
// //     id: 'google-map-script',
// //     googleMapsApiKey: MapKey,
// //     libraries: ['geometry', 'drawing'],
// //   });

// //   const [data, setData] = useState(null);
// //   const [mapData, setMapData] = useState(null);
// //   const [vehicleDatas, setVehicleData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [graph, setGraphData] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isDetailOpen, setIsDetailOpen] = useState(false);
// //   const [isHourOpen, setIsHourOpen] = useState(false);
// //   const [mapLoaded, setMapLoaded] = useState(false);
// //   const [markerIcons, setMarkerIcons] = useState({});
// //   const [hoveredMarker, setHoveredMarker] = useState(null);
// //   const [activeMarker, setActiveMarker] = useState(null);
// //   const { slug } = useParams();

// //   function getCookie(name) {
// //     if (typeof window === "undefined") {
// //       return null;
// //     }
// //     const nameEQ = name + "=";
// //     const ca = document.cookie.split(";");

// //     for (let i = 0; i < ca.length; i++) {
// //       let c = ca[i];
// //       while (c.charAt(0) === " ") c = c.substring(1, c.length);
// //       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
// //     }

// //     return null;
// //   }

// //   const token = getCookie("token");

// //   const fetchData = useCallback(
// //     debounce(async (slug, token) => {
// //       if (!slug) return;

// //       try {
// //         const response = await fetch(`${BackEND}/driver/detail/${slug}`, {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!response.ok) {
// //           const errorText = await response.text();
// //           console.log(`Network response was not ok: ${response.status} ${response.statusText}`);
// //           console.log(`Error details: ${errorText}`);
// //           throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
// //         }

// //         const result = await response.json();
// //         setData(result);
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }, 1000), // Debounce delay in milliseconds
// //     [] // Dependency array for useCallback
// //   );

// //   useEffect(() => {
// //     fetchData(slug, token);
// //   }, [slug, token, fetchData]);


// //   const fetchMapData = useCallback(
// //     debounce(async (slug, token) => {
// //       if (!slug) return;

// //       setLoading(true); // Start loading before fetching data
// //       try {
// //         const response = await fetch(`${BackEND}/driver/location/data/${slug}`, {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!response.ok) {
// //           const errorText = await response.text(); // Get the response body text for more details
// //           console.log(`Network response was not ok: ${response.status} ${response.statusText}`);
// //           console.log(`Error details: ${errorText}`);
// //           throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
// //         }

// //         const results = await response.json();
// //         setMapData(results);
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }, 1000), // Debounce delay in milliseconds
// //     [BackEND] // Dependency array for useCallback
// //   );

// //   useEffect(() => {
// //     fetchMapData(slug, token);
// //   }, [slug, token, fetchMapData]);

// //   const fetchGraphData = useCallback(
// //     debounce(async (slug, token) => {
// //       if (!slug) return;

// //       setIsLoading(true); // Start loading before fetching data
// //       try {
// //         const response = await fetch(`${BackEND}/graph/chart/data/${slug}`, {
// //           method: "GET",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error("Network response was not ok");
// //         }

// //         const results = await response.json();

// //         setGraphData(results);

// //       } catch (err) {
// //         setIsLoading(false);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }, 1000), // Debounce delay in milliseconds
// //     [BackEND] // Dependency array for useCallback
// //   );

// //   useEffect(() => {
// //     fetchGraphData(slug, token);
// //   }, [slug, token, fetchGraphData]);

// //   useEffect(() => {
// //     if (!Array.isArray(mapData) || mapData.length === 0) return;

// //     const updatedVehicleData = mapData.map(data => {
// //       let rotate = null;

// //       switch (data[3]) {
// //         case 'N':
// //           rotate = 0;
// //           break;
// //         case 'S':
// //           rotate = 180;
// //           break;
// //         case 'W':
// //           rotate = 270;
// //           break;
// //         case 'E':
// //           rotate = 90;
// //           break;
// //         default:
// //           rotate = null;
// //       }

// //       return {
// //         name: data[0],
// //         lat: data[1],
// //         lng: data[2],
// //         rotation: rotate,
// //       };
// //     });

// //     setVehicleData(updatedVehicleData);
// //   }, [mapData]);

// //   useEffect(() => {
// //     const createRotatedIcon = async (imageUrl, rotation) => {
// //       return new Promise((resolve) => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         const img = new Image();
// //         img.src = imageUrl;
// //         img.onload = () => {
// //           canvas.width = img.width;
// //           canvas.height = img.height;
// //           ctx.translate(canvas.width / 2, canvas.height / 2);
// //           ctx.rotate((rotation * Math.PI) / 180);
// //           ctx.drawImage(img, -img.width / 2, -img.height / 2);
// //           resolve(canvas.toDataURL());
// //         };
// //       });
// //     };


// //     const updateMarkerIcons = async () => {
// //       const icons = {};
// //       for (const vehicle of vehicleDatas) {
// //         const rotatedIcon = await createRotatedIcon(myImage.src, vehicle.rotation);
// //         icons[vehicle.name] = rotatedIcon;
// //       }
// //       setMarkerIcons(icons);
// //     };

// //     updateMarkerIcons();
// //   }, [vehicleDatas, myImage]);

// //   useEffect(() => {
// //     const handleZoom = (event) => {
// //       if (window.innerWidth > 2500 && (event.ctrlKey || event.metaKey)) {
// //         if (event.key === '-') {
// //           event.preventDefault();
// //         }
// //       }
// //     };

// //     document.addEventListener('keydown', handleZoom);
// //     return () => {
// //       document.removeEventListener('keydown', handleZoom);
// //     };
// //   }, []);
// //   const handleMapLoad = () => {
// //     setMapLoaded(true);
// //   };

// //   if (loading) return (
// //     <div className="container-fluid">
// //       <div className="row">
// //         <div className={`col-4 ${classes.leftSideScroll}`}>
// //           <Skeleton height={40} width={200} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={30} width={200} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={20} width={100} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={20} width={150} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={150} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={50} style={{ marginBottom: '20px' }} />
// //           <Skeleton height={50} style={{ marginBottom: '20px' }} />
// //         </div>
// //         <div className="col-8 overflow-hidden">
// //           <Skeleton height={400} />
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (error) return <div>Error: {error}</div>;

// //   const handleToggleDetail = () => {
// //     setIsDetailOpen(!isDetailOpen);
// //   };

// //   const handleToggleHour = () => {
// //     setIsHourOpen(!isHourOpen);
// //   };

// 'use client'
// import React, {  useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import classes from "./DriverDetails.module.css";
// import { useParams } from "next/navigation";
// import { debounce } from 'lodash';
// import Skeleton from "react-loading-skeleton";
// import dynamic from 'next/dynamic';
// import "react-loading-skeleton/dist/skeleton.css";
// import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
// import myImage from '../../../public/logo/a.png'; // Ensure this path is correct
// import LineChart from "../GraphComponents/LineChart";

// const mapContainerStyle = {
//   height: "86vh",
//   width: "100%",
// };

// const center = {
//   lat: 34.4142989,
//   lng: -112.2301242,
// };

// export default function Driverdetails() {
//   const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: MapKey,
//     libraries: ['geometry', 'drawing'],
//   });

//   const [data, setData] = useState(null);
//   const [mapData, setMapData] = useState(null);
//   const [vehicleDatas, setVehicleData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [graph, setGraphData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const [isHourOpen, setIsHourOpen] = useState(false);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [markerIcons, setMarkerIcons] = useState({});
//   const [hoveredMarker, setHoveredMarker] = useState(null);
//   const [activeMarker, setActiveMarker] = useState(null);
//   const { slug } = useParams();

//   function getCookie(name) {
//     if (typeof window === "undefined") {
//       return null;
//     }
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(";");

//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) === " ") c = c.substring(1, c.length);
//       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//     }

//     return null;
//   }

//   const token = getCookie("token");

//   const fetchData = useCallback(
//     debounce(async (slug, token) => {
//       if (!slug) return;

//       try {
//         const response = await fetch(`${BackEND}/driver/detail/${slug}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.log(`Network response was not ok: ${response.status} ${response.statusText}`);
//           console.log(`Error details: ${errorText}`);
//           throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }, 1000), // Debounce delay in milliseconds
//     [] // Dependency array for useCallback
//   );

//   useEffect(() => {
//     fetchData(slug, token);
//   }, [slug, token, fetchData]);

//   const fetchMapData = useCallback(
//     debounce(async (slug, token) => {
//       if (!slug) return;

//       setLoading(true); // Start loading before fetching data
//       try {
//         const response = await fetch(`${BackEND}/driver/location/data/${slug}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text(); // Get the response body text for more details
//           console.log(`Network response was not ok: ${response.status} ${response.statusText}`);
//           console.log(`Error details: ${errorText}`);
//           throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
//         }

//         const results = await response.json();
//         setMapData(results);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }, 1000), // Debounce delay in milliseconds
//     [BackEND] // Dependency array for useCallback
//   );

//   useEffect(() => {
//     fetchMapData(slug, token);
//   }, [slug, token, fetchMapData]);

//   const fetchGraphData = useCallback(
//     debounce(async (slug, token) => {
//       if (!slug) return;

//       setIsLoading(true); // Start loading before fetching data
//       try {
//         const response = await fetch(`${BackEND}/graph/chart/data/${slug}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const results = await response.json();

//         setGraphData(results);

//       } catch (err) {
//         setIsLoading(false);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }, 1000), // Debounce delay in milliseconds
//     [BackEND] // Dependency array for useCallback
//   );

//   useEffect(() => {
//     fetchGraphData(slug, token);
//   }, [slug, token, fetchGraphData]);

//   useEffect(() => {
//     if (!Array.isArray(mapData) || mapData.length === 0) return;

//     const updatedVehicleData = mapData.map(data => {
//       let rotate = null;

//       switch (data[3]) {
//         case 'N':
//           rotate = 0;
//           break;
//         case 'S':
//           rotate = 180;
//           break;
//         case 'W':
//           rotate = 270;
//           break;
//         case 'E':
//           rotate = 90;
//           break;
//         default:
//           rotate = null;
//       }

//       return {
//         name: data[0],
//         lat: data[1],
//         lng: data[2],
//         rotation: rotate,
//       };
//     });

//     setVehicleData(updatedVehicleData);
//   }, [mapData]);

//   useEffect(() => {
//     const createRotatedIcon = async (imageUrl, rotation) => {
//       return new Promise((resolve) => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         const img = new Image();
//         img.src = imageUrl;
//         img.onload = () => {
//           canvas.width = img.width;
//           canvas.height = img.height;
//           ctx.translate(canvas.width / 2, canvas.height / 2);
//           ctx.rotate((rotation * Math.PI) / 180);
//           ctx.drawImage(img, -img.width / 2, -img.height / 2);
//           resolve(canvas.toDataURL());
//         };
//       });
//     };


//     const updateMarkerIcons = async () => {
//       const icons = {};
//       for (const vehicle of vehicleDatas) {
//         const rotatedIcon = await createRotatedIcon(myImage.src, vehicle.rotation);
//         icons[vehicle.name] = rotatedIcon;
//       }
//       setMarkerIcons(icons);
//     };

//     updateMarkerIcons();
//   }, [vehicleDatas, myImage]);

//   useEffect(() => {
//     const handleZoom = (event) => {
//       if (window.innerWidth > 2500 && (event.ctrlKey || event.metaKey)) {
//         if (event.key === '-') {
//           event.preventDefault();
//         }
//       }
//     };

//     document.addEventListener('keydown', handleZoom);
//     return () => {
//       document.removeEventListener('keydown', handleZoom);
//     };
//   }, []);

//   const handleMapLoad = () => {
//     setMapLoaded(true);
//   };

//   if (loading) return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className={`col-4 ${classes.leftSideScroll}`}>
//           <Skeleton height={40} width={200} style={{ marginBottom: '20px' }} />
//           <Skeleton height={30} width={200} style={{ marginBottom: '20px' }} />
//           <Skeleton height={20} width={100} style={{ marginBottom: '20px' }} />
//           <Skeleton height={20} width={150} style={{ marginBottom: '20px' }} />
//           <Skeleton height={150} style={{ marginBottom: '20px' }} />
//           <Skeleton height={50} style={{ marginBottom: '20px' }} />
//           <Skeleton height={50} style={{ marginBottom: '20px' }} />
//         </div>
//         <div className="col-8 overflow-hidden">
//           <Skeleton height={400} />
//         </div>
//       </div>
//     </div>
//   );

//   if (error) return <div>Error: {error}</div>;

//   const handleToggleDetail = () => {
//     setIsDetailOpen(!isDetailOpen);
//   };

//   const handleToggleHour = () => {
//     setIsHourOpen(!isHourOpen);
//   };

//   return (
//     <div className="container-fluid" style={{ minWidth: '1200px', overflow: 'auto' }}>
//       <div className="row">
//         <div className={`col-6 ${classes.leftSideScroll}`}>
//           <Link
//             href="/dashboard/drivers"
//             className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
//           >
//             <i className="ki-duotone ki-left"></i> Back
//           </Link>
//           <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
//             {data && data[0] && data[0].first_name} {data && data[0] && data[0].last_name}
//           </h3>
//           <div className="mb-4">
//             <i className="ki-duotone ki-phone align-middle fs-4">
//               <span className="path1"></span>
//               <span className="path2"></span>
//             </i>
//             <span className="fs-7">{data && data[0] && data[0].mobile_no}</span>
//           </div>
//           <div>
//             <span className="fs-7">
//               <i className="ki-duotone align-middle ki-notepad fs-4">
//                 <span className="path1"></span>
//                 <span className="path2"></span>
//                 <span className="path3"></span>
//                 <span className="path4"></span>
//                 <span className="path5"></span>
//               </i>
//               <span className="border-bottom border-dark-subtle">
//                 View Driver Record
//               </span>
//             </span>
//             <div>
//               <i className="ki-duotone align-middle ki-tablet fs-4">
//                 <span className="path1"></span>
//                 <span className="path2"></span>
//                 <span className="path3"></span>
//               </i>
//               <span className="fs-7">Signed out from v.2420.202.12103</span>
//             </div>
//           </div>

//           <div className="separator my-5"></div>

//           <div className="accordion accordion-icon-toggle">
//             <div className="mb-5">
//               <div
//                 className="accordion-header py-3 d-flex"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#kt_accordion_2_item_1"
//                 onClick={handleToggleDetail}
//               >
//                 <span className="">
//                   <i
//                     className={`ki-duotone ${isDetailOpen ? "ki-up" : "ki-down"} fs-5 fw-bolder`}
//                   ></i>
//                 </span>
//                 <h4 className="fw-bold mb-0 ms-4">Details</h4>
//               </div>
//               {isDetailOpen && (
//                 <div className="fs-7">
//                   <div className="d-flex justify-content-between mt-4">
//                     <div>
//                       <p>Driver License</p>
//                     </div>
//                     <div>{data && data[3] && data[3].licenseNumber}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="separator my-5"></div>

//           <div className="accordion accordion-icon-toggle" id="kt_accordion_2">
//             <div className="mb-5">
//               <div
//                 className="accordion-header py-3 d-flex"
//                 onClick={handleToggleHour}
//               >
//                 <span className="">
//                   <i
//                     className={`ki-duotone ${isHourOpen ? "ki-up" : "ki-down"} fs-5 fw-bolder`}
//                   ></i>
//                 </span>
//                 <h5 className="fw-bold mb-0 ms-4">Hours of Service</h5>
//               </div>
//               {isHourOpen && (
//                 <div className="fs-7 ">
//                   <div className={`d-flex justify-content-between mt-4 ${classes.expandDiv}`}>
//                     <div>
//                       <p>Log</p>
//                     </div>
//                     <div>
//                       <Link
//                         href={`/dashboard/drivers/detail/${slug}/hoursOfService`}
//                         className="border-bottom border-dark-subtle link-dark"
//                       >
//                         View log details
//                       </Link>
//                     </div>
//                   </div>
//                   <div className="fs-7">
//                     <div className={`d-flex justify-content-around mt-4`}>
//                       <div className={`${classes.chartDiv}`} >
//                         {isLoading ?
//                           <LineChart params={graph} /> : ""
//                         }
//                       </div>
//                     </div></div>
//                   <table>
//                     <tbody>
//                       {data && data.length > 0 && (
//                         <>
//                           <tr>
//                             <td className="text-start fw-normal">Duty status</td>
//                             <td className="text-end fw-semibold">
//                               {data[5]
//                                 ?
//                                 <span className="badge text-bg-dark">{data[5]}</span>
//                                 :
//                                 <span className="badge text-bg-dark">Off duty</span>
//                               }
//                             </td>
//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Time in current status</td>
//                             {data[2]
//                               ?
//                               <td className="text-end fw-normal">{data[2]}</td>
//                               :
//                               <td className="text-end fw-normal">00:00:00</td>
//                             }

//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Time until break</td>
//                             {data[8]
//                               ?
//                               <td className="text-end fw-normal">{data[8]}</td>
//                               :
//                               <td className="text-end fw-normal">08:00:00</td>
//                             }
//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Drive remaining</td>
//                             {data[7]
//                               ?
//                               <td className="text-end fw-normal">{data[7]}</td>
//                               :
//                               <td className="text-end fw-normal">11:00:00</td>
//                             }
//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Shift remaining</td>
//                             {data[8]
//                               ?
//                               <td className="text-end fw-normal">{data[4]}</td>
//                               :
//                               <td className="text-end fw-normal">14:00:00</td>
//                             }
//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Cycle remaining</td>
//                             {data[8]
//                               ?
//                               <td className="text-end fw-normal">{data[6]}</td>
//                               :
//                               <td className="text-end fw-normal">60:00:00</td>
//                             }
//                           </tr>
//                           <tr>
//                             <td className="text-start fw-normal">Cycle tomorrow</td>
//                             <td className="text-end fw-normal">70:00:00</td>
//                           </tr>
//                         </>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className={`col-6 overflow-hidden ${classes.mapDiv}`}>
//           {isLoaded && (
//             <GoogleMap
//               onLoad={handleMapLoad}
//               mapContainerStyle={mapContainerStyle}
//               center={center}
//               zoom={5}
//             >
//               {vehicleDatas.map((vehicle) => (
//                 <Marker
//                   key={vehicle.name}
//                   position={{ lat: vehicle.lat, lng: vehicle.lng }}
//                   icon={markerIcons[vehicle.name] ? {
//                     url: markerIcons[vehicle.name],
//                     scaledSize: new window.google.maps.Size(60, 60),
//                     anchor: new window.google.maps.Point(30, 30),
//                   } : {
//                     url: myImage.src, // Fallback to default image if needed
//                     scaledSize: new window.google.maps.Size(60, 60),
//                     anchor: new window.google.maps.Point(30, 30),
//                   }}
//                   onMouseOver={() => setHoveredMarker(vehicle.name)}
//                   onMouseOut={() => setHoveredMarker(null)}
//                 >
//                   {hoveredMarker === vehicle.name && (
//                     <InfoWindow
//                       options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
//                     >
//                       <div className="p-2 bg-light fs-4 rounded shadow-sm">
//                         <h6 className="fw-bold mb-0 fs-4">{vehicle.name}</h6>
//                       </div>
//                     </InfoWindow>
//                   )}
//                 </Marker>
//               ))}
//             </GoogleMap>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import classes from "./DriverDetails.module.css";
import StepLineChart from "./StepLineChart";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import myImage from '../../../public/logo/a.png'; // Ensure this path is correct
import LineChart from "../GraphComponents/LineChart";

const mapContainerStyle = {
  height: "86vh",
  width: "100%",
};

const center = {
  lat: 34.4142989,
  lng: -112.2301242,
};

export default function Driverdetails() {
  const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;
  // const [display, setDisplay] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => setDisplay(true), 10000);
  // }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MapKey,
    libraries: ['geometry', 'drawing'],
  });

  const [data, setData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [vehicleDatas, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graph, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHourOpen, setIsHourOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markerIcons, setMarkerIcons] = useState({});
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const { slug } = useParams();

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

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BackEND}/driver/detail/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); // Get the response body text for more details
          console.log(`Network response was not ok: ${response.status} ${response.statusText}`);
          console.log(`Error details: ${errorText}`); // Log the detailed error message
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);


  useEffect(() => {
    if (!slug) return;

    const fetchMapData = async () => {
      try {
        const response = await fetch(`${BackEND}/driver/location/data/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const results = await response.json();
        setMapData(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [slug, token, BackEND]);

  useEffect(() => {

    const graphData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BackEND}/graph/chart/data/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const results = await response.json();

        setGraphData(results);

      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    graphData();

  }, [slug, token]);

  useEffect(() => {
    if (!Array.isArray(mapData) || mapData.length === 0) return;

    const updatedVehicleData = mapData.map(data => {
      let rotate = null;

      switch (data[3]) {
        case 'N':
          rotate = 0;
          break;
        case 'S':
          rotate = 180;
          break;
        case 'W':
          rotate = 270;
          break;
        case 'E':
          rotate = 90;
          break;
        default:
          rotate = null;
      }

      return {
        name: data[0],
        lat: data[1],
        lng: data[2],
        rotation: rotate,
      };
    });

    setVehicleData(updatedVehicleData);
  }, [mapData]);

  useEffect(() => {
    const createRotatedIcon = async (imageUrl, rotation) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          resolve(canvas.toDataURL());
        };
      });
    };


    const updateMarkerIcons = async () => {
      const icons = {};
      for (const vehicle of vehicleDatas) {
        const rotatedIcon = await createRotatedIcon(myImage.src, vehicle.rotation);
        icons[vehicle.name] = rotatedIcon;
      }
      setMarkerIcons(icons);
    };

    updateMarkerIcons();
  }, [vehicleDatas, myImage]);

  useEffect(() => {
    const handleZoom = (event) => {
      // if (window.innerWidth < 2000 && (event.ctrlKey || event.metaKey)) {
      //   if (event.key === '+' || event.key === '=') {
      //     event.preventDefault();
      //   }
      // }
      if (window.innerWidth > 2500 && (event.ctrlKey || event.metaKey)) {
        if (event.key === '-') {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleZoom);
    return () => {
      document.removeEventListener('keydown', handleZoom);
    };
  }, []);
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  if (loading) return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-4 ${classes.leftSideScroll}`}>
          <Skeleton height={40} width={200} style={{ marginBottom: '20px' }} />
          <Skeleton height={30} width={200} style={{ marginBottom: '20px' }} />
          <Skeleton height={20} width={100} style={{ marginBottom: '20px' }} />
          <Skeleton height={20} width={150} style={{ marginBottom: '20px' }} />
          <Skeleton height={150} style={{ marginBottom: '20px' }} />
          <Skeleton height={50} style={{ marginBottom: '20px' }} />
          <Skeleton height={50} style={{ marginBottom: '20px' }} />
        </div>
        <div className="col-8 overflow-hidden">
          <Skeleton height={400} />
        </div>
      </div>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  const handleToggleDetail = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  const handleToggleHour = () => {
    setIsHourOpen(!isHourOpen);
  };



  return (
    <div className="container-fluid" style={{ minWidth: '1200px', overflow: 'auto' }}>
      <div className="row">
        <div className={`col-6 ${classes.leftSideScroll}`}>
          <Link
            href="/dashboard/drivers"
            className="align-items-start flex-column btn btn-outline btn-outline btn-outline-muted btn-active-light-secondary"
          >
            <i className="ki-duotone ki-left"></i> Back
          </Link>
          <h3 className="align-items-start flex-column fs-2 fw-bold text-gray-800 mt-5">
            {data && data[0] && data[0].first_name} {data && data[0] && data[0].last_name}
          </h3>
          <div className="mb-4">
            <i className="ki-duotone ki-phone align-middle fs-4">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <span className="fs-7">{data && data[0] && data[0].mobile_no}</span>
          </div>
          <div>
            <span className="fs-7">
              <i className="ki-duotone align-middle ki-notepad fs-4">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
              </i>
              <span className="border-bottom border-dark-subtle">
                View Driver Record
              </span>
            </span>
            <div>
              <i className="ki-duotone align-middle ki-tablet fs-4">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              <span className="fs-7">Signed out from v.2420.202.12103</span>
            </div>
          </div>

          <div className="separator my-5"></div>

          <div className="accordion accordion-icon-toggle">
            <div className="mb-5">
              <div
                className="accordion-header py-3 d-flex"
                data-bs-toggle="collapse"
                data-bs-target="#kt_accordion_2_item_1"
                onClick={handleToggleDetail}
              >
                <span className="">
                  <i
                    className={`ki-duotone ${isDetailOpen ? "ki-up" : "ki-down"} fs-5 fw-bolder`}
                  ></i>
                </span>
                <h4 className="fw-bold mb-0 ms-4">Details</h4>
              </div>
              {isDetailOpen && (
                <div className="fs-7">
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <p>Driver License</p>
                    </div>
                    <div>{data && data[3] && data[3].licenseNumber}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="separator my-5"></div>

          <div className="accordion accordion-icon-toggle" id="kt_accordion_2">
            <div className="mb-5">
              <div
                className="accordion-header py-3 d-flex"
                onClick={handleToggleHour}
              >
                <span className="">
                  <i
                    className={`ki-duotone ${isHourOpen ? "ki-up" : "ki-down"} fs-5 fw-bolder`}
                  ></i>
                </span>
                <h5 className="fw-bold mb-0 ms-4">Hours of Service</h5>
              </div>
              {isHourOpen && (
                <div className="fs-7 ">
                  <div className={`d-flex justify-content-between mt-4 ${classes.expandDiv}`}>
                    <div>
                      <p>Log</p>
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/drivers/detail/${slug}/hoursOfService`}
                        className="border-bottom border-dark-subtle link-dark"
                      >
                        View log details
                      </Link>
                    </div>
                  </div>
                  <div className="fs-7">
                    <div className={`d-flex justify-content-around mt-4`}>
                      <div className={`${classes.chartDiv}`} >
                        {isLoading ?
                          <LineChart params={graph} /> : ""
                        }
                      </div>
                    </div></div>
                  <table>
                    <tbody>
                      {data && data.length > 0 && (
                        <>
                          <tr>
                            <td className="text-start fw-normal">Duty status</td>
                            <td className="text-end fw-semibold">
                              {data[5]
                                ?
                                <span className="badge text-bg-dark">{data[5]}</span>
                                :
                                <span className="badge text-bg-dark">Off duty</span>
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Time in current status</td>
                            {data[2]
                              ?
                              <td className="text-end fw-normal">{data[2]}</td>
                              :
                              <td className="text-end fw-normal">00:00:00</td>
                            }

                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Time until break</td>
                            {data[8]
                              ?
                              <td className="text-end fw-normal">{data[8]}</td>
                              :
                              <td className="text-end fw-normal">08:00:00</td>
                            }
                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Drive remaining</td>
                            {data[7]
                              ?
                              <td className="text-end fw-normal">{data[7]}</td>
                              :
                              <td className="text-end fw-normal">11:00:00</td>
                            }
                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Shift remaining</td>
                            {data[8]
                              ?
                              <td className="text-end fw-normal">{data[4]}</td>
                              :
                              <td className="text-end fw-normal">14:00:00</td>
                            }
                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Cycle remaining</td>
                            {data[8]
                              ?
                              <td className="text-end fw-normal">{data[6]}</td>
                              :
                              <td className="text-end fw-normal">60:00:00</td>
                            }
                          </tr>
                          <tr>
                            <td className="text-start fw-normal">Cycle tomorrow</td>
                            <td className="text-end fw-normal">70:00:00</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`col-6 overflow-hidden ${classes.mapDiv}`}>
          {isLoaded && (
            <GoogleMap
              onLoad={handleMapLoad}
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={5}
            >
              {vehicleDatas.map((vehicle) => (
                <Marker
                  key={vehicle.name}
                  position={{ lat: vehicle.lat, lng: vehicle.lng }}
                  icon={markerIcons[vehicle.name] ? {
                    url: markerIcons[vehicle.name],
                    scaledSize: new window.google.maps.Size(60, 60),
                    anchor: new window.google.maps.Point(30, 30),
                  } : {
                    url: myImage.src, // Fallback to default image if needed
                    scaledSize: new window.google.maps.Size(60, 60),
                    anchor: new window.google.maps.Point(30, 30),
                  }}
                  onMouseOver={() => setHoveredMarker(vehicle.name)}
                  onMouseOut={() => setHoveredMarker(null)}
                >
                  {hoveredMarker === vehicle.name && (
                    <InfoWindow
                      options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
                    >
                      <div className="p-2 bg-light fs-4 rounded shadow-sm">
                        <h6 className="fw-bold mb-0 fs-4">{vehicle.name}</h6>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}
