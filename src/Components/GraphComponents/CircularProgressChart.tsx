"use client";

import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const CircularProgressChart = ({
  positivePercentage,
}: {
  positivePercentage: number;
}) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "60%",
          margin: 10,
        },
        track: {
          background: "#ff0000",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            color: "grey",
            offsetY: 20,
          },
          value: {
            offsetY: -20,
            fontSize: "22px",
            fontWeight: 600,
            color: "#000000",
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    fill: {
      colors: ["#64eb64"],
      opacity: 1,
    },
    stroke: {
      lineCap: "butt",
    },

    labels: ["Managed", "In Viaolation"],
  };

  const chartSeries = [positivePercentage];
  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="radialBar"
        height={180}
      />
    </div>
  );
};

export default CircularProgressChart;
