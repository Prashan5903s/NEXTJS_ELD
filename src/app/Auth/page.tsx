'use client'
import React from 'react';
import Login from './login/page';
import { Registration } from './registration/page';
import ResetPassword from './ResetPassword/page';
import NewPasswordForm from './changePassword/page';
import AuthLayout from '@/app/Auth/layout';
function Authentication() {


  return (
    <AuthLayout><Login /> </AuthLayout>
  )
}

export default Authentication;
