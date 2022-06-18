import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AdminItemGallery: React.FC<{ images: any[], onDeleteImage: (id: string) => void }> = (props) => {
  return (
    <div className='flex gap-3 max-w-full overflow-scroll w-full border border-gray-200'>
      {props.images.map((image, index) =>
        <div key={index} className="w-2/5 overflow-hidden p-4 relative"  style={{aspectRatio:'1'}}>
          <FontAwesomeIcon pull="left" icon="trash" onClick={() => { props.onDeleteImage(image.id) }} className='absolute top-5 right-5 text-red-500 cursor-pointer' />
          <img className='h-full w-full' src={image.image} />
        </div>)}
    </div>
  )
}

export default AdminItemGallery