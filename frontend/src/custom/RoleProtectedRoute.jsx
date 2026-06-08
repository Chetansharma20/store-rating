import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleProtectedRoute = ({children}) => {
    const isLogin = !!localStorage.getItem("token");
    if(!isLogin)
    {
        return <Navigate to="/login" />
    }
    return children    
}

export default RoleProtectedRoute