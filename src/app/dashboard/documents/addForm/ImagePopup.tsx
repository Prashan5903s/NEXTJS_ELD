import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ImagePopupModal = ({ id, close, open, imageSrc }) => {
    

    return (
        <div className={`modal ${open ? 'showpopup' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered w-100 mw-650px">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="fw-bold">Image</h2>
                        <div className="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                            <i onClick={() => close(false)} className="ki ki-outline ki-cross fs-1"></i>
                        </div>
                    </div>
                    <div className="modal-body mx-5 mx-xl-15 my-7">
                        <img src={imageSrc} style={{objectFit: "contain"}} alt="document-image" height={780} width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePopupModal;
