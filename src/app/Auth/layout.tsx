'use client'
import Image from "next/image";
import Link from "next/link";
import authScreen from '../../../public/media/misc/auth-screens.png'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
})  {
  return (
    <>
      <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
        <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1 '>
          <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
            <div className='w-lg-500px p-10'>{children}</div>
          </div>

          <div className='d-flex flex-center flex-wrap px-5'>
            <div className='d-flex fw-semibold text-primary fs-base'>
              <Link href='#' className='px-5' target='_blank'>
                Terms
              </Link>

              <Link href='#' className='px-5' target='_blank'>
                Plans
              </Link>

              <Link href='#' className='px-5' target='_blank'>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div
          className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
          style={{ backgroundImage: "url(/media/misc/auth-bg.png)" }}
        >
          <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
            <Link href='' className='mb-12 '>
              <img
                alt='Logo'
                src='/media/logos/custom-1.png'
                className="h-75px"
              />
            </Link>

            <Image
              className='mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20'
              src={authScreen}
              alt=''
            />

            <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
              Fast, Efficient and Productive
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
