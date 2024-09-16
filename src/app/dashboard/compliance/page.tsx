"use client";

import React, { useEffect, useMemo, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import { DateRangePicker } from "react-date-range";
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

  return (
    <>
      
    </>
  );
};

export default Page;
