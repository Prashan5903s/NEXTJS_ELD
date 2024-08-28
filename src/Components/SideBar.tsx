"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";
import { debounce } from "lodash";
import { getPermissions } from "@/Components/permission/page";

const Sidebar = ({ isCollapsed, mouseEnter, mouseLeave, setSidebarToggle }) => {
  const [parentId, setParentId] = useState("");
  const [subItemId, setSubItemId] = useState("");
  const [subChildItemId, setSubChildItemId] = useState("");
  const [permissn, setPermissn] = useState([]);

  const fetchPermissions = debounce(async (setPermissn) => {
    try {
      const perms = await getPermissions();
      setPermissn(perms);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }, 300); // Adjust the debounce delay as needed

  useEffect(() => {
    fetchPermissions(setPermissn);
  }, []); // Empty dependency array ensures this runs only once

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
            permissn.includes(3) && {
              id: "vehicles",
              title: "Vehicles",
              path: "/dashboard/vehicles",
            },
            {
              id: "locations",
              title: "Locations",
              path: "",
            },
          ].filter(Boolean),
        },
        permissn.includes(12) && {
          id: "drivers",
          title: "Drivers",
          path: "/dashboard/drivers",
        },
        {
          id: "environments",
          title: "Environments",
          path: "/dashboard/environments",
        },
        {
          id: "coverage-map",
          title: "Coverage Map",
          path: "",
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
      path: "",
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
            permissn.includes(26) && {
              id: "user-roles",
              title: "User & Roles",
              path: "/settings/organization/user-roles",
            },
            permissn.includes(29) && {
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
            permissn.includes(32) && {
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
            permissn.includes(35) && {
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
          path: "/settings/fleets",
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
        }
      }
    }
  };

  const renderMenuItems = (items, parentId) => {
    return items.map((item) => (
      <div key={item.id} className={styles.menuItem}>
        <div
          className={`${styles.menuTitle} ${
            item.subitems && item.subitems.length > 0 ? styles.hasSubitems : ""
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
          {!isCollapsed && item.subitems && item.subitems.length > 0 && (
            <i
              className={`ki-duotone ${
                item.id == parentId ? "ki-up" : "ki-down"
              }`}
              style={{ marginLeft: "auto" }}
            ></i>
          )}
        </div>
        {item.subitems && (
          <div
            className={`${styles.subMenu} ${
              !isCollapsed && item.id == parentId ? styles.open : ""
            }`}
          >
            {item.subitems.map((subItem) => (
              <div key={subItem.id} className={styles.menuItem}>
                <div
                  className={`${styles.menuTitle} ${
                    subItem.subitems && subItem.subitems.length > 0
                      ? styles.hasSubitems
                      : ""
                  } ${
                    subItem.id == subItemId && subChildItemId == ""
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => toggleMenu(subItem.id)}
                >
                  {subItem.icon && (
                    <i className={`ki-outline ki-${subItem.icon} fs-1`}></i>
                  )}
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
                  {!isCollapsed &&
                    subItem.subitems &&
                    subItem.subitems.length > 0 && (
                      <i
                        className={`ki-duotone ${
                          subItem.id == subItemId ? "ki-up" : "ki-down"
                        }`}
                        style={{ marginLeft: "auto" }}
                      ></i>
                    )}
                </div>
                {subItem.subitems && (
                  <div
                    className={`${styles.subMenu} ${
                      !isCollapsed && subItem.id == subItemId ? styles.open : ""
                    }`}
                  >
                    {subItem.subitems.map((subChildItem) => (
                      <div key={subChildItem.id} className={styles.menuItem}>
                        <div
                          className={`${styles.menuTitle} ${
                            subChildItem.subitems &&
                            subChildItem.subitems.length > 0
                              ? styles.hasSubitems
                              : ""
                          } ${
                            subChildItem.id == subChildItemId
                              ? styles.active
                              : ""
                          }`}
                          onClick={() => toggleMenu(subChildItem.id)}
                        >
                          {subChildItem.icon && (
                            <i
                              className={`ki-outline ki-${subChildItem.icon} fs-1`}
                            ></i>
                          )}
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
                          {subChildItem.subitems &&
                            subChildItem.subitems.length > 0 && (
                              <i
                                className={`ki-duotone ${
                                  subChildItem.id == subChildItemId
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
        className={`${styles.sidebar}  ${
          isCollapsed ? styles.collapsed : ""
        } sidebarMenu`}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        {renderMenuItems(menuItems, parentId)}
      </div>
    </>
  );
};

export default Sidebar;
