import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import NewAppBar from './NewAppBar'

import ProtectedRoute from '../custom/ProtectedRoute'
import UpdatePassword from './UpdatePassword'
import Stores from './Stores'
const Routing = () => {
  return (
    <>
    <NewAppBar/>
    <Routes>
   
        <Route path='/login' element={<Login/>}/>
        
        <Route path='/stores' element={<Stores/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/updatepassword' element={
          <ProtectedRoute> <UpdatePassword/> </ProtectedRoute>
          }/>
       

    </Routes>
    
    
    
    
    </>
  )
}

export default Routing