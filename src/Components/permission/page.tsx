let cache = {};

export async function getPermissions(token = null) {
    const BackEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    if (!token) {
        return null;
    }

    if (cache[token]) {
        return cache[token];
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
        cache[token] = result;
        return result;
    } catch (err) {
        console.error('Error fetching permissions:', err);
        throw err;
    }
}
