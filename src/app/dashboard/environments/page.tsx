"use client";

import React from "react";
import TruckWithTemprature from "./TruckWithTemprature";
import classes from "./TruckWithTemprature/TruckWithTemprature.module.css";
import { useRouter } from "next/navigation";

const dummyData = [
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
  {
    address: "Maple Street, Suite 567, Spring, IL 62704, USA",
    temprature: "156.2 °F",
  },
];

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <h2>Environments</h2>
      <p style={{ marginBottom: "40px", color: "gray", cursor: "pointer" }}>
        <span onClick={() => router.push("/")}>Home - </span>
        <span style={{ cursor: "default" }}>Environments</span>
      </p>
      <div className={classes.wrapper}>
        {dummyData.map((data) => {
          return (
            <TruckWithTemprature
              key={data.temprature}
              address={data.address}
              temprature={data.temprature}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
