import React from 'react'
import { Toaster } from 'react-hot-toast'
import FloatingShape from '../components/FloatingShape'

const AppLoyout = ({ children }) => {
    return (
        <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
                </div>
            </div>

            <div className='relative z-50 pt-20 flex items-center justify-center'>
                {children}
                {/* <div className='absolute bottom-5 text-white w-full text-center'>Made with 💖 by <a target='blank' href='https://sabari-vr.github.io/my-portfolio' className='font-bold'>Sabari V R</a></div> */}
            </div>
            <Toaster />
        </div>
        // <div
        //     className='min-h-screen bg-gradient-to-br
        //   from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
        // >
        //     <div className='relative z-50 pt-20 '>
        //         {children}
        //     </div>
        //     <Toaster />
        // </div>
    )
}

export default AppLoyout