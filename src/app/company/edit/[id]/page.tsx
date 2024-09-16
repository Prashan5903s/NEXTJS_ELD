"use client";
import { useState } from "react";
import Form from "@/Components/edit/form";
import Header from "../../header";
import { useRouter, useParams } from "next/navigation"; // Fix import

export default function Page() {
    const [authenticated, setAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const { id } = useParams();
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    // interface User {
    //     token: string;
    //     // Add other properties you expect in the user object
    // }

    // interface SessionData {
    //     user?: User;
    //     // Add other properties you expect in the session data
    // }

    // const { data } = useSession() as { data?: SessionData };
    // const token = data?.user?.token;

    // useEffect(() => {
    //     const fetchData = async () => {

    //         try {

    //             if (!token) {
    //                 router.push("/");
    //                 return;
    //             }

    //             const response = await axios.get(
    //                 `${url}/user/edit/${id}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //             if (response.data) {
    //                 setAuthenticated(true);
    //                 setUserData(response.data);
    //                 if (response.data.user_type === "TR") {
    //                     router.push("/dashboard");
    //                 }
    //             } else {
    //                 router.push("/");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //             router.push("/");
    //         }
    //     };

    //     if (token) {
    //         fetchData();
    //     }

    // }, [router, id, url, token]);

    // if (!authenticated) {
    //     return null;
    // }

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

