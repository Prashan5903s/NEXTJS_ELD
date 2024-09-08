"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import avatar from "../../public/media/avatars/300-1.jpg";
import logo from "../../public/media/logos/demo.svg";
import flag1 from "../../public/media/flags/australia.svg";
import flag2 from "../../public/media/flags/india.svg";
import { useRouter } from "next/navigation";
import { Oval } from 'react-loading-icons';  // Import the spinner component

function Header({ toggle }:{toggle?: any}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotifications, setOpenNotifications] = useState(false);
  const [isSide, setIsSide] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function logout() {
    function getCookie(name) {
      const nameEQ = name + "=";

      const ca = document.cookie.split(";");

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === " ") c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
    try {
      const accessToken = getCookie("token");

      const response = await fetch(`${url}/user/logout`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to revoke token");
      } else {
        setIsLoading(true);
      }

      const data = await response.json();

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }

    function eraseCookie(name) {
      document.cookie = name + "=; Max-Age=-99999999; path=/";
    }

    eraseCookie("token");

    router.push("/");
  }

  const toggleSidebar = () => {
    setIsSide(!isSide);
  };

  return (
    <header className="d-flex  p-7">
      <div
        className="app-header-logo d-flex align-items-center ps-lg-6"
        id="kt_app_header_logo"
      >
        <div
          className="app-sidebar-toggle btn btn-sm btn-icon bg-body btn-color-gray-500 btn-active-color-primary w-30px h-30px ms-n2 me-4 d-none d-lg-flex "
          id="kt_app_sidebar_mobile_toggle"
          onClick={toggle}
        >
          <i className="ki-outline ki-abstract-14 fs-3 mt-1"></i>
        </div>
        <div
          className="btn btn-icon btn-active-color-primary w-35px h-35px ms-3 me-2 d-flex d-lg-none"
          id="kt_app_sidebar_mobile_toggle"
          onClick={toggle}
        >
          <i className="ki-outline ki-abstract-14 fs-2"></i>
        </div>
        <Link href="/dashboard" className="app-sidebar-logo">
          <Image
            className="logo"
            src={logo}
            alt="logo"
            width={68}
            height={60}
          />
        </Link>
      </div>
      <div className="d-flex flex-stack w-100">
        <div className="app-navbar-item d-flex align-items-stretch  position-relative">
          <i className="ki-outline ki-magnifier search-icon fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-2"></i>
          <input
            type="text"
            className="search-input form-control form-control border h-lg-45px  ps-13"
            placeholder="Search..."
          />
        </div>
        <div className="right-header btn.btn-icon">
          {/* <div
            className="btn btn-icon btn-custom btn-color-gray-600 btn-active-color-primary w-35px h-35px w-md-40px h-md-40px position-relative"
            onClick={toggleSidebar}
          >
            <i className="ki-outline ki-notification-on fs-1"></i>
            <span className="position-absolute top-0 start-100 translate-middle  badge badge-circle badge-danger w-15px h-15px ms-n4 mt-3">
              5
            </span>
          </div> */}
          <div
            className="btn btn-icon btn-custom btn-color-gray-600 btn-active-color-primary w-35px h-35px w-md-40px h-md-40px position-relative"
            onMouseEnter={() => setOpenNotifications(true)}
            onMouseLeave={() => setOpenNotifications(false)}
          >
            <i className="ki-outline ki-notification-on fs-1"></i>
            <span className="position-absolute top-0 start-100 translate-middle  badge badge-circle badge-danger w-15px h-15px ms-n4 mt-3">
              5
            </span>
          </div>
          <div
            className={`menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px ${isOpenNotifications === true ? 'show' : ''
              } position-fixed m-0`}
            data-kt-menu="true"
            id="kt_menu_notifications"
            style={{
              inset: "0px 0px auto auto",
              transform: "translate3d(-92.2px, 55px, 0px)"
            }}
            data-popper-placement="bottom-end"
          >
            <div
              className="d-flex flex-column bgi-no-repeat rounded-top"
              style={{ backgroundImage: `url('https://uat.apnatelelink.us/assets/media/misc/menu-header-bg.jpg')` }}
            >
              <h3 className="text-white fw-semibold px-9 mt-10 mb-6">
                Notifications
              </h3>
              <ul
                className="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semibold px-9"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link text-white opacity-75 opacity-state-100 pb-4 active"
                    data-bs-toggle="tab"
                    href="#kt_topbar_notifications_2"
                    aria-selected="true"
                    role="tab"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="kt_topbar_notifications_2"
                role="tabpanel"
              >
                <div className="scroll-y mh-325px my-5 px-8">
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New driver has been edited TL TL
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">2 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New package has been edited Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New permission has been added Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New permission has been added Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New module has been added Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New module has been added Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New package has been edited Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">3 days ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New user has been edited alt alt
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">4 months ago</span>
                  </div>
                  <div className="d-flex flex-stack py-4">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-4">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-outline ki-abstract-28 fs-2 text-primary"></i>
                        </span>
                      </div>
                      <div className="mb-0 me-2">
                        <a
                          href="#"
                          className="fs-6 text-gray-800 text-hover-primary fw-bold"
                        ></a>
                        <div className="text-gray-500 fs-7">
                          New language has been edited Super Admin
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-light fs-8">4 months ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            role="button"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <Image
              src={avatar}
              alt="Max Smith"
              className="rounded-circle"
              width={50}
              height={50}
            />
            <div
              className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px ${isOpen === true ? "show" : ""
                } position-fixed m-0`}
              data-kt-menu="true"
              style={{
                inset: "0px 0px auto auto",
                transform: "translate3d(-82.2px, 75px, 0px)",
              }}
            >
              <div className="menu-item px-3">
                <div className="menu-content d-flex align-items-center px-3">
                  <div className="symbol symbol-50px me-5">
                    <Image src={avatar} alt="user" />
                  </div>

                  <div className="d-flex flex-column">
                    <div className="fw-bold d-flex align-items-center fs-5">
                      Transport Transport
                    </div>
                    <Link
                      href=""
                      className="fw-semibold text-muted text-hover-primary fs-7"
                    >
                      transport@gmail.com
                    </Link>
                  </div>
                </div>
              </div>

              <div className="separator my-2"></div>

              <div className="menu-item px-5">
                <Link
                  href="/dashboard/profile"
                  className="menu-link px-5 bg-hover-light text-hover-primary"
                >
                  My Profile
                </Link>
              </div>

              <div className="menu-item px-5">
                <Link
                  href=""
                  className="menu-link px-5 bg-hover-light text-hover-inverse-light"
                >
                  Edit Profile
                </Link>
              </div>

              <div
                className="menu-item px-5"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a
                  href="#"
                  className="menu-link px-5 bg-hover-light text-hover-primary"
                >
                  <span className="menu-title position-relative">
                    Language
                    <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
                      English
                      <Image
                        className="w-15px h-15px rounded-1 ms-2"
                        src={flag2}
                        alt="English"
                      />
                    </span>
                  </span>
                </a>

                <div
                  className={`menu-sub menu-sub-dropdown w-175px py-4 position-fixed m-0 ${isDropdownOpen === true ? "show" : ""
                    }`}
                  style={{
                    zIndex: 108,
                    inset: "0px 0px auto auto",
                    transform: "translate3d(-275.2px, 170.6px, 0px)",
                    display: isDropdownOpen ? "block" : "none",
                  }}
                >
                  <div className="menu-item px-3">
                    <a
                      href=""
                      className="menu-link d-flex px-5 bg-hover-light active text-hover-primary"
                    >
                      <span className="symbol symbol-20px me-4">
                        <Image
                          className="rounded-1"
                          src={flag2}
                          alt="English"
                        />
                      </span>
                      English
                    </a>
                  </div>
                  <div className="menu-item px-3">
                    <a
                      href=""
                      className="menu-link d-flex px-5 bg-hover-light text-hover-primary"
                    >
                      <span className="symbol symbol-20px me-4">
                        <Image
                          className="rounded-1"
                          src={flag1}
                          alt="Spanish"
                        />
                      </span>
                      Spanish
                    </a>
                  </div>
                </div>
              </div>

              <div className="menu-item px-5">
                <li className="menu-link px-5 bg-hover-light text-hover-inverse-light" onClick={logout}>
                  <span className="nav-link">
                    {isLoading ? <Oval stroke="#000" /> : "Logout"}
                  </span>
                </li>
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="loading-overlay">
              <Oval stroke="#000" />
            </div>
          )}

          <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
      `}</style>

          <Link href="/">
            <i className="ki-outline ki-exit-right fs-1"></i>
          </Link>
        </div>
      </div>
      <div className="app-header-separator"></div>
      <div
        className={`offcanvas offcanvas-end ${isSide ? "show" : ""} w-450px`}
        tabIndex={-1}
      >
        <div className="offcanvas-header d-flex justify-content-between">
          <div>
            <h5 className="offcanvas-title mt-2">Brian Cox</h5>
            <div className="mb-0 ">
              <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
              <span className="fs-7 fw-semibold text-secondary">Active</span>
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm btn-icon btn-active-color-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <i className="ki-outline ki-dots-square fs-2"></i>
            </button>
            <div
              className="btn btn-sm btn-icon btn-active-color-primary"
              onClick={() => setIsSide(false)}
            >
              <i className="ki-outline ki-cross-square fs-2"></i>
            </div>
          </div>
        </div>

        <div className="offcanvas-body border border-start-0 border-end-0">
          <div className="d-flex flex-column align-items-start">
            <div className="d-flex align-items-center mb-2">
              <div className="symbol symbol-35px symbol-circle">
                <Image className="logo" src={avatar} alt="logo" />
              </div>

              <div className="ms-3 d-flex justify-content-end mt-5">
                <a
                  href="#"
                  className="fs-5 fw-bold text-gray-900 text-hover-primary me-1"
                >
                  Brian Cox
                </a>
                <span className="text-muted fs-7 m-1">2 mins</span>
              </div>
            </div>

            <div
              className="p-5 rounded bg-info-subtle text-dark-emphasis fw-semibold mw-lg-400px text-start me-5"
              data-kt-element="message-text"
            >
              How likely are you to recommend our company to your friends and
              family ?
            </div>
          </div>

          <div className="d-flex flex-column align-items-end mt-5">
            <div className="d-flex align-items-center mb-2">
              <div className="me-3 d-flex justify-content-start ">
                <span className="text-muted fs-7 m-1">5 mins</span>
                <a
                  href="#"
                  className="fs-5 fw-bold text-gray-900 text-hover-primary ms-1"
                >
                  You
                </a>
              </div>

              <div className="symbol symbol-35px symbol-circle">
                <Image className="logo" src={avatar} alt="logo" />
              </div>
            </div>

            <div
              className="p-5 rounded bg-success-subtle text-dark-emphasis fw-semibold mw-lg-400px text-end ms-5"
              data-kt-element="message-text"
            >
              Hey there, we’re just writing to let you know that you’ve been
              subscribed to a repository on GitHub.
            </div>
          </div>

          <div className="d-flex flex-column align-items-start mt-5">
            <div className="d-flex align-items-center mb-2">
              <div className="symbol symbol-35px symbol-circle">
                <Image className="logo" src={avatar} alt="logo" />
              </div>

              <div className="ms-3 d-flex justify-content-end ">
                <a
                  href="#"
                  className="fs-5 fw-bold text-gray-900 text-hover-primary me-1"
                >
                  Brian Cox
                </a>
                <span className="text-muted fs-7 m-1">1 hour</span>
              </div>
            </div>

            <div
              className="p-5 rounded bg-info-subtle text-dark-emphasis fw-semibold mw-lg-400px text-start me-5"
              data-kt-element="message-text"
            >
              {" "}
              Ok, Understood!
            </div>
          </div>

          <div className="d-flex flex-column align-items-end mt-5">
            <div className="d-flex align-items-center mb-2">
              <div className="me-3 d-flex justify-content-start ">
                <span className="text-muted fs-7 m-1">2 hours</span>
                <a
                  href="#"
                  className="fs-5 fw-bold text-gray-900 text-hover-primary ms-1"
                >
                  You
                </a>
              </div>

              <div className="symbol symbol-35px symbol-circle">
                <Image className="logo" src={avatar} alt="logo" />
              </div>
            </div>

            <div
              className="p-5 rounded bg-success-subtle text-dark-emphasis fw-semibold mw-lg-400px text-end ms-5"
              data-kt-element="message-text"
            >
              You’ll receive notifications for all issues, pull requests!
            </div>
          </div>

          <div className="d-flex flex-column align-items-start mt-5">
            <div className="d-flex align-items-center mb-2">
              <div className="symbol symbol-35px symbol-circle">
                <Image className="logo" src={avatar} alt="logo" />
              </div>

              <div className="ms-3 d-flex justify-content-end ">
                <a
                  href="#"
                  className="fs-5 fw-bold text-gray-900 text-hover-primary me-1"
                >
                  Brian Cox
                </a>
                <span className="text-muted fs-7 m-1">3 hours</span>
              </div>
            </div>

            <div
              className="p-5 rounded bg-info-subtle text-dark-emphasis fw-semibold mw-lg-400px text-start me-5"
              data-kt-element="message-text"
            >
              {" "}
              You can unwatch this repository immediately by clicking here:
              Keenthemes.com
            </div>
          </div>
        </div>

        <div className="mb-5 text-center p-5">
          <input
            className="form-control form-control-solid w-400px"
            type="text"
            placeholder="Type a message"
          />
          <div className="d-flex justify-content-between m-5">
            <div className="mt-2">
              <i className="ki-outline ki-paper-clip fs-3 me-1"></i>{" "}
              <i className="ki-outline ki-cloud-add fs-3 me-1"></i>
            </div>
            <div>
              <button className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
