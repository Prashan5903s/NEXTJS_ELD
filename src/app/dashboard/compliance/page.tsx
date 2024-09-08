"use client";

import React, { useEffect, useMemo, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import ComplianceBox from "./ComplianceBox";
import { complianceDummyData } from "./ComplianceBox/data";
import ViaolationTable from "./DriverViolationTable";
import Form from "react-bootstrap/Form";
import { tableData } from "./DriverViolationTable/data";

const Page = () => {

  const [open, setOpen] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const today = new Date();
  

  const pastDate = new Date(today);
  const [date_start, setDateStart] = useState(formatDate(pastDate));
  const [date_end, setDateEnd] = useState(formatDate(today));

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);

    const startDate = formatDate(ranges.selection.startDate);
    const endDate = formatDate(ranges.selection.endDate);

    setDateStart(startDate);
    setDateEnd(endDate);

    setOpen(false);
  };
  const toggleDatePicker = () => {
    setOpen(!open);
  };

  const [selectedValue, setSelectedValue] = useState(0);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    console.log('Selected value', selectedValue);
  }, [selectedValue]);

  return (
    <>
      <div
        style={{ color: "#4b5675" }}
        className="py-4 border border-end-0 border-start-0 mb-4"
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
      <div style={{ flexWrap: "wrap", gap: "20px" }} className="d-flex">
        {complianceDummyData[selectedValue].map((data, index) => {
          return (
            <div className="position-relative" key={`${data} ${index}`}>
              <div
                style={{
                  right: "22px",
                  top: "40%",
                  zIndex: 90,
                  outline: "none",
                }}
                className="position-absolute"
              >
                {index === 0 && (
                  <Form.Select
                    size="sm"
                    style={{ border: "none", cursor: "pointer" }}
                    value={selectedValue}
                    onChange={handleChange}
                  >
                    <option value={0}>Hours</option>
                    <option value={1}>Logs</option>
                  </Form.Select>
                )}
              </div>
              <div style={{ flexWrap: "wrap", gap: "20px" }} className="d-flex">
                <ComplianceBox
                  title={data.title}
                  negativeLabel={data.negativeLabel}
                  positiveLabel={data.positiveLabel}
                  positivePercentage={data.positivePercentage}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ color: "#4b5675" }}>
        <ViaolationTable tableData={tableData[selectedValue]} />
      </div>
    </>
  );
};

export default Page;
