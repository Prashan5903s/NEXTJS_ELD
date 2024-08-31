"use client";

import React, { useState } from "react";
import MapWithSearchBar from "./MapWithSearchBar";
import Form from "react-bootstrap/Form";
import { markCoordinates } from "./MapWithSearchBar/constants";

export interface MarkCoordinate {
  lat: number;
  lng: number;
  label?: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCoordinates, setFilteredCoordinates] =
    useState<MarkCoordinate[]>(markCoordinates);

  const [selectedCoordinates, setSelectedCoordinates] = useState<
    MarkCoordinate[]
  >([]);

  const [toggleRightBar, setToggleRightBar] = useState(true);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = markCoordinates.filter((coord) =>
      coord.label?.includes(query)
    );

    setFilteredCoordinates(filtered);
  };

  const handleCheckboxChange = (coordinate: MarkCoordinate) => {
    setSelectedCoordinates((prev) => {
      const updated = new Set(prev.map((c) => JSON.stringify(c)));
      const coordinateStr = JSON.stringify(coordinate);

      if (updated.has(coordinateStr)) {
        updated.delete(coordinateStr);
      } else {
        updated.add(coordinateStr);
      }

      return Array.from(updated).map((c) => JSON.parse(c));
    });
  };

  return (
    <>
      <div className="h-100 d-flex gap-5">
        <div
          style={toggleRightBar ? { width: "75%" } : { width: "100%" }}
          className="map-section"
        >
          {selectedCoordinates.length ? (
            <MapWithSearchBar selectedCoordinates={selectedCoordinates} />
          ) : null}
          {selectedCoordinates.length === 0 ? (
            <MapWithSearchBar selectedCoordinates={markCoordinates} />
          ) : null}
        </div>
        <div
          style={
            toggleRightBar ? { width: "25%" } : { width: "0%", display: "none" }
          }
          className="right-bar"
        >
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1 className="m-0">Map Options</h1>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setToggleRightBar(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-x text-secondary"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
          </div>

          <div className="d-flex align-items-stretch  position-relative">
            <i className="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-2"></i>
            <input
              placeholder="Search assets"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                border: "none",
                outline: "none",
                padding: "10px",
                background: "#f6f7f9",
                boxShadow: "none",
                paddingLeft: "30px",
                marginRight: "20px",
                width: "100%",
              }}
            />
          </div>
          <Form>
            <div className="mb-3 mt-5">
              {filteredCoordinates.map((data) => {
                return (
                  <Form.Check
                    key={data.label}
                    className="mb-5 text-secondary"
                    type={"checkbox"}
                    id={data.label}
                    label={data.label}
                    checked={selectedCoordinates.some(
                      (c) => JSON.stringify(c) === JSON.stringify(data)
                    )}
                    onChange={() => handleCheckboxChange(data)}
                  />
                );
              })}
            </div>
          </Form>
        </div>
      </div>
      ;
    </>
  );
};

export default Page;
