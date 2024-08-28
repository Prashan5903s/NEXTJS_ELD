"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";
<<<<<<< HEAD
import { redirect, useRouter } from "next/navigation";
=======
>>>>>>> origin/main
import { debounce } from 'lodash';
import { getPermissions } from "@/Components/permission/page";

const Sidebar = ({ isCollapsed, mouseEnter, mouseLeave, setSidebarToggle }) => {
    const [parentId, setParentId] = useState("");
    const [subItemId, setSubItemId] = useState("");
    const [subChildItemId, setSubChildItemId] = useState("");
    const [permissn, setPermissn] = useState([]);
<<<<<<< HEAD
    const router = useRouter();
=======
>>>>>>> origin/main

    const fetchPermissions = debounce(async (setPermissn) => {
        try {
            const perms = await getPermissions();
            setPermissn(perms);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    }, 300); // Adjust the debounce delay as needed

    useEffect(() => {
        fetchPermissions(setPermissn);
    }, []); // Empty dependency array ensures this runs only once

<<<<<<< HEAD

=======
>>>>>>> origin/main
    const menuItems = [
        {
            id: 'overview',
            title: "Overview",
            icon: "shield-search",
            path: "",
            subitems: [
                {
                    id: 'assets',
                    title: "Assets",
                    path: "",
                    subitems: [
                        permissn.includes(3) && {
                            id: 'vehicles',
                            title: "Vehicles",
                            path: "/dashboard/vehicles"
                        },
<<<<<<< HEAD
                        permissn.includes(6) && {
                            id: 'locations',
                            title: "Locations",
                            path: "/dashboard/locations"
=======
                        {
                            id: 'locations',
                            title: "Locations",
                            path: ""
>>>>>>> origin/main
                        }
                    ].filter(Boolean)
                },
                permissn.includes(12) && {
                    id: 'drivers',
                    title: "Drivers",
                    path: "/dashboard/drivers"
                },
                {
<<<<<<< HEAD
                    id: 'fleet_user',
                    title: "Fleet User",
                    path: "/dashboard/fleet-user"
                },
                {
=======
>>>>>>> origin/main
                    id: 'environments',
                    title: "Environments",
                    path: ""
                },
                {
                    id: 'coverage-map',
                    title: "Coverage Map",
                    path: ""
                },
                {
                    id: 'proximity',
                    title: "Proximity",
                    path: ""
                }
            ].filter(Boolean)
        },
        {
            id: 'safety',
            title: "Safety",
            icon: "shield-tick",
            path: ""
        },
        {
            id: 'compliance',
            title: "Compliance",
            icon: "user-square",
            path: ""
        },
        {
            id: 'maintenance',
            title: "Maintenance",
            icon: "wrench",
            path: ""
        },
        {
            id: 'fuel-energy',
            title: "Fuel & Energy",
            icon: "flash-circle",
            path: ""
        },
        {
            id: 'documents',
            title: "Documents",
            icon: "document",
<<<<<<< HEAD
            path: "/dashboard/documents",
=======
            path: "",
>>>>>>> origin/main
        },
        {
            id: 'reports',
            title: "Reports",
            icon: "graph-2",
            path: ""
        },
        {
            id: 'settings',
            title: "Settings",
            icon: "gear",
            path: "",
            subitems: [
                {
                    id: 'organization',
                    title: "Organization",
                    path: "",
                    subitems: [
                        { id: 'general', title: "General", path: "" },
                        permissn.includes(26) && { id: 'user-roles', title: "User & Roles", path: "/settings/organization/user-roles" },
                        permissn.includes(29) && { id: 'drivers-settings', title: "Vehicle Assignment", path: "/settings/organization/vehicle-assign" },
                        { id: 'tag-attribute', title: "Tag & Attribute", path: "" },
                        { id: 'feature-management', title: "Feature & Management", path: "" },
                        permissn.includes(32) && { id: 'driver-activity', title: "Driver Activity", path: "/settings/organization/driver-activity" },
                        { id: 'data-intention', title: "Data Intention", path: "" },
                        { id: 'apps-settings', title: "Apps", path: "" },
                        { id: 'billings', title: "Billings", path: "" }
                    ].filter(Boolean)
                },
                {
                    id: 'devices',
                    title: "Devices",
                    path: "",
                    subitems: [
                        permissn.includes(35) && { id: 'devices-list', title: "Devices", path: "/settings/device" },
                        { id: 'configuration', title: "Configuration", path: "" }
                    ].filter(Boolean)
                },
                {
                    id: 'fleets',
                    title: "Fleets",
<<<<<<< HEAD
                    path: "",
=======
                    path: "/settings/fleets",
>>>>>>> origin/main
                    subitems: [
                        { id: 'driver-assignment', title: "Driver Assignment", path: "" },
                        {
                            id: 'apps-fleets',
                            title: "Apps",
                            path: "/settings/fleets/apps-fleets",
                            subitems: [
                                { id: 'activity-log', title: "Activity & Log", path: "" }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const handleLinkClick = () => {
        if (setSidebarToggle) {
            setSidebarToggle(true);
        }
    };

    const toggleMenu = (menuId) => {
        if (menuItems.some((x) => x.id == menuId)) {
            let idx = menuItems.findIndex((x) => x.id == menuId);
            if (parentId === menuId && menuItems[idx].subitems != undefined) {
                setParentId("");
            } else {
                setParentId(menuId);
<<<<<<< HEAD
                console.log(menuItems[idx].path);
                if (menuItems[idx].path != "") {
                    router.push(menuItems[idx].path);
                }
=======
>>>>>>> origin/main
            }
            setSubItemId("");
            setSubChildItemId("");
        }
        if (parentId != "") {
            let idx = menuItems.findIndex((x) => x.id == parentId);
            if (idx > -1) {
                if (menuItems[idx]?.subitems?.some((x) => x.id == menuId)) {
                    if (subItemId == menuId) {
                        setSubItemId("");
                    } else {
                        setSubItemId(menuId);
<<<<<<< HEAD
                        let subIdx = menuItems[idx]?.subitems?.findIndex(
                            (x) => x.id == menuId
                        );
                        if (subIdx > -1 && menuItems[idx]?.subitems[subIdx].path != "") {
                            console.log(menuItems[idx]?.subitems[subIdx].path);
                            router.push(menuItems[idx]?.subitems[subIdx].path);
                        }
=======
>>>>>>> origin/main
                    }
                    setSubChildItemId("");
                }
            }
            if (subItemId != "") {
                let cIdx = menuItems[idx]?.subitems?.findIndex(
                    (x) => x.id == subItemId
                );
                if (
                    cIdx > -1 &&
                    menuItems[idx]?.subitems[cIdx]?.subitems?.some((x) => x.id == menuId)
                ) {
                    setSubChildItemId(menuId);
<<<<<<< HEAD
                    let subIdx = menuItems[idx]?.subitems[cIdx]?.subitems?.findIndex(
                        (x) => x.id == menuId
                    );
                    if (
                        subIdx > -1 &&
                        menuItems[idx]?.subitems[cIdx]?.subitems[subIdx].path != ""
                    ) {
                        console.log(menuItems[idx]?.subitems[cIdx]?.subitems[subIdx].path);
                        router.push(menuItems[idx]?.subitems[cIdx]?.subitems[subIdx].path);
                    }
=======
>>>>>>> origin/main
                }
            }
        }
    };

    const renderMenuItems = (items, parentId) => {
        return items.map((item) => (
            <div key={item.id} className={styles.menuItem}>
                <div
<<<<<<< HEAD
                    className={`${styles.menuTitle} 
          ${item.subitems && item.subitems.length > 0 ? styles.hasSubitems : ""
                        } 
            ${item.id == parentId && subItemId == ""
                            ? item.subitems == undefined
                                ? `${styles.active + " " + styles.selected}`
                                : styles.active
                            : ""
                        }
            `}
                    onClick={() => toggleMenu(item.id)}
                >
                    {item.icon && <i className={`ki-outline ki-${item.icon} fs-1`}></i>}
                    {!isCollapsed && <span onClick={handleLinkClick}>{item.title}</span>}
=======
                    className={`${styles.menuTitle} ${item.subitems && item.subitems.length > 0 ? styles.hasSubitems : ""
                        } 
            ${item.id == parentId && subItemId == "" ? styles.active : ""}`}
                    onClick={() => toggleMenu(item.id)}
                >
                    {item.icon && <i className={`ki-outline ki-${item.icon} fs-1`}></i>}
                    {!isCollapsed &&
                        (item.path ? (
                            <Link href={item.path} onClick={handleLinkClick} className="">
                                <span>{item.title}</span>
                            </Link>
                        ) : (
                            <span onClick={handleLinkClick}>{item.title}</span>
                        ))}
>>>>>>> origin/main
                    {!isCollapsed && item.subitems && item.subitems.length > 0 && (
                        <i
                            className={`ki-duotone ${item.id == parentId ? "ki-up" : "ki-down"
                                }`}
<<<<<<< HEAD
                            style={{ marginLeft: "75px" }}
=======
                            style={{ marginLeft: "auto" }}
>>>>>>> origin/main
                        ></i>
                    )}
                </div>
                {item.subitems && (
                    <div
                        className={`${styles.subMenu} ${!isCollapsed && item.id == parentId ? styles.open : ""
                            }`}
                    >
                        {item.subitems.map((subItem) => (
                            <div key={subItem.id} className={styles.menuItem}>
                                <div
                                    className={`${styles.menuTitle} ${subItem.subitems && subItem.subitems.length > 0
                                        ? styles.hasSubitems
                                        : ""
                                        } ${subItem.id == subItemId && subChildItemId == ""
<<<<<<< HEAD
                                            ? subItem.subitems == undefined
                                                ? `${styles.active + " " + styles.selected}`
                                                : styles.active
=======
                                            ? styles.active
>>>>>>> origin/main
                                            : ""
                                        }`}
                                    onClick={() => toggleMenu(subItem.id)}
                                >
                                    {subItem.icon && (
                                        <i className={`ki-outline ki-${subItem.icon} fs-1`}></i>
                                    )}
<<<<<<< HEAD
                                    {!isCollapsed && (
                                        <span onClick={handleLinkClick}>{subItem.title}</span>
                                    )}
=======
                                    {!isCollapsed &&
                                        (subItem.path ? (
                                            <Link
                                                href={subItem.path}
                                                onClick={handleLinkClick}
                                                className=""
                                            >
                                                <span>{subItem.title}</span>
                                            </Link>
                                        ) : (
                                            <span onClick={handleLinkClick}>{subItem.title}</span>
                                        ))}
>>>>>>> origin/main
                                    {!isCollapsed &&
                                        subItem.subitems &&
                                        subItem.subitems.length > 0 && (
                                            <i
                                                className={`ki-duotone ${subItem.id == subItemId ? "ki-up" : "ki-down"
                                                    }`}
<<<<<<< HEAD
                                                style={{ marginLeft: "79px" }}
=======
                                                style={{ marginLeft: "auto" }}
>>>>>>> origin/main
                                            ></i>
                                        )}
                                </div>
                                {subItem.subitems && (
                                    <div
                                        className={`${styles.subMenu} ${!isCollapsed && subItem.id == subItemId ? styles.open : ""
                                            }`}
                                    >
                                        {subItem.subitems.map((subChildItem) => (
                                            <div key={subChildItem.id} className={styles.menuItem}>
                                                <div
                                                    className={`${styles.menuTitle} ${subChildItem.subitems &&
                                                        subChildItem.subitems.length > 0
                                                        ? styles.hasSubitems
                                                        : ""
                                                        } ${subChildItem.id == subChildItemId
<<<<<<< HEAD
                                                            ? styles.active + " " + styles.selected
=======
                                                            ? styles.active
>>>>>>> origin/main
                                                            : ""
                                                        }`}
                                                    onClick={() => toggleMenu(subChildItem.id)}
                                                >
                                                    {subChildItem.icon && (
                                                        <i
                                                            className={`ki-outline ki-${subChildItem.icon} fs-1`}
                                                        ></i>
                                                    )}
<<<<<<< HEAD
                                                    {!isCollapsed && (
                                                        <span onClick={handleLinkClick}>
                                                            {subChildItem.title}
                                                        </span>
                                                    )}
=======
                                                    {!isCollapsed &&
                                                        (subChildItem.path ? (
                                                            <Link
                                                                href={subChildItem.path}
                                                                onClick={handleLinkClick}
                                                                className=""
                                                            >
                                                                <span>{subChildItem.title}</span>
                                                            </Link>
                                                        ) : (
                                                            <span onClick={handleLinkClick}>
                                                                {subChildItem.title}
                                                            </span>
                                                        ))}
>>>>>>> origin/main
                                                    {subChildItem.subitems &&
                                                        subChildItem.subitems.length > 0 && (
                                                            <i
                                                                className={`ki-duotone ${subChildItem.id == subChildItemId
                                                                    ? "ki-up"
                                                                    : "ki-down"
                                                                    }`}
                                                                style={{ marginLeft: "auto" }}
                                                            ></i>
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <>
            <div
                className={`${styles.sidebar}  ${isCollapsed ? styles.collapsed : ""
                    }  `}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
            >
                {renderMenuItems(menuItems, parentId)}
            </div>
        </>
    );
};

export default Sidebar;
