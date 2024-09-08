'use client'
import React, { useState } from "react";
import Link from "next/link";
import axios from 'axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password/email', {
        email: email,
      });
      localStorage.setItem('emailVal', email)
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to send reset link');
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Failed to send reset link');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
      <form className='form w-100' noValidate id='kt_login_signin_form' onSubmit={handleSubmit}>
        {/* begin::Heading */}
        <div className='text-center mb-11'>
          <h1 className='text-gray-900 fw-bolder mb-3'>Forgot Password ?</h1>
          <div className='text-gray-500 fw-semibold fs-6'>
            Enter your email to reset your password.
          </div>
        </div>
        {/* begin::Heading */}

        {message && (
          <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
            <div className='alert-text font-weight-bold'>{message}</div>
          </div>
        )}

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <input
            placeholder='Email'
            className='form-control bg-transparent'
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            autoComplete='off'
          />

          {/* <div className='fv-plugins-message-container mt-4'> */}
          {/* <span role='alert'>Email not Found</span> */}
          {/* </div> */}
        </div>
        {/* end::Form group */}

        {/* begin::Action */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0 gap-10'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            disabled={loading}
          >
            {!loading && <span>Submit</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: "block" }}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link href='/Auth/changePassword' className='btn btn-light'>
            <span>Cancel</span>
          </Link>
        </div>
        {/* end::Action */}
      </form>
  );
}

export default ResetPassword;
