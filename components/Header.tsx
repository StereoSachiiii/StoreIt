import Image from 'next/image'
import React from 'react'

const Header = React.memo(() => {
  return (
    <div className='w-full p-6  items-center shadow-lg flex gap-20'>
        <div className='flex items-center gap-4' >
            <div>
                <img src="/Logo.png" alt="" />
            </div>
        <div className='text-2xl text-amber-600'>
              Storage
        </div>
    </div>


        <div className='w-[1000px] flex  items-center gap-4 shadow-2xl rounded-3xl p-1'>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
<path d="M 21 3 C 11.654545 3 4 10.654545 4 20 C 4 29.345455 11.654545 37 21 37 C 24.701287 37 28.127393 35.786719 30.927734 33.755859 L 44.085938 46.914062 L 46.914062 44.085938 L 33.875 31.046875 C 36.43682 28.068316 38 24.210207 38 20 C 38 10.654545 30.345455 3 21 3 z M 21 5 C 29.254545 5 36 11.745455 36 20 C 36 28.254545 29.254545 35 21 35 C 12.745455 35 6 28.254545 6 20 C 6 11.745455 12.745455 5 21 5 z"></path>
</svg>
        <input className='w-full bg-stone-100 h-12  active:border-0 rounded-2xl p-2' type="text" placeholder='search' />
        </div>

        <div className='flex items-center auto gap-6 '>
          <div className='flex items-center p-3 gap-1 bg-amber-600 rounded-3xl'>
           <img src="cloud.svg" alt="" className='w-6' /> 
           Upload
          </div>
          <div>
          <img src="back.svg" alt="" />
          </div>
        </div>
    </div>
  )
},)

export default Header