'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthLayout from "@/app/Auth/layout";
import brandlogo from '../../../../public/media/svg/brand-logos/google-icon.svg'
import apple from '../../../../public/media/svg/brand-logos/apple-black.svg'
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingIcons from 'react-loading-icons';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const router = useRouter();
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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

        const token = getCookie("token");

        if (token) {
            axios
                .get(`${url}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const userType = response.data.user_type;

                    if (userType === "EC") {
                        router.push("/company/dashboard");
                    } else if (userType === "TR") {
                        router.push("/dashboard");
                    } else {
                        console.error("Invalid user type");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    router.push("/");
                });
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const checkUser = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setLoginError("");

        localStorage.removeItem("credentials");

        function setCookie(name, value, hours) {
            let expires = "";

            if (hours) {
                const date = new Date();
                date.setTime(date.getTime() + hours * 60 * 60 * 1000);
                expires = "; expires=" + date.toUTCString();
            }

            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        try {
            const response = await fetch(
                `${url}/user/post/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                setLoginError("Wrong credentials");
                setIsLoading(false); // Stop loading
                return;
            }

            const responseData = await response.json();

            setCookie("token", responseData.token, 72);

            if (responseData.user_type === "EC") {
                router.push("/company/dashboard");
            } else if (responseData.user_type === "TR") {
                router.push("/dashboard");
            } else {
                console.error("Invalid user type");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <form className='form w-100' noValidate onSubmit={checkUser} id='kt_login_signin_form'>
            {/* begin::Heading */}
            <div className='text-center mb-11'>
                <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
                <div className='text-gray-500 fw-semibold fs-6'>
                    Your Social Campaigns
                </div>
            </div>
            {/* begin::Heading */}

            {/* begin::Login options */}
            <div className='row g-3 mb-9'>
                {/* begin::Col */}
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12'>
                    <Link
                        href='#'
                        className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
                    >
                        <Image
                            alt='google'
                            src={brandlogo}
                            className='h-15px me-3'
                            width={20}
                            height={10}
                        />
                        Sign in with Google
                    </Link>
                </div>

                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12'>
                    <Link
                        href='#'
                        className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
                    >
                        <Image
                            alt='appleLogo'
                            src={apple}
                            className='theme-dark-show h-15px me-3'
                            width={20}
                        />
                        Sign in with Apple
                    </Link>
                </div>
            </div>

            <div className='separator separator-content my-14'>
                <span className='w-125px text-gray-500 fw-semibold fs-7'>
                    Or with email
                </span>
            </div>

            <div className='mb-10 bg-light-info p-4 rounded'>
                <div className='text-info'>
                    Use account <strong>admin@demo.com</strong> and password{" "}
                    <strong>demo</strong> to continue.
                </div>
            </div>

            <div className='fv-row mb-8'>
                <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
                <input
                    placeholder='Email'
                    className='form-control bg-transparent'
                    type='email'
                    name='email'
                    onChange={handleChange}
                    autoComplete='off'
                />
            </div>

            <div className='fv-row mb-3'>
                <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>
                    Password
                </label>
                <div className="position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        autoComplete='off'
                        className='form-control bg-transparent'
                    />
                    <span role="button" className="position-absolute top-50 start-100 translate-middle" style={{ paddingRight: '2.5rem', fontSize: 'large' }} onClick={() => {
                        setShowPassword((prev) => !prev);
                    }}
                    >
                        {showPassword ? (<i className="ki-duotone ki-eye-slash">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                        </i>) : (<i className="ki-duotone ki-eye">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                        </i>)}
                    </span>
                </div>

                {loginError && <div className="text-danger">{loginError}</div>}
                {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                )}
                <div className='fv-plugins-message-container'></div>
            </div>

            <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
                <div />

                <Link href='/Auth/ResetPassword' className='link-primary'>
                    Forgot Password ?
                </Link>
            </div>

            <div className='d-grid mb-10'>
                <button id='kt_sign_in_submit' className='justify-content-center btn-primary' disabled={isLoading}>
                    <span className='indicator-progress d-flex justify-content-center'>
                        {isLoading ? (
                            <LoadingIcons.TailSpin height={18} />
                        ) : 'Login'}
                    </span>
                </button>
            </div>
        </form>
    );
}

export default Login;
