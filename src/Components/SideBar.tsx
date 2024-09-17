"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/sidebar.module.css";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { getPermissions } from "@/Components/permission/page";
import { useSession } from 'next-auth/react';

const Sidebar = ({
  isCollapsed,
  mouseEnter,
  mouseLeave,
  setSidebarToggle,
}: {
  isCollapsed?: any;
  mouseEnter?: any;
  mouseLeave?: any;
  setSidebarToggle?: any;
}) => {
  const [parentId, setParentId] = useState("");
  const [subItemId, setSubItemId] = useState("");
  const [subChildItemId, setSubChildItemId] = useState("");
  const [permissn, setPermissn] = useState([]);
  const router = useRouter();

  interface User {
    token: string;
    // Add other properties you expect in the user object
  }

  interface SessionData {
    user?: User;
    // Add other properties you expect in the session data
  }

  const { data: session } = useSession() as { data?: SessionData } || {};

  const token = session && session.user && session?.user?.token;

  const fetchPermissions = useCallback(
    debounce(async (token) => {
      try {
        const perms = await getPermissions(token);
        setPermissn(perms);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setTimeout(() => fetchPermissions(token), 5000); // Retry after 5 seconds
        } else {
          console.error("Error fetching permissions:", error);
        }
      }
    }, 1000), // Increase debounce to 2 seconds
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchPermissions(token);
    }
  }, [fetchPermissions, token]);

  const menuItems = [
    {
      id: "overview",
      title: "Overview",
      icon: "shield-search",
      path: "",
      subitems: [
        {
          id: "assets",
          title: "Assets",
          path: "",
          subitems: [
            permissn && permissn.length > 0 && permissn.includes(3) && {
              id: "vehicles",
              title: "Vehicles",
              path: "/dashboard/vehicles",
            },
            permissn && permissn.length > 0 && permissn.includes(6) && {
              id: "locations",
              title: "Locations",
              path: "/dashboard/locations",
            },
          ].filter(Boolean),
        },
        permissn && permissn.length > 0 && permissn.includes(12) && {
          id: "drivers",
          title: "Drivers",
          path: "/dashboard/drivers",
        },
        {
          id: "fleet_user",
          title: "Fleet User",
          path: "/dashboard/fleet-user",
        },
        {
          id: "environments",
          title: "Environments",
          path: "/dashboard/environments",
        },
        {
          id: "coverage-map",
          title: "Coverage Map",
          path: "/dashboard/coverageMap",
        },
        {
          id: "proximity",
          title: "Proximity",
          path: "",
        },
      ].filter(Boolean),
    },
    {
      id: "safety",
      title: "Safety",
      icon: "shield-tick",
      path: "",
    },
    {
      id: "compliance",
      title: "Compliance",
      icon: "user-square",
      path: "/dashboard/compliance",
    },
    {
      id: "maintenance",
      title: "Maintenance",
      icon: "wrench",
      path: "",
    },
    {
      id: "fuel-energy",
      title: "Fuel & Energy",
      icon: "flash-circle",
      path: "",
    },
    {
      id: "documents",
      title: "Documents",
      icon: "document",
      path: "/dashboard/documents",
    },
    {
      id: "reports",
      title: "Reports",
      icon: "graph-2",
      path: "",
    },
    {
      id: "settings",
      title: "Settings",
      icon: "gear",
      path: "",
      subitems: [
        {
          id: "organization",
          title: "Organization",
          path: "",
          subitems: [
            { id: "general", title: "General", path: "" },
            permissn && permissn.length > 0 && permissn.includes(26) && {
              id: "user-roles",
              title: "User & Roles",
              path: "/settings/organization/user-roles",
            },
            permissn && permissn.length > 0 && permissn.includes(29) && {
              id: "drivers-settings",
              title: "Vehicle Assignment",
              path: "/settings/organization/vehicle-assign",
            },
            { id: "tag-attribute", title: "Tag & Attribute", path: "" },
            {
              id: "feature-management",
              title: "Feature & Management",
              path: "",
            },
            permissn && permissn.length > 0 && permissn.includes(32) && {
              id: "driver-activity",
              title: "Driver Activity",
              path: "/settings/organization/driver-activity",
            },
            { id: "data-intention", title: "Data Intention", path: "" },
            { id: "apps-settings", title: "Apps", path: "" },
            { id: "billings", title: "Billings", path: "" },
          ].filter(Boolean),
        },
        {
          id: "devices",
          title: "Devices",
          path: "",
          subitems: [
            permissn && permissn.length > 0 && permissn.includes(35) && {
              id: "devices-list",
              title: "Devices",
              path: "/settings/device",
            },
            { id: "configuration", title: "Configuration", path: "" },
          ].filter(Boolean),
        },
        {
          id: "fleets",
          title: "Fleets",
          path: "",
          subitems: [
            { id: "driver-assignment", title: "Driver Assignment", path: "" },
            {
              id: "apps-fleets",
              title: "Apps",
              path: "/settings/fleets/apps-fleets",
              subitems: [
                { id: "activity-log", title: "Activity & Log", path: "" },
              ],
            },
          ],
        },
      ],
    },
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
        if (menuItems[idx].path != "") {
          router.push(menuItems[idx].path);
        }
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
            let subIdx = menuItems[idx]?.subitems?.findIndex(
              (x) => x.id == menuId
            );
            if (subIdx > -1 && menuItems[idx]?.subitems[subIdx].path != "") {
              router.push(menuItems[idx]?.subitems[subIdx].path);
            }
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
          let subIdx = menuItems[idx]?.subitems[cIdx]?.subitems?.findIndex(
            (x) => x.id == menuId
          );
          if (
            subIdx > -1 &&
            menuItems[idx]?.subitems[cIdx]?.subitems[subIdx].path != ""
          ) {
            router.push(menuItems[idx]?.subitems[cIdx]?.subitems[subIdx].path);
          }
        }
      }
    }
  };

  const renderMenuItems = (items, parentId) => {
    return items.map((item) => (
      <div key={item.id} className={styles.menuItem}>
        <div
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
          {!isCollapsed && item.subitems && item.subitems.length > 0 && (
            <i
              className={`ki-duotone ${item.id == parentId ? "ki-up" : "ki-down"
                }`}
              style={{ marginLeft: "75px" }}
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
                      ? subItem.subitems == undefined
                        ? `${styles.active + " " + styles.selected}`
                        : styles.active
                      : ""
                    }`}
                  onClick={() => toggleMenu(subItem.id)}
                >
                  {subItem.icon && (
                    <i className={`ki-outline ki-${subItem.icon} fs-1`}></i>
                  )}
                  {!isCollapsed && (
                    <span onClick={handleLinkClick}>{subItem.title}</span>
                  )}
                  {!isCollapsed &&
                    subItem.subitems &&
                    subItem.subitems.length > 0 && (
                      <i
                        className={`ki-duotone ${subItem.id == subItemId ? "ki-up" : "ki-down"
                          }`}
                        style={{ marginLeft: "79px" }}
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
                              ? styles.active + " " + styles.selected
                              : ""
                            }`}
                          onClick={() => toggleMenu(subChildItem.id)}
                        >
                          {subChildItem.icon && (
                            <i
                              className={`ki-outline ki-${subChildItem.icon} fs-1`}
                            ></i>
                          )}
                          {!isCollapsed && (
                            <span onClick={handleLinkClick}>
                              {subChildItem.title}
                            </span>
                          )}
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
