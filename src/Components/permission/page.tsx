'use client'
import { useCallback } from "react";
import { debounce } from 'lodash';

// File: /lib/getPermissions.js

export async function getPermissions(token = null) {
    const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    

    if (!token) {
        return null;
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