"use client";
import { useEffect, useState } from "react";
import Form from "@/Components/add/form";
import Header from "../header";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
    const [authenticated, setAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const callLaravelAPI = (token) => {
        axios
            .get(`${url}/user/company/add`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Response from Laravel API:", response.data);
                setUserData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error calling Laravel API:", error);
            });
    };

    const addClick = (formData) => {

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
                .post(`${url}/user/add/post`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        router.push("/company/dashboard");
                        console.log("Saved successfully");
                    } else {
                        console.error("Failed to save:", response.data);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error.response.data);
                });
        } else {
            console.error("Token not found in localStorage.");
        }
    };

    return (
        <>
            <Header />
            {!authenticated || loading ? null : (
                <Form userData={userData} subCl={addClick} />
            )}
        </>
    );
}
