'use client'
import { useCallback } from "react";
import { debounce } from 'lodash';

// File: /lib/getPermissions.js

export async function getPermissions() {
    const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    function getCookie(name) {
        if (typeof document === 'undefined') return null; // Ensure this runs only on the client side

        const nameEQ = name + "=";
        const ca = document.cookie.split(";");

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
    }

    const token = getCookie("token");

    if (!token) {
        throw new Error("Token not found in cookies");
    }

    try {
        const response = await fetch(`${BackEND}/transport/permission`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching permissions:', err);
        throw err;
    }
}