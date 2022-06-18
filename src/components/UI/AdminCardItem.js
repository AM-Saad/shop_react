import React from 'react'

const AdminCardItem = (props) => {
  return (
    <div className='rounded bg-white shadow my-3 p-3'>{props.children}</div>
  )
}

export default AdminCardItem