"use client";

import React, { useEffect, useState, useCallback } from "react";
import TruckWithTemprature from "./TruckWithTemprature";
import classes from "./TruckWithTemprature/TruckWithTemprature.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { debounce } from "lodash";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow, DrawingManager } from "@react-google-maps/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [envs, setEnvs] = useState(null);
  const [envData, setEnvData] = useState([]);

  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const MapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
    "places", "geometry", "drawing"
  ];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries, // Ensure libraries are consistent
    id: "google-map-script", // Ensure consistent id
    version: "weekly",
  });

  const fetchUsers = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const getCookie = (name) => {
          const nameEQ = name + "=";
          const ca = document.cookie.split(";");
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1);
            if (c.indexOf(nameEQ) === 0)
              return c.substring(nameEQ.length, c.length);
          }
          return null;
        };

        const token = getCookie("token");

        if (!token) {
          console.error("No token available");
          return;
        }

        const response = await axios.get(`${url}/assets/enviornment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setEnvs(response.data);
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }, 2000),
    [url]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (envs) {
      const processEnvData = async () => {
        const envDataPromises = envs.map(async (data) => {
          const fuel = data && data[0] && data[0].obd_fuel;
          const mesFuel = (fuel * 9 / 5) + 32;
          if (data && data[0] && data[0]?.location) {
            var loctn = JSON.parse(data && data[0] && data[0]?.location);
          }

          // Extract latitude and longitude
          const latitude = loctn?.GeoLocation?.Latitude;
          const longitude = loctn?.GeoLocation?.Longitude;

          let address = "Unknown Location";
          if (latitude && longitude) {
            try {
              address = await fetchAddressFromCoordinates(latitude, longitude, MapKey);
            } catch (error) {
              console.error("Error fetching address:", error);
            }
          }

          return {
            address: address, // or you can specify a specific property for address if needed
            temperature: `${mesFuel}°F`,
            name: data[1],
          };
        });

        const resolvedEnvData = await Promise.all(envDataPromises);
        setEnvData(resolvedEnvData);
      };

      processEnvData();
    }
  }, [envs, MapKey]);

  async function fetchAddressFromCoordinates(latitude, longitude, apiKey) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch the address');
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error('Geocoding API returned an error');
    }

    // Extract the formatted address from the API response
    const address = data.results[0]?.formatted_address || 'Unknown Location';

    return address;
  }

  useEffect(() => {
    if (envs && envData) {
      setLoading(false);
    }
  }, [envs, envData])

  if (loading) {
    if (loading) {
      return (
        <div>
          <h2>Environments</h2>
          <p style={{ marginBottom: "40px", color: "gray", cursor: "pointer" }}>
            <span onClick={() => router.push("/")}>Home - </span>
            <span style={{ cursor: "default" }}>Environments</span>
          </p>
          <div className={classes.wrapper}>
            <div className={classes.truckContainer}>
              <div style={{ position: "relative", alignSelf: "center" }}>
                <Skeleton width={200} height={300} />
                <div style={{ position: "absolute", top: "50%", right: "50%", transform: "translate(37%, -50%)", fontSize: "14px", marginLeft: "-6px" }}>
                  {/* <Skeleton width={100} height={100} /> */}
                </div>
              </div>
              <div className={classes.truckName} style={{ marginTop: '20px' }}>
                <Skeleton width={80} height={15} />
              </div>
              <div className={classes.address}>
                <div className={classes.mapIcon}>
                  {/* <Skeleton width={100} height={100} /> */}
                </div>
                <i className="fas fa-map-marker-alt"></i>
                <p style={{ margin: 0, fontSize: "14px", textAlign: "center" }}>
                  <Skeleton width={350} height={15} />
                </p>
              </div>
            </div>
            <div className={classes.truckContainer}>
              <div style={{ position: "relative", alignSelf: "center" }}>
                <Skeleton width={200} height={300} />
                <div style={{ position: "absolute", top: "50%", right: "50%", transform: "translate(37%, -50%)", fontSize: "14px", marginLeft: "-6px" }}>
                  {/* <Skeleton width={100} height={100} /> */}
                </div>
              </div>
              <div className={classes.truckName} style={{ marginTop: '20px' }}>
                <Skeleton width={80} height={15} />
              </div>
              <div className={classes.address}>
                <div className={classes.mapIcon}>
                  {/* <Skeleton width={100} height={100} /> */}
                </div>
                <i className="fas fa-map-marker-alt"></i>
                <p style={{ margin: 0, fontSize: "14px", textAlign: "center" }}>
                  <Skeleton width={350} height={15} />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <h2>Environments</h2>
      <p style={{ marginBottom: "40px", color: "gray", cursor: "pointer" }}>
        <span onClick={() => router.push("/")}>Home - </span>
        <span style={{ cursor: "default" }}>Environments</span>
      </p>
      <div className={classes.wrapper}>
        {envData.map((data) => {
          return (
            <TruckWithTemprature
              key={data.temperature}
              address={data.address}
              temprature={data.temperature}
              name={data.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
