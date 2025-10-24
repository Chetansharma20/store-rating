import React from 'react';
import NewAppBar from '../user/NewAppBar';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import UserRegister from '../user/UserRegister';
import UnifiedLogin from '../auth/UnifiedLogin';
import Stores from '../user/Stores';
import UpdatePassword from '../store owner/UpdatePassword';
import RoleProtectedRoute from '../../custom/RoleProtectedRoute';
import Home from '../user/Home';

import AdminLayout from './AdminLayout';
import AdminDashBoard from '../admin/AdminDashBoard';
import AddUser from '../admin/AddUser';
import StoreManagement from '../admin/StoreManagement';
import UserManagement from '../admin/UserManagement';
import StoreLayout from './StoreLayout';
import StoreDashBoard from '../store owner/StoreDashBoard';
import UpdatePasswordUser from '../user/UpdatePasswordUser';
// import StoreBar from '../store owner/StoreBar';
import AdminRoutes from './AdminRoutes';

const ClientLayout = () => (
  <>
    <NewAppBar />
    <Outlet />
  </>
);

const UnifiedRouting = () => {
  return (
    <Routes>
      {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<UnifiedLogin />} />

      {/* User Routes */}
      <Route path="/user" element={<ClientLayout />}>
        <Route index element={<Home/>} />
        <Route
          path="stores"
          element={
            <RoleProtectedRoute>
              <Stores/>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="updatepassworduser"
          element={
            <RoleProtectedRoute>
              <UpdatePasswordUser />
            </RoleProtectedRoute>
          }
        />
        <Route path="register" element={<UserRegister />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoutes>
            <AdminLayout />
          </AdminRoutes>
        }
      >
        <Route index element={<AdminDashBoard />} />
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path="adduser" element={<AddUser />} />
        <Route path="storemanagement" element={<StoreManagement />} />
        <Route path="usermanagement" element={<UserManagement />} />
      </Route>

      {/* Store Owner Routes */}
      <Route
        path="/store"
        element={
          <AdminRoutes>
            <StoreLayout />
          </AdminRoutes>
        }
      >
        <Route index element={<StoreDashBoard />} />
        <Route path="dashboard" element={<StoreDashBoard />} />
        <Route path="updatepassword" element={<UpdatePassword />} />
        {/* <Route path="storebar" element={<StoreBar />} > */}
      </Route>
    </Routes>
  );
};

export default UnifiedRouting;
