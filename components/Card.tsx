import Link from 'next/link'
import { Models } from 'node-appwrite'
import React from 'react'
import ActionDrop from './ActionDrop'


const Card = ({file}:{file:Models.Document}) => {
  return (
    <div className='p-1 ' >
        <div className='p-1 flex justify-between rounded-2xl'>
        <Link href={file.url} target='_blank' className='bg-green-200 p-2 rounded-2xl'>
        View File
        </Link>
    
    <ActionDrop />  
        </div>
     

         
    <p>{file.name}</p>
    <p>{file.$createdAt}</p>
    </div>
  )
}

export default Card