import React from 'react'
import { Navigate } from 'react-router-dom'


const ProtectedRoute = ({children}) => {
   const isLogin = !!localStorage.getItem("token");
   if(!isLogin)
   {
    return <Navigate to="/login" />
   }
return children    
 
}

export default ProtectedRoute