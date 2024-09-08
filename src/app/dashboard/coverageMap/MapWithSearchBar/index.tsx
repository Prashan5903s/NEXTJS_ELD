'use client'
import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  StandaloneSearchBox,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { debounce } from "lodash";
import { MarkCoordinate } from "../page";
import { getMarkCoordinates } from "./constants";

// Move libraries array outside of the component to avoid recreation on each render
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places", "geometry", "drawing"
];

const MapWithSearchBar = ({
  selectedCoordinates, setDateStarts, setDateEnds
}: {
  selectedCoordinates: MarkCoordinate[], setDateStarts: any, setDateEnds: any
}) => {

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries, // Ensure libraries are constant
    id: "google-map-script", // Ensure consistent id
    version: "weekly",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    selectedCoordinates.length > 0
      ? selectedCoordinates[0]
      : {
        lat: 36.7378,
        lng: -119.7871
      }
  );

  useEffect(() => {
    if (selectedCoordinates && selectedCoordinates[0]) {
      setCenter(selectedCoordinates[0]);
    }
  }, [selectedCoordinates])

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);

  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 7);

  const [date_start, setDateStart] = useState(formatDate(today));
  const [date_end, setDateEnd] = useState(formatDate(today));

  useEffect(() => {
    setDateStarts(date_start);
    setDateEnds(date_end);
  }, [date_start, date_end, setDateStarts, setDateEnds])

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;
          const latLng = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setCenter(latLng);
          map?.panTo(latLng);
        }
      }
    }
  }, [searchBox, map]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      },
    });
  }, []);

  const toggleDatePicker = () => {
    setOpen(!open);
  };

  const handleSelect = (ranges: any) => {
    setDateRange([ranges.selection]);

    const startDate = formatDate(ranges.selection.startDate);
    const endDate = formatDate(ranges.selection.endDate);

    setDateStart(startDate);
    setDateEnd(endDate);

    setOpen(false);
  };


  const markerIcon = {
    path: "M 0,0 m -10,0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0",
    fillColor: "black",
    fillOpacity: 1,
    strokeColor: "black",
    strokeWeight: 2,
    scale: 1.5,
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: "relative" }}>

      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{ height: "700px", width: "100%" }}
        onLoad={handleMapLoad}
      >
        {selectedCoordinates.length > 0 &&
          selectedCoordinates.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              icon={markerIcon}
              label={{
                text: marker.label || `${index + 1}`,
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
          ))}
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Search for an address..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `42px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              top: "10px",
              left: "50%",
              marginLeft: "-120px",
            }}
          />
        </StandaloneSearchBox>
      </GoogleMap>

      <div
        style={{
          color: "#4b5675",
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="py-4 mb-4"
      >
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
          <div
            style={{
              position: "absolute",
              zIndex: 1000,
              top: "50px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <DateRangePicker
              ranges={dateRange}
              onChange={handleSelect}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWithSearchBar;
