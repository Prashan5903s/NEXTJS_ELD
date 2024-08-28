'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddVehicleModal = ({close,open}) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {

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

        if (token) {
          axios
          .get(`${url}/user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setAuthenticated(true);
              if (response.data.user_type === "TR") {
              } else if (response.data.user_type === "EC") {
                router.replace("/company/dashboard");
              } else {
                console.error("Invalid user type");
                router.replace("/");
              }
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              router.replace("/");
            });
        } else {
          router.replace("/");
        }
      }, []);
    return (
        <div className={`modal ${open==true ? 'showpopup':''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="fw-bold">Add a Vehicle</h2>
                        <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                            <i onClick={()=> close(false)} className="ki ki-outline ki-cross fs-1"></i>
                        </div>
                    </div>
                    <div className="modal-body  mx-5 mx-xl-15 my-7">
                        <form id="kt_modal_add_vehicle_form" className="form fv-plugins-bootstrap5 fv-plugins-framework">
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">Name</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a name" name="name" />
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">VIN</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a VIN" name="vin" />
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">Serial</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a Serial" name="serial" />
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">Make</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a Make" name="make" />
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">Model</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a Model" name="model" />
                            </div>
                            <div className="fv-row mb-7 fv-plugins-icon-container">
                            <label className="fs-6 fw-semibold form-label mb-2">
                                <span className="required">Year</span>
                                <span className="ms-2" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-html="true" data-bs-content="Year is required." data-kt-initialized="1">
                                <i className="ki ki-outline ki-information fs-7"></i>
                                </span>
                            </label>
                            <select className="form-select form-select-solid" name="year" aria-label="Select year">
                                <option value="">Select an option</option>
                                {Array.from({ length: (2024 - 1990 + 1) }, (_, i) => 1990 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="fv-plugins-message-container"></div>
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span>Harsh Acceleration Setting Type</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a harsh acceleration setting type" name="harsh_acceleration_setting_type" />
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span>Notes</span>
                                </label>
                                <textarea className="form-control form-control-solid" placeholder="Enter notes here" name="notes" rows="3"></textarea>
                            </div>
                            <div className="fv-row mb-7">
                                <label className="fs-6 fw-semibold form-label mb-2">
                                    <span className="required">License Plate</span>
                                </label>
                                <input className="form-control form-control-solid" placeholder="Enter a license plate" name="license_plate" />
                            </div>
                            <div className="form-btn-grp w-100 text-center pt-15">
                                <button type="reset" className=" btn-light me-3" data-bs-dismiss="modal">Discard</button>
                                <button type="submit" className=" btn-primary">
                                    <span className="indicator-label">Submit</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVehicleModal;
