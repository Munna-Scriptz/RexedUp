import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../components/common/Footer'

const LayoutOne = () => {
  return (
    <>
        <Outlet />
        {/* <Footer /> */}
    </>
  )
}

export default LayoutOne