import React from 'react'
import Draweradmin from './StoreBar'
import { Routes , Route} from 'react-router-dom'


import Login from './Login'
import UpdatePassword from './UpdatePassword'
import StoreBar from './StoreBar'
import StoreDashBoard from './StoreDashBoard'


const StoreRouting = () => {
  return (
    <>
   <StoreBar/>
    <Routes>
<Route path='/' element={<StoreDashBoard/>}/>

<Route path='/login' element={<Login/>}/>
<Route path='/updatepassword' element={<UpdatePassword/>}/>

    </Routes>
 </>
  )
}

export default StoreRouting
