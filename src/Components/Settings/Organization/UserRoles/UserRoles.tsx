'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import addrole from '../../../../../public/media/auth/add-role.png';
import styles from './UserRole.module.css';

interface Permission {
  id: number;
  label: string;
}

interface Role {
  id: number;
  title: string;
  master: number;
  totalUsers: number;
  permissions: Permission[];
}

export default function UserRolesComponent(): JSX.Element {

  const [role, setRole] = useState<Role[]>([]); // Initialize role as an empty array
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function getCookie(name: string): string | null {
    if (typeof window === "undefined") {
      // We're on the server side, so we can't access cookies
      return null;
    }

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
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  useEffect(() => {

    const fetchRoles = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          console.error("No token available");
          return;
        }

        const response = await axios.get(
          `${url}/setting/organization/user-roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRole(response.data.roles);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchRoles();

  }, [token, url]);

  const rolesData: Role[] = role?.map((data) => ({
    id: data.id || 1, // Assuming `data.id` exists, otherwise defaulting to 1
    title: data['name'] || '',
    totalUsers: data['users']?.length || 0, // Ensure `data['users']` exists before checking `length`
    master: data['master_id'],
    permissions: data['permissions']?.map((permission) => ({
      id: permission['id'] || 1, // Assuming `permission.id` exists, otherwise defaulting to 1
      label: permission['name'] || '', // Assuming `permission.label` exists, otherwise defaulting to an empty string
    })) || [], // In case `data['permissions']` is undefined, default to an empty array
  })) || []; // In case `role` is undefined, default to an empty array

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar pt-6 pb-2 mb-2">
        <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex align-items-stretch">
          <div className="app-toolbar-wrapper d-flex flex-stack flex-wrap gap-4 w-100">
            <div className="page-title d-flex flex-column justify-content-center gap-1 me-3">
              <h1 className="page-heading d-flex flex-column justify-content-center text-gray-900 fw-bold fs-3 m-0"> User & Roles</h1>
              <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                <li className="breadcrumb-item text-muted">
                  <Link href="/dashboard" className="text-muted text-hover-primary">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-500 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted text-muted text-hover-primary" role="button">User & Roles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container container-fluid">
          <div className="row">
            {rolesData.map((role, index) => {
              const displayedPermissions = role.permissions.slice(0, 5);
              const additionalPermissionsCount = role.permissions.length - 5;

              return (
                <div key={index} className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-md-4 mb-sm-4 mb-lg-4 mb-xl-0 mt-4">
                  <div className="card card-flush h-md-100 shadow-sm">
                    <div className="card-header">
                      <div className="card-title">
                        <h2>{role.title}</h2>
                      </div>
                    </div>
                    <div className="card-body pt-1">
                      <div className="fw-bold text-gray-600 mb-5">
                        Total users with this role: {role.totalUsers}
                      </div>
                      <div className="d-flex flex-column text-gray-600">
                        {displayedPermissions.map((perm) => (
                          <div key={perm.id} className="d-flex align-items-center py-2">
                            <span className="bullet bg-primary me-3"></span>
                            {perm.label}
                          </div>
                        ))}
                        {additionalPermissionsCount > 0 && (
                          <div className="d-flex align-items-center py-2">
                            <span className="bullet bg-primary me-3"></span>
                            <em>and {additionalPermissionsCount} more...</em>
                          </div>
                        )}
                      </div>
                      {
                        role.master !== 0 && (
                          <div className="pt-1 d-flex justify-content-start">
                            <Link href={`/settings/organization/user-roles/${role.id}`} className={`${styles.hoverbutton} mt-4 py-3 px-5 fw-bold`}>Edit
                              Role</Link>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-md-4 mb-sm-4 mb-lg-4 mb-xl-0 mt-4">
              <div className="card card-flush h-md-100 shadow-sm">
                <div className="card-body d-flex flex-center">
                  <Link href="/settings/organization/user-roles/add-role" className="btn btn-clear d-flex flex-column flex-center">
                    <Image
                      src={addrole}
                      alt="Add New Role"
                      className="mw-100 mh-150px mb-7"
                      width={150}
                      height={150}
                    />
                    <div className="fw-bold fs-3 text-gray-600 text-hover-primary">
                      Add New Role
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
