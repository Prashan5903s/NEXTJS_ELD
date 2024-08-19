'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function () {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

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

}