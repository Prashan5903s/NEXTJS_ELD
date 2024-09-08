"use client";
import { useEffect, useState } from "react";
import Form from "@/Components/edit/form";
import Link from "next/link";
import axios from "axios";
import Header from "../../header";
import { useRouter, useParams } from "next/navigation"; // Fix import

export default function Page() {
    const [authenticated, setAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const { id } = useParams();
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const fetchData = async () => {
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
            try {
                const token = getCookie("token");

                if (!token) {
                    router.push("/");
                    return;
                }

                const response = await axios.get(
                    `${url}/user/edit/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data) {
                    setAuthenticated(true);
                    setUserData(response.data);
                    if (response.data.user_type === "TR") {
                        router.push("/dashboard");
                    }
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push("/");
            }
        };

        fetchData();
    }, [router, id, url]);

    if (!authenticated) {
        return null;
    }

    const editClick = (formData) => {
        alert("hi");
        console.log(formData); // Log the form data
    };

    return (
        <>
            <Header />
            <Form userData={userData} subCl={editClick} />
        </>
    );
}

