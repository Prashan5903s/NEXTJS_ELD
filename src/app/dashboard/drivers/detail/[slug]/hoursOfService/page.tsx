"use client";
import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  memo,
} from "react";

import Link from "next/link";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useParams } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import { useSession } from "next-auth/react";
const LineChart = lazy(() => import("@/Components/GraphComponents/LineChart"));
import { debounce } from "lodash";
import { useJsApiLoader } from "@react-google-maps/api";
// import LoadingIcons from 'react-loading-icons';
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import Skeleton CSS

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "drawing",
];

export default function HoursOfService({ params }) {
  const MemoizedLineChart = memo(LineChart);

  const driverId = params.slug;
  const [isDateOpen, setIsDateOpen] = useState(new Set());
  const [isDateKeyLoading, setDateKeyLoading] = useState(false);
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isGraphLoading, setGraphLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isViolation, setIsViolation] = useState(false); // Example initialization
  const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [datas, setData] = useState(null);
  const [graphDataMap, setGraphDataMap] = useState({}); // Store graph data by date key
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHourOpen, setIsHourOpen] = useState(false);
  const { slug } = useParams();

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 7);

  // Function to format a date as yyyy-mm-dd
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [date_start, setDateStart] = useState(formatDate(pastDate));
  const [date_end, setDateEnd] = useState(formatDate(today));

  const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MapKey,
    libraries, // Reference the static libraries array
    id: "google-map-script", // Use a consistent id
    version: "weekly",
  })

  interface User {
    token: string;
    // Add other properties you expect in the user object
  }

  interface SessionData {
    user?: User;
    // Add other properties you expect in the session data
  }

  const { data } = useSession() as { data?: SessionData };
  const token = data?.user?.token;

  const findLocationFromLatLng = (lat, lng, index) => {
    // Check if lat and lng are valid numbers
    if (isNaN(lat) || isNaN(lng)) {
      // console.error(`Invalid latlng: (${lat}, ${lng})`);
      return;
    }

    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddresses((prev) => ({
          ...prev,
          [index]: results[0].formatted_address,
        }));
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  };

  const fetchDriverDetails = useCallback(
    debounce(async () => {
      if (!slug) return;

      setLoading(true);

      try {
        const response = await fetch(`${BackEND}/driver/hos/detail/${slug}`, {
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
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300), // Debounce time in milliseconds
    [slug, BackEND, token]
  );

  // Use useEffect to call the debounced fetch function
  useEffect(() => {
    if (token) {
      fetchDriverDetails();
    }
  }, [fetchDriverDetails, token]);

  const fetchLogs = useCallback(
    debounce(async () => {
      if (!slug || !date_start || !date_end) return;

      setLoading(true); // Ensure loading state is true when fetching logs
      setDateKeyLoading(false);
      try {
        const response = await fetch(
          `${BackEND}/driver/date/log/${slug}/${date_start}/${date_end}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setDateKeyLoading(true);

        const result = await response.json();
        setLog(result);
      } catch (err) {
        setError(err.message);
      }
    }, 300), // Debounce time in milliseconds
    [slug, date_start, date_end, BackEND, token]
  );

  // Use useEffect to call the debounced fetch function
  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [fetchLogs, token]);

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

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]); // Update the date range state

    // Update date_start and date_end based on the selected range
    const startDate = formatDate(ranges.selection.startDate);
    const endDate = formatDate(ranges.selection.endDate);

    setDateStart(startDate);
    setDateEnd(endDate);
    setDateKeyLoading(false);
    setOpen(false); // Close the date range picker
  };

  const toggleDatePicker = () => {
    setOpen(!open);
  };

  const [isFetching, setIsFetching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 6;
  const throttleDelay = 300; // Throttle delay in milliseconds

  const fetchGraphHosData = async (date) => {
    setLoading(true);
    try {
      // Throttling: Wait before making the request
      await new Promise((resolve) => setTimeout(resolve, throttleDelay));

      const response = await fetch(
        `${BackEND}/graph/chart/data/${driverId}/${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 429) {
        throw new Error("Too Many Requests");
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setRetryCount(0); // Reset retry count after successful request
      return result;
    } catch (err) {
      if (err.message === "Too Many Requests" && retryCount < maxRetries) {
        const backoffTime = Math.min(2000 * Math.pow(2, retryCount), 16000);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        setRetryCount(retryCount + 1);
        return await fetchGraphHosData(date);
      } else if (retryCount >= maxRetries) {
        setError("Max retries reached. Please try again later.");
      } else {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async (dateKey) => {
    if (isFetching) return; // Prevent concurrent requests

    setIsFetching(true);
    setLoading(true);
    try {
      const result = await fetchGraphHosData(dateKey.toString());
      if (result) {
        setGraphDataMap((prev) => ({ ...prev, [dateKey]: result }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token && Array.isArray(log) && log.length > 0) {
      // Create a copy of the logs that haven't been fetched yet
      const logsToFetch = log.filter((logEntry) => {
        const dateKey = Object.keys(logEntry)[0];
        return !graphDataMap[dateKey];
      });

      // Throttle requests by adding a delay between fetches
      const fetchLogs = async () => {
        for (let i = 0; i < logsToFetch.length; i++) {
          const dateKey = Object.keys(logsToFetch[i])[0];
          await fetchGraphData(dateKey);
          await new Promise((resolve) => setTimeout(resolve, throttleDelay)); // Add delay between requests
        }
      };

      fetchLogs();
    }
  }, [log, token]); // Dependency on log array

  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    if (isLoaded && window.google && Array.isArray(log)) {
      const geocoder = new window.google.maps.Geocoder();

      log.forEach((logEntry) => {
        const dateKey = Object.keys(logEntry)[0];
        const startLoc = logEntry[dateKey][3];
        const endLoc = logEntry[dateKey][4];

        // Initialize address state for the current dateKey if not already present
        setAddresses((prevAddresses) => ({
          ...prevAddresses,
          [dateKey]: {
            start: prevAddresses[dateKey]?.start || null,
            end: prevAddresses[dateKey]?.end || null,
          },
        }));

        // Validate startLoc coordinates before geocoding
        if (
          Array.isArray(startLoc) &&
          startLoc.length === 2 &&
          typeof startLoc[0] === "number" &&
          typeof startLoc[1] === "number" &&
          !isNaN(startLoc[0]) &&
          !isNaN(startLoc[1])
        ) {
          const latLng = new window.google.maps.LatLng(
            startLoc[0],
            startLoc[1]
          );
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setAddresses((prevAddresses) => ({
                ...prevAddresses,
                [dateKey]: {
                  ...prevAddresses[dateKey],
                  start: results[0].formatted_address,
                },
              }));
            } else {
              console.error("Geocoder failed for start location: " + status);
            }
          });
        } else {
          // console.error("Invalid start location coordinates:", startLoc);
        }

        // Validate endLoc coordinates before geocoding
        if (
          Array.isArray(endLoc) &&
          endLoc.length === 2 &&
          typeof endLoc[0] === "number" &&
          typeof endLoc[1] === "number" &&
          !isNaN(endLoc[0]) &&
          !isNaN(endLoc[1])
        ) {
          const latLng = new window.google.maps.LatLng(endLoc[0], endLoc[1]);
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setAddresses((prevAddresses) => ({
                ...prevAddresses,
                [dateKey]: {
                  ...prevAddresses[dateKey],
                  end: results[0].formatted_address,
                },
              }));
            } else {
              console.error("Geocoder failed for end location: " + status);
            }
          });
        } else {
          // console.error("Invalid end location coordinates:", endLoc);
        }
      });
    }
  }, [isLoaded, log]);

  const timeToSeconds = (time) => {
    if (!time) return 0; // Return 0 if time is undefined or null
    let parts = time.split(":");
    return +parts[0] * 3600 + +parts[1] * 60 + +parts[2];
  };

  const secondsToTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeDate = (timestamp) => {
    const date = new Date(timestamp);

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, "0");

    return `${formattedHours}:${minutes} ${ampm}`;
  };

  var tableData =
    Array.isArray(log) && log.length > 0
      ? log.map((logEntry) => {
          const dateKey = Object.keys(logEntry)[0];
          const entryData = logEntry[dateKey][0];
          const entryDatas = logEntry[dateKey];
          const startLoc = logEntry[dateKey][3];
          const endLoc = logEntry[dateKey][4];
          var dataEntry = logEntry[dateKey][2];

          var graphDatas = graphDataMap && graphDataMap[dateKey];

          if (graphDatas) {
            var logDatas = graphDatas[0];
            var vehDatas = graphDatas[1];

            if (logDatas.length > 0) {
              var datasLog = logDatas[0];
              var startTime = datasLog[3];
              var vehName = datasLog[5];

              if (startTime != "00:00") {
                logDatas.unshift([
                  1,
                  1,
                  "Off duty",
                  "00:00",
                  `${startTime}`,
                  `${vehName}`,
                ]);
              }
            } else {
              vehDatas.push({ name: "abc" });
              logDatas.push([1, 1, "Off duty", "00:00", "23:59", "abc"]);
            }
          }

          function convertTo24HourFormat(time12h) {
            const [time, modifier] = time12h.split(" ");

            let [hours, minutes] = time.split(":");
            if (hours === "12") {
              hours = "00";
            }

            if (modifier === "PM") {
              hours = parseInt(hours, 10) + 12;
            }

            return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
          }

          function calculateTimeDifference(startTime, endTime) {
            const start = new Date(`01/01/2000 ${startTime}`);
            const end = new Date(`01/01/2000 ${endTime}`);

            let diff = end.getTime() - start.getTime();

            if (diff < 0) {
              diff += 24 * 60 * 60 * 1000; // Handle crossing over midnight
            }

            const hours = Math.floor(diff / 1000 / 60 / 60);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          }

          if (dataEntry.length > 0) {
            var stime = dataEntry[0][4];
            var etime = "12:00 AM";
            const start24h = convertTo24HourFormat(stime);
            const end24h = convertTo24HourFormat(etime);

            const result = calculateTimeDifference(end24h, start24h);
            if (stime != "12:00 AM") {
              dataEntry.unshift([
                `${result}`,
                "Off duty",
                null,
                "......",
                "12:00 AM",
                `${stime}`,
                [],
                "....",
              ]);
            }
          } else {
            dataEntry.push([
              "23:59:00",
              "Off duty",
              null,
              "......",
              "12:00 AM",
              "11:59 PM",
              [],
              "....",
            ]);
          }

          var data_shift = [];
          var data_cycle = [];
          var data_break = [];
          var data_drive = [];

          var startAddress = addresses[dateKey]?.start || "";
          var endAddress = addresses[dateKey]?.end || "";

          let total_viol = "00:00:00";
          let shiftViol = "00:00:00";
          let cycViol = "00:00:00";
          let breakViol = "00:00:00";
          let driveViol = "00:00:00";

          let shiftData = entryData.Shift_data;
          let cycleData = entryData.cycle_data;
          let breakData = entryData.eight_hour_break_violation;
          let driveData = entryData.driver_eleven_viol_data;

          if (shiftData) {
            if (shiftData.length === 0) {
              shiftViol = "00:00:00";
            } else {
              var time_start = formatTimeDate(shiftData[0].violation_startTime);
              var time_end = formatTimeDate(shiftData[0].violation_endTime);
              var reason = "Shift Duty Limit";
              shiftViol = shiftData[0].violation_duration;
              data_shift.push([time_start, time_end, reason, shiftViol]);
            }
          } else {
            shiftViol = "00:00:00";
          }

          if (cycleData) {
            if (cycleData.length === 0) {
              cycViol = "00:00:00";
            } else {
              var start_times = formatTimeDate(
                cycleData[0].violation_startTime
              );
              var end_times = formatTimeDate(cycleData[0].violation_endTime);
              var reason = "Cycle duty limit";
              cycViol = cycleData[0].violation_duration;
              data_cycle.push([start_times, end_times, reason, cycViol]);
            }
          } else {
            cycViol = "00:00:00";
          }

          if (breakData) {
            if (breakData.length === 0) {
              breakViol = "00:00:00";
            } else {
              var start_times = formatTimeDate(
                breakData[0].violation_start_time
              );
              var end_times = formatTimeDate(breakData[0].violation_end_date);
              var reason = "Eight hours break limit";
              breakViol = breakData[0].break_violation;
              data_break.push([start_times, end_times, reason, breakViol]);
            }
          } else {
            breakViol = "00:00:00";
          }

          if (driveData) {
            if (driveData.length === 0) {
              driveViol = "00:00:00";
            } else {
              var start_timess = formatTimeDate(driveData.drive_start_time);
              var end_timess = formatTimeDate(driveData.drive_end_time);
              var reason = "Drive shift limit";
              driveViol = driveData.drive_violate;
              data_drive.push([start_timess, end_timess, reason, driveViol]);
            }
          } else {
            driveViol = "00:00:00";
          }

          var data_total = [data_shift, data_cycle, data_break, data_drive];

          let totalSeconds = 0;
          totalSeconds += timeToSeconds(shiftViol);
          totalSeconds += timeToSeconds(cycViol);
          totalSeconds += timeToSeconds(breakViol);
          totalSeconds += timeToSeconds(driveViol);

          total_viol = secondsToTime(totalSeconds);

          return {
            logs: entryDatas,
            datas: dataEntry,
            total: data_total,
            date: dateKey,
            shift: entryData.total_shift_time || "00:00:00",
            driving: entryData.total_drive_time || "00:00:00",
            inViolation: total_viol || "00:00:00",
            from: startAddress,
            to: endAddress,
            details: entryData.details || "",
            Icon: entryData.Icon || "",
            path1: entryData.path1 || "",
            path2: entryData.path2 || "",
            path3: entryData.path3 || "",
            graphDatas: graphDataMap[dateKey] || "",
          };
        })
      : [];

  const filteredData = tableData.filter((row) => {
    const currentYear = new Date().getFullYear();
    const rowDate = new Date(`${row.date}, ${currentYear}`);
    return rowDate >= dateRange[0].startDate && rowDate <= dateRange[0].endDate;
  });

  var finalData = filteredData.length > 0 ? filteredData : tableData;

  useEffect(() => {
    if (driverId && log && graphDataMap && datas) {
      setIsDataLoading(true);
    }
  }, [driverId, log, graphDataMap, datas]);

  if (!isDataLoading) {
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
            Hours of Service Report -<Skeleton width={40} />
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
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Time in current status</p>
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Vehicle Name</p>
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Time until break</p>
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Drive remaining</p>
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Shift remaining</p>
              <Skeleton width={100} />
            </div>
            <div className="p-5">
              <p>Cycle remaining</p>
              <Skeleton width={100} />
            </div>
          </div>
        </div>

        <div className="border border-end-0 border-start-0 border-2 mt-5">
          <div className="d-flex justify-content-between">
            <div className="p-4">
              <Skeleton width={200} />
            </div>

            <div className="text-end p-4 position-relative d-flex flex-row">
              <Skeleton width={100} />
              <Skeleton width={100} />
            </div>
          </div>
        </div>

        <table className="mt-6 table gs-7 gy-7 gx-7 d-table">
          <thead>
            <tr className="fs-7">
              <th className="text-start">DATE(PDT)</th>
              <th className="text-start">SHIFT</th>
              <th className="text-start">DRIVING</th>
              <th className="text-start">IN VIOLATION</th>
              <th className="text-start">FROM</th>
              <th className="text-start">TO</th>
              <th className="text-start">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

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
            {datas && datas[0] && datas[0][0] ? datas[0][0].first_name : "N/A"}{" "}
            {datas && datas[0] && datas[0][0] ? datas[0][0].last_name : "N/A"}
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
            <span className="badge text-bg-dark fs-5">
              {datas && datas[0] && datas[0][5] ? datas[0][5] : ""}
            </span>
          </div>
          <div className="p-5">
            <p>Time in current status</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][2] ? datas[0][2] : "00:00:00"}
            </span>
          </div>
          <div className="p-5">
            <p>Vehicle Name</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][1] ? datas[0][1].name : ""}
            </span>
          </div>
          <div className="p-5">
            <p>Time until break</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][8] ? datas[0][8] : "00:00:00"}
            </span>
          </div>
          <div className="p-5">
            <p>Drive remaining</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][7] ? datas[0][7] : "00:00:00"}
            </span>
          </div>
          <div className="p-5">
            <p>Shift remaining</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][4] ? datas[0][4] : "00:00:00"}
            </span>
          </div>
          <div className="p-5">
            <p>Cycle remaining</p>
            <span className="fs-5 fw-semibold">
              {datas && datas[0] && datas[0][6] ? datas[0][6] : "00:00:00"}
            </span>
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

          <div className="d-flex align-items-center justify-content-center p-4">
            <div
              className="form-check form-switch form-check-reverse me-4"
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
              className="btn btn-outline btn-outline-muted btn-active-light-secondary me-4"
              onClick={handleExpandAll}
            >
              Expand All
            </button>
            <button
              className="btn btn-outline btn-outline-muted btn-active-light-secondary"
              onClick={handleCollapseAll}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>
      {isDateKeyLoading ? (
        <table className="mt-6 table gs-7 gy-7 gx-7 d-table">
          <thead>
            <tr className="fs-7">
              <th className="text-start">DATE(PDT)</th>
              <th className="text-start">SHIFT</th>
              <th className="text-start">DRIVING</th>
              <th className="text-start">IN VIOLATION</th>
              <th className="text-start">FROM</th>
              <th className="text-start">TO</th>
              <th className="text-start">DETAILS</th>
            </tr>
          </thead>

          <tbody>
            {finalData?.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    className="text-start fw-bolder"
                    role="button"
                    onClick={() => handleToggleDate(index)}
                  >
                    <i
                      className={`ki-duotone ${
                        isDateOpen.has(index) || isAllOpen ? "ki-up" : "ki-down"
                      } fs-5 me-2 fw-bolder`}
                    ></i>
                    {row.date}
                  </td>
                  <td className="text-start">{row.shift}</td>
                  <td className="text-start">{row.driving}</td>
                  <td
                    className={`text-start ${isViolation ? "text-danger" : ""}`}
                  >
                    {row.inViolation !== "00:00:00" && (
                      <i className="ki-duotone me-2 align-middle alert-danger">
                        <span className="badge bg-danger-subtle text-danger-emphasis fs-5">
                          {row.inViolation}
                        </span>
                      </i>
                    )}
                    {row.inViolation === "00:00:00" && (
                      <i className="ki-duotone me-2 align-middle">
                        <span className="fs-6">{row.inViolation}</span>
                      </i>
                    )}
                  </td>
                  <td className="text-start">
                    {row.from ? row.from : ".........."}
                  </td>
                  <td className="text-start">
                    {row.to ? row.to : ".........."}
                  </td>
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
                    {row.details ? row.details : "........."}
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
                              <span className="fw-normal">
                                {" "}
                                {row.logs[1][3].carrer_us_dot_number}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="separator my-5"></div>
                        <div className="text-start m-5 fs-6">
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
                              {row.logs[1][0].first_name}{" "}
                              {row.logs[1][0].last_name} -{" "}
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
                                row.datas.map((datas, index) => {
                                  // Check if the address for this row is already available
                                  if (!addresses[index]) {
                                    findLocationFromLatLng(
                                      datas[6][0],
                                      datas[6][1],
                                      index
                                    );
                                  }

                                  return (
                                    <tr className="fs-7" key={index}>
                                      <td className="text-start">
                                        <span className="fs-6 fw-semibold">
                                          {datas[4]} -
                                        </span>
                                        <div>
                                          <span>{datas[5]}</span>
                                        </div>
                                      </td>
                                      <td className="text-start">{datas[0]}</td>
                                      <td className="text-start">
                                        <span className="badge text-bg-dark fs-7">
                                          {datas[1]}
                                        </span>
                                      </td>
                                      <td className="text-start">{datas[2]}</td>
                                      <td className="text-start">{datas[3]}</td>
                                      <td className="text-start">{datas[7]}</td>
                                      <td className="text-start">
                                        {addresses[index] || "......"}{" "}
                                        {/* Use index to access address */}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr className="fs-7">
                                  <td className="text-center fw-bold">
                                    No data present
                                  </td>
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
                                row.total[0].map((datas, index) => (
                                  <div key={index} className="ms-8 mt-2 fs-7">
                                    <div className="border-bottom border-dark">
                                      <span className="fw-medium">
                                        {datas[0]} - {datas[1]} ({datas[3]})
                                      </span>
                                    </div>
                                    <div className="text-body-secondary">
                                      <span>{datas[2]}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No data available</p>
                              )}
                              {row?.total && row.total.length > 0 ? (
                                row.total[1].map((datas, index) => (
                                  <div key={index} className="ms-8 mt-2 fs-7">
                                    <div className="border-bottom border-dark">
                                      <span className="fw-medium">
                                        {datas[0]} - {datas[1]} ({datas[3]})
                                      </span>
                                    </div>
                                    <div className="text-body-secondary">
                                      <span>{datas[2]}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No data available</p>
                              )}
                              {row?.total && row.total.length > 0 ? (
                                row.total[2].map((datas, index) => (
                                  <div key={index} className="ms-8 mt-2 fs-7">
                                    <div className="border-bottom border-dark">
                                      <span className="fw-medium">
                                        {datas[0]} - {datas[1]} ({datas[3]})
                                      </span>
                                    </div>
                                    <div className="text-body-secondary">
                                      <span>{datas[2]}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No data available</p>
                              )}
                              {row?.total && row.total.length > 0 ? (
                                row.total[3].map((datas, index) => (
                                  <div key={index} className="ms-8 mt-2 fs-7">
                                    <div className="border-bottom border-dark">
                                      <span className="fw-medium">
                                        {datas[0]} - {datas[1]} ({datas[3]})
                                      </span>
                                    </div>
                                    <div className="text-body-secondary">
                                      <span>{datas[2]}</span>
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
      ) : (
        <table className="mt-6 table gs-7 gy-7 gx-7 d-table">
          <thead>
            <tr className="fs-7">
              <th className="text-start">DATE(PDT)</th>
              <th className="text-start">SHIFT</th>
              <th className="text-start">DRIVING</th>
              <th className="text-start">IN VIOLATION</th>
              <th className="text-start">FROM</th>
              <th className="text-start">TO</th>
              <th className="text-start">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
            <tr>
              <td className="text-start fw-bolder">
                <Skeleton width={100} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start ">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
              <td className="text-start">
                <Skeleton width={200} />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
