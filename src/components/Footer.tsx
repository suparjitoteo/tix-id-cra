import React, { ReactNode } from 'react'
import { FaFacebook, FaHeart, FaInstagram, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function CustomLink({ isExternal = false, children, ...rest }: {
  isExternal: boolean,
  children: ReactNode,
  to: string,
  className: string,
}) {
  return (
    isExternal ? (
      <a href={rest.to} rel="noopener noreferrer" target="_blank" className={rest.className}>
        {children}
      </a>
    ) : (
      <Link
        to={rest.to}
        className={rest.className}
      >
        {children}
      </Link>
    )
  )
}

export default function Footer() {
  return (
    <div className='flex flex-col bg-gray-900 justify-center items-end p-10 mt-10'>
      <div className='flex w-full justify-center'>
        <CustomLink isExternal to='https://www.facebook.com/tixid' className='p-2'>
          <FaFacebook className='text-white hover:text-gray-300' size={25} />
        </CustomLink>
        <CustomLink isExternal to='https://www.instagram.com/tix_id' className='p-2'>
          <FaInstagram className='text-white hover:text-gray-300' size={25} />
        </CustomLink>
        <CustomLink isExternal to='https://twitter.com/tix_id' className='p-2'>
          <FaTwitter className='text-white hover:text-gray-300' size={25} />
        </CustomLink>
      </div>
      <div className='flex justify-center w-full -mt-4'>
        <h4 className="flex text-gray-400 mt-4 items-center">© 2021 , made with &nbsp; <FaHeart size={12}/> &nbsp; by Suparjito</h4>
      </div>
    </div>
  )
}
