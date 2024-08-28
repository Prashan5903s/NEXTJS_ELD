// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import styles from "../../styles/linechart.module.css";
// import Link from "next/link";
// import Chart from './Chart';
// import GraphLabels from './GraphLabels';
// import TimeFields from './TimeFields';
// import Table from './DataTable';
// import { bottom } from '@popperjs/core';

// function LineChart(params = null) {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [val, setVal] = useState([]);

//   ///graph heading
//   const graphHeading = 'Graph heading';

//   useEffect(() => {
//     setVal(params);
//   }, [params])

//   // Helper function to convert a name to a slug
//   const convertToSlug = (name) => {
//     return name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
//       .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
//   };

//   // Helper function to generate a random color
//   const colorNames = [
//      'Pink', 'Violet', 'Magenta', 'Orange', 'Purple', 'Brown',
//     'Gray', 'Black', 'Lime', 'Teal', 'Olive', 'Maroon', 'Navy', 'Silver', 'Gold'
//   ];

//   const generateRandomColorName = () => {
//     const randomIndex = Math.floor(Math.random() * colorNames.length);
//     return colorNames[randomIndex];
//   };


//   // Ensure `val['params'][1]` exists before mapping
//   const mappedData = val['params'] && val['params'][1] ? val['params'][1].map((data, index) => {

//     let colors = colorNames[index];

//     const slug = convertToSlug(data.name);
//     const randomColor = generateRandomColorName();
//     return {
//       [slug]: [{ color: colors, text: data.name }]
//     };
//   }) : [];

//   const data = val['params'] && val['params'][0] ? val['params'][0].map((item) => {
//     // Initialize mapI
//     let mapI = 0; // Default value

//     // Set mapI based on the condition
//     if (item[1] === 1) {
//       mapI = 4;
//     } else if (item[1] === 3) {
//       mapI = 2;
//     } else if (item[1] === 4) {
//       mapI = 1;
//     } else if (item[1] === 2) {
//       mapI = 3;
//     }else if (item[1] === 5) {
//       mapI = 4;
//     }else if (item[1] === 6) {
//       mapI = 1;
//     }

//     // Determine truckDetails based on slug
//     const truckDetails = mappedData ? mappedData.find((data) => data[convertToSlug(item[5])]) : [];

//     // Calculate the time difference
//     const calculateTimeDifference = (startTime, endTime) => {
//       const timeToMinutes = (time) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         return hours * 60 + minutes;
//       };
//       const minutesToTime = (minutes) => {
//         const hours = Math.floor(minutes / 60);
//         const mins = minutes % 60;
//         return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
//       };

//       const startMinutes = timeToMinutes(startTime);
//       const endMinutes = timeToMinutes(endTime);
//       const differenceMinutes = endMinutes - startMinutes;
//       return minutesToTime(differenceMinutes);
//     };

//     // Time difference calculation
//     const timeSl = calculateTimeDifference(item[3], item[4]);

//     // Return the object with the computed status
//     return {
//       status: mapI,
//       stime: item[3],
//       etime: item[4],
//       time: timeSl,
//       truckDetails: [truckDetails[convertToSlug(item[5])][0]],
//     };
//   }) : [];

//   data.push({ status: null, stime: '00:00', etime: '00`:00', time: '', truckDetails: null });

//   data.forEach((entry) => {

//     entry.time = calculateTimeDifference(entry.stime, entry.etime);

//   });
//   const filteredData = data.filter(item => item.status === 1 || item.status === 2);

//   const colorLineData = [];

//   filteredData.forEach(entry => {

//     const stime = entry.stime;
//     const etime = entry.etime;
//     const status = entry.status;
//     const color = entry.truckDetails[0].color;
//     colorLineData.push({
//       stime: stime,
//       etime: etime,
//       status: status,
//       color: color
//     });
//   });

//   const groupDataByTruck = (data) => {
//     const truckMap = new Map();

//     data.forEach((entry) => {

//       if (entry.truckDetails && entry.truckDetails.length > 0) {
//         const truckNumber = entry.truckDetails[0].text;
//         const truckColor = entry.truckDetails[0].color;
//         const truckStatus = entry.status;
//         const hours = parseTime(entry.time) / 60; // Convert minutes to hours
//         if (!truckMap.has(truckNumber)) {
//           truckMap.set(truckNumber, {
//             truckNumber,
//             truckColor,
//             totalHours: 0,
//             statusHours: {},
//           });
//         }
//         const truckData = truckMap.get(truckNumber);
//         truckData.totalHours += hours;
//         truckData.statusHours[truckStatus] = (truckData.statusHours[truckStatus] || 0) + hours;
//       }

//     });

//     return Array.from(truckMap.values());
//   };

//   const transformedData = groupDataByTruck(data);

//   const columns = [
//     { Header: 'Truck Number', accessor: 'truckNumber' },
//     { Header: 'Truck Color', accessor: 'truckColor' },
//     { Header: 'Total Hours', accessor: 'totalHours' },
//     ...[1, 2, 3, 4].map((status) => ({
//       Header: `Hours in Status ${status}`,
//       accessor: (row) => row.statusHours[status] || 0,
//       id: `status${status}`,
//     })),
//   ];


//   //expand div
//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };



//   //calling data transformation methods
//   const processedData = processedRawData(data, transformedData, colorLineData);

//   const timeMap = calculateTime(data);
//   const totalTime = calculateTotalTime(timeMap);


//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (container) {
//       const checkWidth = () => {
//         if (container.offsetWidth >= 100) {
//           container.classList.add(styles.smallWidth);
//         } else {
//           container.classList.remove(styles.smallWidth);
//         }
//       };
//       const width = container.offsetWidth;
//       const height = container.offsetHeight;

//       checkWidth();

//       window.addEventListener('resize', checkWidth);

//       return () => {
//         window.removeEventListener('resize', checkWidth);
//       };

//     }
//   }, []);

//   return (
//     <>
//       {/* <h5>Linechart</h5> */}
//       <div className={`${styles.graphcontainer}`} style={{ display: 'flex', gap: '0', flex: '1' }}>
//         <div ref={containerRef} className={`${styles.graphclass}`} style={{ flex: '1', display: 'flex', gap: '0', padding: '0px 35px 0px 35px', width: '100%', minHeight: '300px' }}>
//           <GraphLabels />
//           <Chart processedData={processedData} params= {val} />
//           <TimeFields timeMap={timeMap} />
//         </div>
//       </div>

//       <div className={`${styles.truckColumn}`} style={{ flex: '1', display: 'flex', gap: '0', padding: '0px 35px 30px 35px', minHeight: '2%', width: '100%' }}>
//         {transformedData.map((detail, index) => (
//           <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '15px', width: '95%' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '30px' }}>
//               <div style={{ width: '10px', height: '10px', backgroundColor: detail.truckColor, margin: '0px 5px 5px 0px' }}></div>
//               <p style={{ margin: '0', textAlign: 'center' }}> {detail.truckNumber}</p>
//             </div>
//           </div>
//         ))}
//         <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right', height: '15px', width: '10%' }}>
//           <div style={{ flex: '1', display: 'flex', justifyContent: 'right', alignItems: 'flex-end', paddingBottom: '28px' }}>
//             <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}>
//               <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-end', paddingBottom: '30px' }}>
//                 <p style={{ margin: '0', textAlign: 'right' }}>{totalTime}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// const processedRawData = (data, transformedData, colorLineData) => {
//   const result = [];
//   data.forEach(item => {
//     const status = item.status;
//     const timeParts = item.time.split(':');
//     const hours = parseInt(timeParts[0], 10);
//     const minutes = parseInt(timeParts[1], 10).toFixed(2);
//     const totalTime = hours + '.' + minutes;
//     parseFloat(totalTime).toFixed(2);
//     const singleTruckDetails = item.truckDetails;
//     //truck map
//     const truckDetails = [];
//     truckDetails.push(transformedData);
//     const colorLine = [];
//     colorLine.push(colorLineData);
//     result.push({ totalTime, status, singleTruckDetails, truckDetails, colorLineData });
//   });
//   return result;
// };

// //Time Calculations on the Right
// function calculateTime(data) {
//   const timeMap = {
//     1: 0, // Total time for status 1
//     2: 0, // Total time for status 2
//     3: 0, // Total time for status 3
//     4: 0, // Total time for status 4
//   };

//   data.forEach(entry => {
//     const { status, time } = entry;
//     const [hours, minutes] = time.split(':').map(Number);
//     const totalMinutes = hours * 60 + (minutes);
//     if (timeMap[status] !== undefined) {
//       timeMap[status] += parseFloat(totalMinutes);
//     }

//   });
//   // Convert total minutes back to hours and minutes format
//   Object.keys(timeMap).forEach(status => {
//     const totalMinutes = timeMap[status];
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;
//     timeMap[status] = `${hours}:${minutes.toString().padStart(2, '0')}:00`;
//   });
//   return timeMap;
// }
// function calculateTotalTime(timeMap) {
//   let totalSeconds = 0;
//   Object.values(timeMap).map(entry => {
//     const [hours, minutes, seconds] = entry.split(':').map(Number);
//     totalSeconds += hours * 3600 + minutes * 60 + seconds;
//   });

//   const totalHours = Math.floor(totalSeconds / 3600);
//   const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
//   const totalSecs = totalSeconds % 60;
//   return `${totalHours}:${totalMinutes < 10 ? '0' + totalMinutes : totalMinutes}:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
// }

// //Time Formats
// const formatTimeH = (hours) => {
//   const h = String(Math.floor(hours)).padStart(2, '0');
//   const m = String(Math.floor((hours * 60) % 60)).padStart(2, '0');
//   const s = String(Math.floor((hours * 3600) % 60)).padStart(2, '0');
//   return `${h}:${m}:${s}`;
// };
// const parseTime = (time) => {
//   const [hours, minutes] = time.split(':').map(Number);
//   return hours * 60 + minutes; // Return the time in minutes
// };

// const formatTimeM = (minutes) => {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${hours}:${mins.toString().padStart(2, '0')}`;
// };

// const calculateTimeDifference = (stime, etime) => {
//   const start = parseTime(stime);
//   const end = parseTime(etime);
//   const difference = end - start;
//   return formatTimeM(difference);
// };

// export default LineChart;


'use client';
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import styles from "../../styles/linechart.module.css";
import Link from "next/link";
import Chart from './Chart';
import GraphLabels from './GraphLabels';
import TimeFields from './TimeFields';
import Table from './DataTable';
import { bottom } from '@popperjs/core';
<<<<<<< HEAD
import LoadingIcons from 'react-loading-icons';
=======
>>>>>>> origin/main

const LazyChart = lazy(() => import('./Chart'));

function LineChart(params = null) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [val, setVal] = useState([]);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
=======
>>>>>>> origin/main
  ///graph heading
  const graphHeading = 'Graph heading';

  useEffect(() => {
    setVal(params);
  }, [params])


  //   // Helper function to convert a name to a slug
  const convertToSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
  };

  // Helper function to generate a random color
  const colorNames = [
    'Pink', 'Violet', 'Magenta', 'Orange', 'Purple', 'Brown',
    'Gray', 'Black', 'Lime', 'Teal', 'Olive', 'Maroon', 'Navy', 'Silver', 'Gold'
  ];

  const generateRandomColorName = () => {
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    return colorNames[randomIndex];
  };


  // Ensure `val['params'][1]` exists before mapping
  const mappedData = val['params'] && val['params'][1] ? val['params'][1].map((data, index) => {

    let colors = colorNames[index];

    const slug = convertToSlug(data.name);
    const randomColor = generateRandomColorName();
    return {
      [slug]: [{ color: colors, text: data.name }]
    };
  }) : [];
<<<<<<< HEAD

=======
>>>>>>> origin/main
  const data = val['params'] && val['params'][0] ? val['params'][0].map((item) => {
    // Initialize mapI
    let mapI = 0; // Default value

    // Set mapI based on the condition
    if (item[1] === 1) {
      mapI = 4;
    } else if (item[1] === 3) {
      mapI = 2;
    } else if (item[1] === 4) {
      mapI = 1;
    } else if (item[1] === 2) {
      mapI = 3;
    } else if (item[1] === 5) {
      mapI = 4;
    } else if (item[1] === 6) {
      mapI = 1;
    }

    // Determine truckDetails based on slug
    const truckDetails = mappedData ? mappedData.find((data) => data[convertToSlug(item[5])]) : [];

    // Calculate the time difference
    const calculateTimeDifference = (startTime, endTime) => {
      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      };

      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      const differenceMinutes = endMinutes - startMinutes;
      return minutesToTime(differenceMinutes);
    };

    // Time difference calculation
    const timeSl = calculateTimeDifference(item[3], item[4]);

    // Return the object with the computed status
    return {
      status: mapI,
      stime: item[3],
      etime: item[4],
      time: timeSl,
      truckDetails: [truckDetails[convertToSlug(item[5])][0]],
    };
  }) : [];

  data.push({ status: null, stime: '00:00', etime: '00`:00', time: '', truckDetails: null });

  // const truckDetails1 = [{ color: 'purple', text: '302' }];
  // const truckDetails2 = [{ color: 'red', text: '303' }];
  // const truckDetails3 = [{ color: 'green', text: '304' }];

<<<<<<< HEAD
  // // // Complete data
  // const datass = [
=======
  // // Complete data
  // const data = [
>>>>>>> origin/main
  //   { status: 1, stime: '0:00', etime: '1:10', time: '', truckDetails: truckDetails2 },
  //   { status: 3, stime: '1:10', etime: '3:15', time: '', truckDetails: truckDetails2 },
  //   { status: 1, stime: '3:15', etime: '3:30', time: '', truckDetails: truckDetails1 },
  //   { status: 1, stime: '3:30', etime: '3:45', time: '', truckDetails: truckDetails1 },
  //   { status: 2, stime: '3:45', etime: '5:30', time: '', truckDetails: truckDetails1 },
  //   { status: 1, stime: '5:30', etime: '6:30', time: '', truckDetails: truckDetails2 },
  //   { status: 2, stime: '6:30', etime: '7:00', time: '', truckDetails: truckDetails3 },
  //   { status: 3, stime: '7:00', etime: '15:00', time: '', truckDetails: truckDetails2 },
  //   { status: 4, stime: '15:00', etime: '16:00', time: '', truckDetails: truckDetails2 },
  //   { status: 3, stime: '16:00', etime: '17:00', time: '', truckDetails: truckDetails2 },
  //   { status: 4, stime: '17:00', etime: '18:00', time: '', truckDetails: truckDetails3 },
  //   { status: 1, stime: '18:00', etime: '20:00', time: '', truckDetails: truckDetails3 },
  //   //we have to send dummy extra entry same as last one. 
  //   //I can write the code to do it automatically, but once you will confirm all the tests  
  //   { status: null, stime: '20:00', etime: '20:00', time: '', truckDetails: truckDetails3 },
  // ];

<<<<<<< HEAD

=======
>>>>>>> origin/main
  data.forEach((entry) => {
    entry.time = calculateTimeDifference(entry.stime, entry.etime);
  });
  const filteredData = data.filter(item => item.status === 1 || item.status === 2);

  const colorLineData = [];

  filteredData.forEach(entry => {

    const stime = entry.stime;
    const etime = entry.etime;
    const status = entry.status;
    const color = entry.truckDetails[0].color;
    colorLineData.push({
      stime: stime,
      etime: etime,
      status: status,
      color: color
    });
  });

  const groupDataByTruck = (data) => {
    const truckMap = new Map();

    data.forEach((entry) => {
      const truckNumber = entry.truckDetails && entry.truckDetails[0].text ? entry?.truckDetails[0]?.text : null;
      const truckColor = entry.truckDetails && entry?.truckDetails[0]?.color;
      const truckStatus = entry.status;
      const hours = parseTime(entry.time) / 60; // Convert minutes to hours

      if (!truckMap.has(truckNumber)) {
        truckMap.set(truckNumber, {
          truckNumber,
          truckColor,
          totalHours: 0,
          statusHours: {},
        });
      }

      const truckData = truckMap.get(truckNumber);
      truckData.totalHours += hours;
      truckData.statusHours[truckStatus] = (truckData.statusHours[truckStatus] || 0) + hours;
    });

    return Array.from(truckMap.values());
  };

  const transformedData = groupDataByTruck(data);

  const columns = [
    { Header: 'Truck Number', accessor: 'truckNumber' },
    { Header: 'Truck Color', accessor: 'truckColor' },
    { Header: 'Total Hours', accessor: 'totalHours' },
    ...[1, 2, 3, 4].map((status) => ({
      Header: `Hours in Status ${status}`,
      accessor: (row) => row.statusHours[status] || 0,
      id: `status${status}`,
    })),
  ];


  //expand div
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };



  //calling data transformation methods
  const processedData = processedRawData(data, transformedData, colorLineData);

  const timeMap = calculateTime(data);
  const totalTime = calculateTotalTime(timeMap);


  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const checkWidth = () => {
        if (container.offsetWidth >= 100) {
          container.classList.add(styles.smallWidth);
        } else {
          container.classList.remove(styles.smallWidth);
        }
      };
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      checkWidth();

      window.addEventListener('resize', checkWidth);

      return () => {
        window.removeEventListener('resize', checkWidth);
      };

    }
  }, []);


  return (
    <div className={`${styles.linechartContainer}`}>
      {/* <h5>Linechart</h5> */}
      <div className={`${styles.graphcontainer}`} style={{ display: 'flex', gap: '0', flex: '1' }}>
        <div ref={containerRef} className={`${styles.graphclass}`} style={{}}>
          <GraphLabels />
          {/* <Chart processedData={processedData} /> */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <LazyChart processedData={processedData} params={params} />
          </Suspense>
          <TimeFields timeMap={timeMap} />
        </div>
      </div>

      <div className={`${styles.truckColumn}`} style={{ flex: '1', display: 'flex', gap: '0', padding: '0px 20px 30px 30px', minHeight: '2%', width: '100%' }}>
        {transformedData.map((detail, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '15px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '30px' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: detail.truckColor, margin: '0px 5px 5px 0px' }}></div>
              <p style={{ margin: '0', textAlign: 'center' }}> {detail.truckNumber}</p>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right', height: '15px', width: '15%' }}>
          <div style={{ flex: '1', display: 'flex', justifyContent: 'right', alignItems: 'flex-end', paddingBottom: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-end', paddingBottom: '30px' }}>
                <p style={{ margin: '0', textAlign: 'right' }}>{totalTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

=======
      
>>>>>>> origin/main
    </div>
  );
}
const processedRawData = (data, transformedData, colorLineData) => {
  const result = [];
  data.forEach(item => {
    const status = item.status;
    const timeParts = item.time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10).toFixed(2);
    const totalTime = hours + '.' + minutes;
    parseFloat(totalTime).toFixed(2);
    const singleTruckDetails = item.truckDetails;
    //truck map
    const truckDetails = [];
    truckDetails.push(transformedData);
    const colorLine = [];
    colorLine.push(colorLineData);
    result.push({ totalTime, status, singleTruckDetails, truckDetails, colorLineData });
  });
  return result;
};

//Time Calculations on the Right
function calculateTime(data) {
  const timeMap = {
    1: 0, // Total time for status 1
    2: 0, // Total time for status 2
    3: 0, // Total time for status 3
    4: 0, // Total time for status 4
  };

  data.forEach(entry => {
    const { status, time } = entry;
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + (minutes);
    if (timeMap[status] !== undefined) {
      timeMap[status] += parseFloat(totalMinutes);
    }

  });
  // Convert total minutes back to hours and minutes format
  Object.keys(timeMap).forEach(status => {
    const totalMinutes = timeMap[status];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    timeMap[status] = `${hours}:${minutes.toString().padStart(2, '0')}:00`;
  });
  return timeMap;
}
function calculateTotalTime(timeMap) {
  let totalSeconds = 0;
  Object.values(timeMap).map(entry => {
    const [hours, minutes, seconds] = entry.split(':').map(Number);
    totalSeconds += hours * 3600 + minutes * 60 + seconds;
  });

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecs = totalSeconds % 60;
  return `${totalHours}:${totalMinutes < 10 ? '0' + totalMinutes : totalMinutes}:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
}

//Time Formats
const formatTimeH = (hours) => {
  const h = String(Math.floor(hours)).padStart(2, '0');
  const m = String(Math.floor((hours * 60) % 60)).padStart(2, '0');
  const s = String(Math.floor((hours * 3600) % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes; // Return the time in minutes
};

const formatTimeM = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

const calculateTimeDifference = (stime, etime) => {
  const start = parseTime(stime);
  const end = parseTime(etime);
  const difference = end - start;
  return formatTimeM(difference);
};

export default LineChart;
