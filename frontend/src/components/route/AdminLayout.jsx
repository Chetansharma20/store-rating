import React from 'react'
import Draweradmin from '../admin/Draweradmin'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
      <div>
      <Draweradmin/>
      </div>
      <Outlet/>
    </div>
  )
}

export default AdminLayout