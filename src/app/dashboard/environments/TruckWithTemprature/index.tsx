"use client";
import React from "react";
import classes from "./TruckWithTemprature.module.css";
import Image from "next/image";
import TruckImg from "../../../../../public/media/misc/Truck.png";
import Location from "../../../../../public/media/misc/location-green.jpg";

const TruckWithTemprature = ({
  address,
  temprature,
}: {
  temprature: string;
  address: string;
}) => {
  return (
    <div className={classes.truckContainer}>
      <div style={{ position: "relative" }}>
        <Image src={TruckImg} alt="truck-image" width={60} height={200} />
        <label className={classes.label}>{temprature}</label>
      </div>

      <div className={classes.address}>
        <Image
          src={Location}
          alt="location-green"
          width={10}
          height={10}
          style={{ marginTop: "4px" }}
        />
        <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>
          {address}
        </p>
      </div>
    </div>
  );
};

export default TruckWithTemprature;
