export async function getCookie() {
    var name = 'token';
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return null;
    }
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}