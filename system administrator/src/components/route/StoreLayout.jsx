import React from 'react'

import { Outlet } from 'react-router-dom'
import StoreBar from '../store owner/StoreBar'

const StoreLayout = () => {
  return (
    <div>
        <div>
            <StoreBar/>
        </div>
        <Outlet/>
    </div>
  )
}

export default StoreLayout