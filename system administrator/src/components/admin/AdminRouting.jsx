import React from 'react'
import Draweradmin from './Draweradmin'
import { Routes , Route} from 'react-router-dom'
import DashBoard from './DashBoard'
// import AddProduct from './AddProduct'
// import Orders from './Orders'
// import ReviewRatings from './ReviewRatings'
// import Products from './Products'
// import OrderDetails from './OrderDetails'
// import AddUser from './AddUser'
// import { Store } from '@mui/icons-material'
import StoreManagement from './StoreManagement'
import UserManagement from './UserManagement'
// import LogoutButton from './LogoutButton'
import AddUser from './AddUser'
import Login from './Login'
import ProtectedRoute from '../custom/ProtectedRoute'


const DrawerRouting = () => {
  return (
    <>
   <Draweradmin/>
    <Routes>
<Route path='/' element={
  <DashBoard/>
  }/>

<Route path='/adduser' element={<ProtectedRoute><AddUser/></ProtectedRoute>}/>

<Route path='/storemanagement' element={<ProtectedRoute><StoreManagement/></ProtectedRoute>}/>
<Route path='/usermanagement' element={ <ProtectedRoute><UserManagement/></ProtectedRoute>}/>
<Route path='/login' element={<Login/>}/>
    </Routes>
 </>
  )
}

export default DrawerRouting
