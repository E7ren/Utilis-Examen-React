import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from "react-router-dom";



const PublicLayout = () => {
  return (
    <>
        <Navbar/>

        <main className='container-fluid'>
            <div className='row'>
                <div className='col-12'>
                    <Outlet></Outlet>
                </div>
            </div>

        </main>

    </>
  )
}

export default PublicLayout