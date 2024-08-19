"use client";
import Link from "next/link";
import "../../_metronic/assets/sass/style.scss";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    async function logout() {
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
            const accessToken = getCookie("token");

            const response = await fetch(`${url}/user/logout`, {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to revoke token");
            }

            const data = await response.json();

            console.log(data.message); // Tokens revoked successfully
        } catch (error) {
            console.error(error);
        }

        function eraseCookie(name) {
            document.cookie = name + "=; Max-Age=-99999999; path=/";
        }

        eraseCookie("token");

        router.push("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" href="/company/dashboard">
                Company
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link" href="/company/add">
                            Add
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <span className="nav-link" onClick={logout}>
                            Logout
                        </span>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
