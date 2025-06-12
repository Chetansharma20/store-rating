import React from 'react'
import Draweradmin from './StoreBar'
import { Routes , Route} from 'react-router-dom'
import DashBoard from './DashBoard'

import Login from './Login'
import UpdatePassword from './UpdatePassword'


const DrawerRouting = () => {
  return (
    <>
   <Draweradmin/>
    <Routes>
<Route path='/' element={<DashBoard/>}/>

<Route path='/login' element={<Login/>}/>
<Route path='/updatepassword' element={<UpdatePassword/>}/>

    </Routes>
 </>
  )
}

export default DrawerRouting
