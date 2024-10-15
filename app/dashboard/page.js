import React from 'react'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
const page = () => {
  return (
    <div>
        <Navbar/>
        <main className='min-h-[79vh]'>
            This is DashBoard
        </main>
        <Footer/>
    </div>
  )
}

export default page
