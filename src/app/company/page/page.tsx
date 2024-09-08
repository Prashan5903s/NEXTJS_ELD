"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../header";
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const front_url = process.env.NEXT_PUBLIC_FRONTEND_API_URL;

    // console.log('Url', front_url);
    

    useEffect(() => {

        const fetchUsers = async () => {
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

                const response = await axios.get(
                    `${url}/company/user/index`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [url]);

    return (
        <>
            <Header />
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link href={`${front_url}/company/edit/${user.id}`}>Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
