import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

<<<<<<< HEAD
const ToggleSwitch = ({ status, vehicleId, updateVehiclesList }) => {
=======
const ToggleSwitch = ({status, vehicleId, updateVehiclesList}) => {
>>>>>>> origin/main

    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    function getCookie(name) {

        const nameEQ = name + "=";

        const ca = document.cookie.split(";");

        for (let i = 0; i < ca.length; i++) {

            let c = ca[i];

            while (c.charAt(0) === " ") c = c.substring(1, c.length);

            if (c.indexOf(nameEQ) === 0)

                return c.substring(nameEQ.length, c.length);

        }

        return null;

    }

    const token = getCookie("token");

    const handleToggle = async (e) => {
        e.preventDefault();
        const toggle = e.target;
        // Select parent row
        const parent = e.target.closest('tr');

        // Get package name
        const vehicleName = parent.querySelectorAll('td')[0].innerText;

<<<<<<< HEAD
        if (toggle.checked) {
=======
        if(toggle.checked){
>>>>>>> origin/main
            Swal.fire({
                text: "Are you sure you want to Activate " + vehicleName + "?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, Activate!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(async function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "Activating " + vehicleName,
                        icon: "info",
                        buttonsStyling: false,
                        showConfirmButton: false,
                        timer: 2000
                    }).then(async function () {
                        try {
                            // Make API call to delete the vehicle
                            const response = await axios.delete(`${url}/transport/vehicle/${vehicleId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            if (response.status === 200) {
                                Swal.fire({
                                    text: "You have activated the " + vehicleName + "!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function (t) {
                                    // Call the updateVehiclesList function if it's defined
                                    if (typeof updateVehiclesList === 'function') {
                                        updateVehiclesList();
                                    }
                                    toggle.checked = !toggle.checked;
                                    console.log('Vehicle status changed successfully!');
                                });
                            } else {
                                Swal.fire({
                                    text: vehicleName + " was not activated.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function (t) {
                                    console.error('Failed to change vehicle status');
                                });
                            }
                        } catch (error) {
                            console.error('API error:', error);
                            Swal.fire({
                                text: vehicleName + " was not activated.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        text: vehicleName + " was not activated.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
<<<<<<< HEAD
        } else {
            Swal.fire({
                text: "Are you sure you want to Deactivate " + vehicleName + "?",
=======
        }else{
            Swal.fire({
                text: "Are you sure you want to Deactivate "+vehicleName+"?",
>>>>>>> origin/main
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, Deactivate!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(async function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "Deactivating " + vehicleName,
                        icon: "info",
                        buttonsStyling: false,
                        showConfirmButton: false,
                        timer: 2000
                    }).then(async function () {
                        try {
                            // Make API call to delete the vehicle
                            const response = await axios.delete(`${url}/transport/vehicle/${vehicleId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            if (response.status === 200) {
                                Swal.fire({
                                    text: "You have deactivated the " + vehicleName + "!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function (t) {
                                    // Call the updateVehiclesList function if it's defined
                                    if (typeof updateVehiclesList === 'function') {
                                        updateVehiclesList();
                                    }
                                    toggle.checked = !toggle.checked;
                                    console.log('Vehicle status changed successfully!');
                                });
                            } else {
                                Swal.fire({
                                    text: vehicleName + " was not deactivated.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function (t) {
                                    console.error('Failed to change vehicle status');
                                });
                            }
                        } catch (error) {
                            console.error('API error:', error);
                            Swal.fire({
                                text: vehicleName + " was not deactivated.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        text: vehicleName + " was not deactivated.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        }



        // try {
        //     // Make API call to delete the vehicle
        //     const response = await axios.delete(`${url}/transport/vehicle/${vehicleId}`, {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //         },
        //     });
        //     if (response.status === 200) {
        //         updateVehiclesList();
        //         console.log('Vehicle status changed successfully!');
        //     } else {
        //         console.error('Failed to change vehicle status');
        //     }
        // } catch (error) {
        //     console.error('API error:', error);
        // }
    };

    return (
        <label className="form-switch form-check-solid">
            <input
                type="checkbox"
                className="form-check-input border"
                defaultChecked={status}  // Set default check status; change as needed
                onClick={handleToggle}
            />
        </label>
    );
};

export default ToggleSwitch;
