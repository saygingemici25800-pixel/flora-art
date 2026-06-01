/**
 * Admin application root: scoped styles, toast provider, auth-guarded routes.
 * Mounted by the storefront App whenever the path is under /admin — outside
 * the storefront Layout, so no navbar / footer / custom cursor / Lenis.
 */
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './admin.css'
import { useAuth } from './lib/useAuth'
import { ToastProvider } from './components/Toast'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Coupons from './pages/Coupons'
import Stock from './pages/Stock'

function RequireAuth() {
  const authed = useAuth((s) => s.authed)
  if (!authed) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <div className="admin-scope">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/coupons" element={<Coupons />} />
              <Route path="/admin/stock" element={<Stock />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}
