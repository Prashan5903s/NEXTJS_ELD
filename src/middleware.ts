import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_API_URL is not defined in environment variables"
  );
}



export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  const splittedPathname = pathname.split("/");

  // Check if there are enough segments to extract id
  const id = splittedPathname.length >= 5 ? splittedPathname[4] : undefined;
  const ids = splittedPathname.length >= 4 ? splittedPathname[3] : undefined;

  if (typeof window !== 'undefined') {
    return null;
  }

  if (typeof document !== 'undefined') {
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

  if (!token && (isECRequestPage || isTRRequestPage)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  

  if (token && typeof token === "string") {
    try {
      const response = await fetch(`${BACKEND_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user_type = data.user_type;

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
      } else {
        console.error("Failed to fetch user data:", response.statusText);
        // Handle the error based on the response status if needed
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
      // Handle the error gracefully, maybe redirect to an error page or retry the request
    }
  }

  if (isDList || isDAdd || isDEdit || isDDetail || isHList || isUserList || isVList || isvAssignList || isDActivity || isDAList || isLList || isVAList || isVAAList || isVAEList || isDEList) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/transport/permission`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      const result = await response.json();
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

      if (!isVAAList && isVAEList && !result.includes(28)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (isDActivity && !result.includes(32)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (isADList && !result.includes(33)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (!isADList && isDEList && !result.includes(34)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }


      // Check edit detail permissions
      if (isDEdit || isDDetail || isHList) {
        const editDetailResponse = await fetch(
          `${BACKEND_API_URL}/driver/edit/check/${id}`,
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

  if (!isUAdd) {
    if (isUList) {
      const editRoleResponse = await fetch(
        `${BACKEND_API_URL}/check/roles/${id}`,
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
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|next.svg|vercel.svg).*)",
  ],
};
