'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from '../../styles/chart.module.css';
import GraphChart from 'react-apexcharts';
import { bottom } from '@popperjs/core';

// // Load the ApexCharts library dynamically to avoid server-side rendering issues
const LineChart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => <p>Loading...</p> });

function Chart({ processedData, params = null, data }) {

//OLD SLOW DATA 1440 because of for loops

  // const xTooltipLabels = Array.from({ length: 1440 }, (_, i) => {
  //   const hours = String(Math.floor(i / 60)).padStart(2, '0');
  //   const minutes = String(i % 60).padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // });

  //data for testing 
  //   let xAxis = [];
  //   xAxis = [    '6.30', '6.45', '7.15', '8.45', '23.45'];
  //  const yAxis = ['4','    3',    '1',    '2',     '1',    null];

  ///CREATING DATA FOR TOOLTIPS INFO OF GRAPH LINE (NOT VISIBLE ON GRAPH    BUG)

  let ySeriesData = data.map(point => point.status);
  let xSeriesData = data.map(point => point.stime);
  console.log('xSeriesData....' + ySeriesData + 'xSeriesData-------' + xSeriesData);





 ///////////////////////////////////////HERE STARTS THE NEW CODE LOGIC ////////////////////////////////////////////////////////////////

  //Adjustment for 15 minutes interval for x axis 
  console.log('Chart  data', JSON.stringify(data, null, 2));

  const xLabels = Array.from({ length: 1440 / 15 }, (_, i) => {
    const hours = String(Math.floor(i * 15 / 60)).padStart(2, '0');
    const minutes = String(i * 15 % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

/// Extract stime values
let xAxis = data.map(point => point.stime);
let lastEtime = null;
if (data.length > 0) {
  lastEtime = data[(data.length )-1].etime;
}

xAxis.push(lastEtime);
// Adjust the times for 15 minutes intervals
xAxis = adjustxData(xAxis);
console.log('lastEtime....     ' + lastEtime + 'xAxis-------   ' + xAxis);


  let yAxis = processedData.map(point => point.status);
  let lastStatus = null;
  if (data.length > 0) {
    lastStatus = data[(data.length )-1].status;
  }
  yAxis.push(lastStatus);

 
  //final data sent to graph
  //xAxis = [...xAxis, "23.45"];
  //yAxis = [...yAxis, '1'];
  console.log('yAxis....' + yAxis + 'xAxis-------' + xAxis);

  const xData = ["0.00", ...xAxis];
  const yData = [...yAxis];
  console.log('Ystatus....' + yData + 'XDATA-------' + xData);


  // Map xData to indices in the 15-minute intervals array
  const mappedData = new Array(xLabels.length).fill(null);

  xData.forEach((time, index) => {
    // Ensure the time is valid before splitting and formatting
    if (time) {
      const [hours, minutes] = time.split('.');
  
      // Check if hours and minutes are valid
      if (hours !== undefined && minutes !== undefined) {
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
        const i = xLabels.indexOf(formattedTime);
  
        if (i !== -1) {
          mappedData[i] = { x: formattedTime, y: yProcessData(yData[index]) };
        }
      } else {
        console.error(`Invalid time format in xData: ${time}`);
      }
    } else {
      console.error(`Null or undefined time value in xData at index ${index}`);
    }
  });
  
  // Fill gaps with the previous non-null value or a default value if all previous are null
  for (let i = 1; i < mappedData.length; i++) {
    if (mappedData[i] === null) {
      if (mappedData[i - 1] !== null) {
        mappedData[i] = { x: xLabels[i], y: mappedData[i - 1].y };
      } else {
        mappedData[i] = { x: xLabels[i], y: 0 };
      }
    }
  }

  // Handle the case where the first value might be null
  if (mappedData[0] === null) {
    mappedData[0] = { x: xLabels[0], y: 0 };
  }
  //Adjustment END for 15 minutes interval

  let filteredData = [];
  filteredData = processedData.map(point => point.colorLineData || []);
  let filteredDatar = filteredData[0] || [];

  // console.log('filteredData', JSON.stringify(filteredData, null, 2));
  // console.log('filteredDatarrr', JSON.stringify(filteredDatar, null, 2));

  const colorLineData = [];

  if (Array.isArray(filteredDatar) && filteredDatar.length > 0) {
    console.log('in colorLine array loop');
    filteredDatar.forEach(entry => {
      console.log('in colorLine for loop');

      const stime = entry.stime;
      const etime = entry.etime;
      const color = entry.color;
      console.log('colorLineData before processing', JSON.stringify(colorLineData, null, 2));

      if (!stime || !etime || !color) {
        console.warn(`Skipping invalid entry: ${JSON.stringify(entry)}`);
        return;
      }

      const startColumn = timeToColumn(stime);
      const endColumn = timeToColumn(etime);
      console.log(`Processing time range: ${stime} to ${etime}, color: ${color}`);

      let colorEntry = colorLineData.find(e => e.color === color);
      if (!colorEntry) {
        colorEntry = {
          color: color, // Use the actual color here
          colNums: []
        };
        colorLineData.push(colorEntry);
      }

      for (let i = startColumn; i < endColumn; i++) {
        if (!colorEntry.colNums.includes(i)) {
          colorEntry.colNums.push(i);
          console.log(`Added column ${i} to color ${color}`);
        }
      }
    });
  } else {
    console.log('No valid data to process in filteredData.');
  }

  console.log('Final colorLineData:', JSON.stringify(colorLineData, null, 2));


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Handle special case for midnight
    if (hours === 0 && minutes === 0) {
      return '00:00';
    }

    // Format hours according to the 24-hour format
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes.toString().padStart(2, '0')}`;
  };

  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  const processViolationData = (data) => {
    return data.map((item) => {
      const startDate = new Date(item['violation_startTime']);
      const endDate = new Date(item['violation_endTime']);

      // Format start and end times
      const startTimeFormatted = formatTime(item['violation_startTime']);
      const endTimeFormatted = formatTime(item['violation_endTime']);

      // Determine if end time should be "24:00" for end of the day
      const isEndOfDay = endDate.toISOString().startsWith(today) && (endDate.getUTCHours() === 23 && endDate.getUTCMinutes() === 59);

      return {
        stime: startTimeFormatted,
        etime: isEndOfDay ? '24:00' : endTimeFormatted,
      };
    });
  };

  //   console.log('overtime', overtimeRanges, sda);

  const specificKeys = ['Shift_data', 'cycle_data', 'eight_hour_break_violation', 'driver_eleven_viol_data'];
  let overtimeRanges = [];

  if (params['params'] && params['params'][2]) {
    specificKeys.forEach(key => {
      if (params['params'][2][key]) {
        overtimeRanges = overtimeRanges.concat(processViolationData(params['params'][2][key]));
      }
    });
  }

  const adjustedOvertimeRanges = adjustData(overtimeRanges);
  console.log('Final adjustedOvertimeRanges:', JSON.stringify(adjustedOvertimeRanges, null, 2));

  const xAnnotations = adjustedOvertimeRanges.map(range => ({
    x: range.stime,
    x2: range.etime,
    fillColor: '#FF4560',
    opacity: 0.3,
    borderColor: '#FF4560',
    borderWidth: 1,
  }));

  const annotations = [
    {
      y: 0,
      y2: 1,
      borderColor: '#fefbe2',
      borderWidth: 0.5,
      fillColor: 'yellow',
      opacity: 0.1,
    },
    {
      y: 1,
      y2: 2,
      borderColor: '#ddfeda',
      borderWidth: 0.5,
      fillColor: 'green',
      opacity: 0.1,
    },
  ];

  const series = [
    {
      name: 'Info',
      data: mappedData.map(d => d.y),
    },
  ];

  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 3,
      curve: 'stepline',
      lineCap: 'butt',
      dashArray: 0,
      colors: ['#000000'],
    },
    colors: ['#000000'],
    xaxis: {
      categories: xLabels || [],
      tickAmount: 23,
      labels: {
        rotate: -90,
        style: {
          colors: [],
          fontSize: '10px',
        },
      },
      position: 'top',
    },
    yaxis: {
      tickAmount: 4, // Ensure 4 ticks to show 0, 1, 2, 3
      min: 0,
      max: 4,
      cssClass: 'apexcharts-custom-class',
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Ensure labels are shown as integers
        },
      },
    },
    grid: {
      show: true, // Show the grid
      borderColor: '#90A4AE',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    annotations: {
      yaxis: (annotations).map(anno => ({
        y: anno.y,
        y2: anno.y2,
        borderColor: anno.borderColor,
        borderWidth: anno.borderWidth,
        fillColor: anno.fillColor,
        opacity: anno.opacity,
      })),
      xaxis: (xAnnotations).map(anno => ({
        x: anno.x,
        x2: anno.x2,
        borderColor: anno.borderColor,
        borderWidth: anno.borderWidth,
        fillColor: anno.fillColor,
        opacity: anno.opacity,
      })),
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
      y: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const xValue = xSeriesData[dataPointIndex] || "";
          const yValue = ySeriesData[dataPointIndex] || "";
          return `Time: ${xValue}, Status: ${yValue}`;
        }
      }
    }

  };

  return (
    <div className={styles.apexChartmain} >
      <div className={`${styles.container1}`} style={{ position: 'relative', width: '100%', height: '100%' }}  >
        <div className={`${styles.backgroundDiv}`}
          style={{
            position: 'absolute',
            top: 0,
            left: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: 1,
          }}
        >
          <GraphChart className={styles.section + ' ' + styles.apexCharts} options={options} series={series} type="line" height="100%" width="100%" />
        </div>
        <div className={`${styles.foregroundHead}`}>
          <h5>M</h5> <h6>1</h6> <h6>2</h6> <h6>3</h6> <h6>4</h6> <h6>5</h6> <h6>6</h6> <h6>7</h6> <h6>8</h6> <h6>9</h6> <h6>10</h6> <h6>11</h6>
          <h5>N</h5> <h6>1</h6> <h6>2</h6> <h6>3</h6> <h6>4</h6> <h6>5</h6> <h6>6</h6> <h6>7</h6> <h6>8</h6> <h6>9</h6> <h6>10</h6> <h5>N</h5>
        </div>
        <div className={`${styles.foregroundDiv}`}
        >
          <table >
            <tbody>
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <tr key={rowIndex} >
                  {Array.from({ length: 96 }).map((_, colIndex) => {
                    let matchingTruck = colorLineData.find(truck => truck.colNums.includes(colIndex));
                    console.log('Raw Data matchingTruck', JSON.stringify(colorLineData, null, 2));
                    return (
                      <td 
                      className={`${styles.myTable}`}
                      key={colIndex} style={{
                        padding: '0px',
                        position: 'relative',
                       
                      }}>
                        {colIndex % 4 === 3 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '10%',
                            borderLeft: '1px solid grey',
                            borderBottom: matchingTruck && rowIndex === 3 ?
                            `4px solid ${matchingTruck.color}` :
                            '1px solid grey'
                          }}
                          ></div>
                        )}
                        {colIndex % 4 === 2 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '15%',
                            borderLeft: '1px solid grey',
                            borderBottom: matchingTruck && rowIndex === 3 ?
                            `4px solid ${matchingTruck.color}` :
                            '1px solid grey'
                          }}
                          ></div>
                        )}
                        {colIndex % 4 === 1 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '10%',
                            borderLeft: '1px solid grey',
                            borderBottom: matchingTruck && rowIndex === 3 ?
                            `4px solid ${matchingTruck.color}` :
                            '1px solid grey'
                          }}
                          ></div>
                        )}
                        {colIndex % 4 === 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            borderLeft: '1px solid lightgrey',
                            borderBottom: matchingTruck && rowIndex === 3 ?
                            `4px solid ${matchingTruck.color}` :
                            '1px solid grey'
                          }}
                          ></div>
                        )}
                        {colIndex == 95 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            borderRight: '1px solid lightgrey',
                            borderBottom: matchingTruck && rowIndex === 3 ?
                            `4px solid ${matchingTruck.color}` :
                            '1px solid grey'
                          }}
                          ></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const generateColumnColors = (overtime) => {
  const totalColumns = 96;
  const colors = Array(totalColumns).fill('transparent');
  overtime.forEach(index => {
    if (index < totalColumns) {
      colors[index] = '#f1a3a8'; // Red color for overtime
    }
  });
  return colors;
};

function yProcessData(data) {
  const valueMap = {
    1: 0.5, // 1 or ON
    'ON': 0.5,
    2: 1.5, // 2 or D
    'D': 1.5,
    3: 2.5, // 3 or SB
    'SB': 2.5,
    4: 3.5, // 4 or Off
    'Off': 3.5
  };
  return valueMap[data] !== undefined ? valueMap[data] : null;
}
// Function to round minutes to the nearest 15-minute interval
const roundToNearest15 = (minutes) => Math.round(minutes / 15) * 15;

// Maximum allowed time in minutes (23:45)
const MAX_TIME = 23 * 60 + 45;

// Function to adjust time values to the nearest 15-minute interval and ensure max time is 23:45
const adjustxData = (times) => {
  return times.map(time => {
    // Check if time is valid before processing
    if (!time || !time.includes(":")) {
      console.error("Invalid time value:", time);
      return ""; // Return an empty string or some default value if time is invalid
    }

    // Split hours and minutes
    let [hours, mins] = time.split(":").map(Number);

    // Ensure hours and minutes are valid numbers
    if (isNaN(hours) || isNaN(mins)) {
      console.error("Invalid time format, could not parse hours/minutes:", time);
      return ""; // Return an empty string or default value
    }

    // Convert to total minutes
    let totalMinutes = hours * 60 + mins;

    // Round to nearest 15 minutes
    totalMinutes = roundToNearest15(totalMinutes);

    // Ensure total minutes do not exceed 23:45
    totalMinutes = Math.min(totalMinutes, MAX_TIME);

    // Convert back to hours and minutes
    hours = Math.floor(totalMinutes / 60);
    mins = totalMinutes % 60;

    // Return formatted time with '.' instead of ':'
    return `${hours}.${String(mins).padStart(2, '0')}`;
  });
};

  const timeToMinutes = (time) => {
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const adjustData = (data) => {
    let previousEndTime = 0;
    const MAX_TIME = 23 * 60 + 45; // Maximum allowed time (23:45)

    return data.map((item) => {
      let { stime, etime } = item;
      let stimeInMinutes = timeToMinutes(stime);
      let etimeInMinutes = timeToMinutes(etime);

      stimeInMinutes = Math.max(stimeInMinutes, previousEndTime);
      stimeInMinutes = roundToNearest15(stimeInMinutes);
      etimeInMinutes = roundToNearest15(etimeInMinutes);

      // Ensure end time is not greater than 23:45
      etimeInMinutes = Math.min(Math.max(etimeInMinutes, stimeInMinutes + 15), MAX_TIME);

      previousEndTime = etimeInMinutes;
      return {
        ...item,
        stime: minutesToTime(stimeInMinutes),
        etime: minutesToTime(etimeInMinutes),
      };
    });
  };
  // Adjustment END for 15-minute interval

  //colorline function
function timeToColumn(time) {
  if (!time || typeof time !== 'string') {
    throw new Error(`Invalid time format: ${time}`);
  }
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }
  return (hours * 4) + Math.floor(minutes / 15);
}

export default Chart;

// 'use client';
// import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import { parseISO, format } from 'date-fns';
// import styles from '../../styles/chart.module.css';
// import { data } from 'jquery';

// // Dynamically import the GraphChart component from react-apexcharts with SSR disabled
// const GraphChart = dynamic(() => import('react-apexcharts'), {
//   ssr: false,
//   loading: () => <p>Loading chart...</p>
// });

// function Chart({ processedData, params = null }) {

//   const [datas, setDatas] = useState();
//   //   // Generate xData as cumulative sum of totalTime
//   const xLabels = Array.from({ length: 1440 }, (_, i) => {
//     const hours = String(Math.floor(i / 60)).padStart(2, '0');
//     const minutes = String(i % 60).padStart(2, '0');
//     return `${hours}:${minutes}`;
//   });

//   // const xLabels = Array.from({ length: 1440 / 15 }, (_, i) => {
//   //   const hours = String(Math.floor(i * 15 / 60)).padStart(2, '0');
//   //   const minutes = String(i * 15 % 60).padStart(2, '0');
//   //   return `${hours}:${minutes}`;
//   // });

//   useEffect(() => {
//     if (params && params.params[2]) {
//       setDatas(params.params[2]);
//     }
//   }, [params]);

//   console.log('Data', datas);


//   const xAxis = [];
//   let cumulativeHours = 0;
//   let cumulativeMinutes = 0;

//   processedData.forEach(point => {
//     const [hours, minutes, seconds] = point.totalTime.split('.').map(Number);

//     cumulativeHours += hours;
//     cumulativeMinutes += minutes + Math.floor(seconds / 60);

//     if (cumulativeMinutes >= 60) {
//       cumulativeHours += Math.floor(cumulativeMinutes / 60);
//       cumulativeMinutes = cumulativeMinutes % 60;
//     }

//     const formattedTime = `${cumulativeHours}.${cumulativeMinutes.toString().padStart(2, '0')}`;
//     xAxis.push(formattedTime);
//   });

//   const xData = ["0.00", ...xAxis];

//   const yAxis = processedData.map(point => point.status);
//   const yData = [...yAxis];
//   // console.log('Status  Data', JSON.stringify('fetchingEndStatus   '+ fetchingEndStatus, null, 2));

//   console.log('Graph Data', JSON.stringify('xData   '+ xData + '    YData  '+ yData, null, 2));

//   const mappedData = new Array(xLabels.length).fill(null);
//   xData.forEach((time, index) => {
//     const [hours, minutes] = time.split('.');
//     const formattedTime = `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
//     const i = xLabels.indexOf(formattedTime);
//     if (i !== -1) {
//       mappedData[i] = { x: formattedTime, y: yProcessData(yData[index])};
//     }
//   });

//   for (let i = 1; i < mappedData.length; i++) {
//     if (mappedData[i] === null) {
//       if (mappedData[i - 1] !== null) {
//         mappedData[i] = { x: xLabels[i], y: mappedData[i - 1].y };
//       } else {
//         mappedData[i] = { x: xLabels[i], y: 0 };
//       }
//     }
//   }

//   if (mappedData[0] === null) {
//     mappedData[0] = { x: xLabels[0], y: 0 };
//   }

//   //const filteredData = processedData[0]?.colorLineData || [];
//   const filteredData =  [];
//   const colorLineData = [];

//   filteredData.forEach(entry => {
//     const { stime, etime, color } = entry;

//     if (!stime || !etime || !color) {
//       console.error(`Invalid entry: ${JSON.stringify(entry)}`);
//       return;
//     }

//     try {
//       const startColumn = timeToColumn(stime);
//       const endColumn = timeToColumn(etime);

//       let colorEntry = colorLineData.find(e => e.color === color);
//       if (!colorEntry) {
//         colorEntry = { color, colNums: [] };
//         colorLineData.push(colorEntry);
//       }

//       for (let i = startColumn; i < endColumn; i++) {
//         if (!colorEntry.colNums.includes(i)) {
//           colorEntry.colNums.push(i);
//         }
//       }
//     } catch (error) {
//       console.error(`Error processing entry with stime: ${stime}, etime: ${etime}, color: ${color}`, error.message);
//     }
//   });

//   function formatTime(dateString) {
//     const date = new Date(dateString);
//     const hours = String(date.getUTCHours()).padStart(2, '0');
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     return `${hours}:${minutes}`;
//   }

//   const overtimeRanges = datas && datas['Shift_data']
//     ? datas['Shift_data'].map((shift) => ({
//       start: formatTime(shift['violation_startTime']),
//       end: formatTime(shift['violation_endTime']),
//     }))
//     : [];

//   const sda = [
//     { start: '02:00', end: '07:00' },
//     { start: '09:00', end: '09:50' },
//     { start: '11:00', end: '14:10' }
//   ];

//   console.log('overtime', overtimeRanges, sda);


//   const xAnnotations = overtimeRanges.map(range => ({
//     x: range.start,
//     x2: range.end,
//     fillColor: '#FF4560',
//     opacity: 0.3,
//     borderColor: '#FF4560',
//     borderWidth: 1,
//   }));

//   const annotations = [
//     {
//       y: 0,
//       y2: 1,
//       borderColor: '#fefbe2',
//       borderWidth: 0.5,
//       fillColor: 'yellow',
//       opacity: 0.1,
//     },
//     {
//       y: 1,
//       y2: 2,
//       borderColor: '#ddfeda',
//       borderWidth: 0.5,
//       fillColor: 'green',
//       opacity: 0.1,
//     },
//   ];

//   const series = [
//     {
//       name: '',
//       data: mappedData.map(d => d.y),
//     },
//   ];

//   const options = {
//     chart: {
//       animations: {
//         speed: 100,
//         enabled: false,
//         easing: 'linear',
//       },
//       foreColor: '#333',
//       dropShadow: {
//         enabled: false,
//       },
//       type: 'line',
//       toolbar: {
//         show: false,
//       },
//       dynamicAnimation: {
//         speed: 200,
//       },
//       redrawOnParentResize: false,
//     },
//     tooltip: {
//       enabled: false,
//     },
//     stroke: {
//       width: 3,
//       curve: 'stepline',
//       lineCap: 'butt',
//       dashArray: 0,
//       colors: ['#000000'],
//     },
//     colors: ['#000000'],
//     xaxis: {
//       categories: xLabels,
//       tickAmount: 23,
//       labels: {
//         rotate: -90,
//         style: {
//           colors: [],
//           fontSize: '10px',
//         },
//       },
//       position: 'top',
//     },
//     markers: {
//       size: 0,
//     },
//     yaxis: {
//       tickAmount: 4,
//       min: 0,
//       max: 4,
//       cssClass: 'apexcharts-custom-class',
//       labels: {
//         formatter: function (value) {
//           return value.toFixed(0);
//         },
//       },
//     },
//     grid: {
//       show: false,
//       borderColor: '#90A4AE',
//       strokeDashArray: 0,
//       position: 'back',
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//       yaxis: {
//         lines: {
//           show: false,
//         },
//       },
//     },
//     annotations: {
//       yaxis: annotations.map(anno => ({
//         y: anno.y,
//         y2: anno.y2,
//         borderColor: anno.borderColor,
//         borderWidth: anno.borderWidth,
//         fillColor: anno.fillColor,
//         opacity: anno.opacity,
//       })),
//       xaxis: xAnnotations.map(anno => ({
//         x: anno.x,
//         x2: anno.x2,
//         borderColor: anno.borderColor,
//         borderWidth: anno.borderWidth,
//         fillColor: anno.fillColor,
//         opacity: anno.opacity,
//       })),
//     },
//   };

//   return (
//     <div className={styles.apexChartmain}>
//       <div className={`${styles.container1}`} style={{ position: 'relative', width: '100%', height: '100%' }}  >
//         <div className={`${styles.backgroundDiv}`}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: '0px',
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'transparent',
//             zIndex: 1,
//           }}
//         >
//           <GraphChart className={styles.section + ' ' + styles.apexCharts} options={options} series={series} type="line" height="100%" width="100%" />
//         </div>
//         <div className={`${styles.foregroundHead}`} >
//           <h5>M</h5> <h6>1</h6> <h6>2</h6> <h6>3</h6> <h6>4</h6> <h6>5</h6> <h6>6</h6> <h6>7</h6> <h6>8</h6> <h6>9</h6> <h6>10</h6> <h6>11</h6>
//           <h5>N</h5> <h6>1</h6> <h6>2</h6> <h6>3</h6> <h6>4</h6> <h6>5</h6> <h6>6</h6> <h6>7</h6> <h6>8</h6> <h6>9</h6> <h6>10</h6> <h5>N</h5>
//         </div>
//         <div className={`${styles.foregroundDiv}`}>
//           <table>
//             <tbody>
//               {Array.from({ length: 4 }).map((_, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Array.from({ length: 96 }).map((_, colIndex) => {
//                     const matchingTruck = colorLineData.find(truck => truck.colNums.includes(colIndex));
//                     return (
//                       <td key={colIndex} style={{
//                         padding: '0px',
//                         position: 'relative',
//                         borderBottom: matchingTruck && rowIndex === 3 ?
//                           `10px solid ${matchingTruck.color}` :
//                           '0px',
//                       }}>
//                         {colIndex % 4 === 3 && (
//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '10%',
//                             borderLeft: '1px solid grey',
//                           }}
//                           ></div>
//                         )}
//                         {colIndex % 4 === 2 && (
//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '15%',
//                             borderLeft: '1px solid grey',
//                           }}
//                           ></div>
//                         )}
//                         {colIndex % 4 === 1 && (
//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '10%',
//                             borderLeft: '1px solid grey',
//                           }}
//                           ></div>
//                         )}
//                         {colIndex % 4 === 0 && (
//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '100%',
//                             borderLeft: '1px solid lightgrey',
//                           }}
//                           ></div>
//                         )}
//                         {colIndex == 95 && (
//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '100%',
//                             borderRight: '1px solid lightgrey',
//                           }}
//                           ></div>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// const generateColumnColors = (overtime) => {
//   const totalColumns = 96;
//   const colors = Array(totalColumns).fill('transparent');
//   overtime.forEach(index => {
//     if (index < totalColumns) {
//       colors[index] = '#f1a3a8'; // Red color for overtime
//     }
//   });
//   return colors;
// };

// function yProcessData(data) {
//   const valueMap = {
//     1: 0.5, // 1 or ON
//     'ON': 0.5,
//     2: 1.5, // 2 or D
//     'D': 1.5,
//     3: 2.5, // 3 or SB
//     'SB': 2.5,
//     4: 3.5, // 4 or Off
//     'Off': 3.5
//   };
//   return valueMap[data] !== undefined ? valueMap[data] : null;
// }

// function timeToColumn(time) {
//   if (!time || typeof time !== 'string') {
//     throw new Error(`Invalid time format: ${time}`);
//   }
//   const [hours, minutes] = time.split(':').map(Number);
//   if (isNaN(hours) || isNaN(minutes)) {
//     throw new Error(`Invalid time format: ${time}`);
//   }
//   return (hours * 4) + Math.floor(minutes / 15);
// }

// export default Chart;
