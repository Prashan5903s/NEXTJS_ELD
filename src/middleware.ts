import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { ur } from "@faker-js/faker";
import { url } from "inspector";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined in environment variables");
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {

    const nextAuthToken = request.nextauth.token;

    const token = nextAuthToken?.token;
    const user_type = nextAuthToken?.user_type;


    // const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;
    const splittedPathname = pathname.split("/");


    // Check if there are enough segments to extract id
    const id = splittedPathname.length >= 5 ? splittedPathname[4] : undefined;
    const ids = splittedPathname.length >= 4 ? splittedPathname[3] : undefined;

    if (typeof window === undefined) {
      return null;
    }

    if (typeof document === undefined) {
      return null;
    }

    const dlist = ["/dashboard/drivers"];
    const llist = ['/dashboard/locations'];
    const hlist = [`/dashboard/drivers/detail/${id}/hoursOfService`];
    const ddriver = [`/dashboard/drivers/detail/${id}`];
    const dadd = ["/dashboard/drivers/driver-add"];
    const uadd = ["/settings/organization/user-roles/add-role"];
    const dedit = [`/dashboard/drivers/edit/${id}`];
    const ulist = [`/settings/organization/user-roles/${id}`];
    const vList = ['/dashboard/vehicles'];
    const userList = ["/settings/organization/user-roles"];
    const vAssignList = ['/settings/organization/vehicle-assign'];
    const dActivityList = ["/settings/organization/driver-activity"];
    const vAList = ['/settings/organization/vehicle-assign'];
    const vAAList = ['/settings/organization/vehicle-assign/add-assign'];
    const vAEList = [`/settings/organization/vehicle-assign/${id}`];
    const dAList = ['/settings/device'];
    const aDList = ['/settings/device/device-add'];
    const dEList = [`/settings/device/${ids}`];

    const TrPage = [
      "/dashboard",
      "/dashboard/drivers",
      "/dashboard/drivers/driver-add",
      `/dashboard/drivers/edit/${id}`,
      `/dashboard/drivers/detail/${id}`,
      `/dashboard/drivers/detail/${id}/hoursOfService`,
      "/settings/organization/user-roles",
      `/settings/organization/user-roles/${id}`,
      "/settings/organization/user-roles/add-role",
      "/settings/organization/driver-activity",
      '/settings/organization/driver-activity/add-activity',
      `/settings/organization/driver-activity/${id}`,
      '/settings/device',
      `/settings/device/${ids}`,
      '/settings/device/device-add',
      '/settings/organization/vehicle-assign',
      `/settings/organization/vehicle-assign/${id}`,
      '/settings/organization/vehicle-assign/add-assign',
      '/dashboard/vehicles',
      '/dashboard/locations',
      '/settings/organization/driver-activity',
      '/dashboard/documents'
    ];

    const EcPage = ["/company/page", "/company/add", `/company/edit/${id}`];

    const GuestPage = ["/", "/Auth/ResetPassword", "/Auth/changePassword"];

    const isRequestedRouteIsGuestRoute = GuestPage.includes(pathname);
    const isTRRequestPage = TrPage.some((route) => pathname.startsWith(route));
    const isECRequestPage = EcPage.some((route) => pathname.startsWith(route));
    const isDList = dlist.includes(pathname);
    const isDAdd = dadd.includes(pathname);
    const isDEdit = dedit.includes(pathname);
    const isDDetail = ddriver.includes(pathname);
    const isHList = hlist.includes(pathname);
    const isUList = ulist.includes(pathname);
    const isUAdd = uadd.includes(pathname);
    const isVList = vList.includes(pathname);
    const isUserList = userList.includes(pathname);
    const isvAssignList = vAssignList.includes(pathname);
    const isDActivity = dActivityList.includes(pathname);
    const isDAList = dAList.includes(pathname);
    const isLList = llist.includes(pathname);
    const isVAList = vAList.includes(pathname);
    const isVAAList = vAAList.includes(pathname);
    const isVAEList = vAEList.includes(pathname);
    const isDEList = dEList.includes(pathname);
    const isADList = aDList.includes(pathname);

    if (token == 'undefined' && (isECRequestPage || isTRRequestPage)) {
      return NextResponse.redirect(new URL("/", request.url));
    }


    if (!token && (isECRequestPage || isTRRequestPage)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && isRequestedRouteIsGuestRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token && user_type == 'EC' && isTRRequestPage) {
      return NextResponse.redirect(new URL("/company/page", request.url));
    }

    if (token && user_type == 'TR' && isECRequestPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    let cachedUserData = null;
    let lastFetchTime = 0;
    const CACHE_DURATION = 300000; // Cache user data for 5 minutes
    const RETRY_LIMIT = 3;
    const RETRY_DELAY = 1000; // Start with a 1 second delay

    async function fetchUserData(token, retryCount = 0) {
      // Use cache if the cache duration has not expired
      if (cachedUserData && Date.now() - lastFetchTime < CACHE_DURATION) {
        return cachedUserData;
      }

      try {
        const response = await fetch(`${BACKEND_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          cachedUserData = data; // Cache the data
          lastFetchTime = Date.now();
          return data;
        } else {
          console.error("Failed to fetch user data:", response.statusText);
          // Retry mechanism with exponential backoff
          if (retryCount < RETRY_LIMIT) {
            const delay = RETRY_DELAY * Math.pow(2, retryCount);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchUserData(token, retryCount + 1);
          } else {
            // Handle non-retryable errors
            console.error("Maximum retry limit reached.");
          }
        }
      } catch (error) {
        console.error("Error during fetch:", error.message);
        // Retry mechanism with exponential backoff
        if (retryCount < RETRY_LIMIT) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchUserData(token, retryCount + 1);
        } else {
          // Handle non-retryable errors
          console.error("Maximum retry limit reached.");
        }
      }

      return null; // Return null if the request fails after retries
    }

    async function handleUserRedirect(token, request) {
      if (token && typeof token === "string") {
        const data = await fetchUserData(token);

        if (data) {

          if (isRequestedRouteIsGuestRoute) {
            if (user_type === "EC") {
              return NextResponse.redirect(new URL("/company/page", request.url));
            } else if (user_type === "TR") {
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }
          }

          if (user_type === "EC" && !isECRequestPage) {
            return NextResponse.redirect(new URL("/company/page", request.url));
          }

          if (user_type === "TR" && !isTRRequestPage) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
      }
    }

    let permissionCache = null;
    let cacheTimestamp = 0;

    // Cache timeout of 10 minutes (600,000 milliseconds)
    const CACHE_TIMEOUT = 600000;
    const BACKEND_API_URLS = BACKEND_API_URL; // Replace with your backend URL

    // Function to fetch with retry mechanism for handling 429 Too Many Requests error
    const fetchWithRetry = async (url, options, retries = 5, delay = 1000) => {
      try {
        const response = await fetch(url, options);

        if (response.status === 429 && retries > 0) {
          // Too Many Requests: Wait for a delay, then retry
          let retryAfter = response.headers.get("Retry-After") || delay;

          // Ensure retryAfter is a number (if it's a string, convert to number)
          retryAfter = Number(retryAfter) * 1000 || delay; // Retry-After is often in seconds, so multiply by 1000

          await new Promise((resolve) => setTimeout(resolve, retryAfter));
          return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
        }

        return response;
      } catch (err) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2); // Retry with exponential backoff
        }
        throw err;
      }
    };

    const checkPermissions = async (token, request, id, flags) => {
      const {
        isDList,
        isDAdd,
        isDEdit,
        isDDetail,
        isHList,
        isUserList,
        isVList,
        isvAssignList,
        isDActivity,
        isDAList,
        isLList,
        isVAList,
        isVAAList,
        isVAEList,
        isDEList,
        isADList,
      } = flags;

      if (
        isDList ||
        isDAdd ||
        isDEdit ||
        isDDetail ||
        isHList ||
        isUserList ||
        isVList ||
        isvAssignList ||
        isDActivity ||
        isDAList ||
        isLList ||
        isVAList ||
        isVAAList ||
        isVAEList ||
        isDEList
      ) {
        try {
          const currentTime = Date.now();

          // Use cached permissions if available and within cache timeout
          if (permissionCache && currentTime - cacheTimestamp < CACHE_TIMEOUT) {
            var result = permissionCache;
          } else {
            // Fetch all permissions if cache is stale or unavailable
            const response = await fetchWithRetry(`${BACKEND_API_URLS}/transport/permission`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            result = await response.json();
            permissionCache = result; // Cache permissions
            cacheTimestamp = currentTime; // Update cache timestamp
          }

          // Check permissions explicitly
          if (isDList && !result.includes(12)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDAdd && !result.includes(10)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDEdit && !result.includes(11)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDDetail && !result.includes(36)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isHList && !result.includes(37)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isUserList && !result.includes(26)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isVList && !result.includes(3)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isvAssignList && !result.includes(29)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDAList && !result.includes(35)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isLList && !result.includes(6)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isVAList && !result.includes(29)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isVAAList && !result.includes(27)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isVAEList && !result.includes(28)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDActivity && !result.includes(32)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isADList && !result.includes(33)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (isDEList && !result.includes(34)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }

          // Check edit detail permissions if necessary
          if (isDEdit || isDDetail || isHList) {
            const editDetailResponse = await fetchWithRetry(
              `${BACKEND_API_URLS}/driver/edit/check/${id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!editDetailResponse.ok) {
              console.log("Error fetching edit detail permissions");
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }

            const editDetailResult = await editDetailResponse.json();

            if (!editDetailResult) {
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }
          }
        } catch (err) {
          console.error("Error fetching permissions:", err);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    };

    if (!isUAdd) {
      if (isUList) {
        const editRoleResponse = await fetch(
          `${BACKEND_API_URLS}/check/roles/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!editRoleResponse.ok) {
          console.log("Error fetching edit role permissions");
          return NextResponse.redirect(
            new URL("/settings/organization/user-roles", request.url)
          );
        }

        const editRoleResult = await editRoleResponse.json();

        if (!editRoleResult) {
          return NextResponse.redirect(
            new URL("/settings/organization/user-roles", request.url)
          );
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        return true
      }
    }
  }

)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|media|next.svg|vercel.svg).*)",
  ],
};