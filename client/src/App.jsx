import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { Analytics } from '@vercel/analytics/react'

// ── Layouts ──────────────
import LayoutOne from './layout/LayoutOne'
import AdminLayout from './layout/AdminLayout'

// ── Default pages ────────────────────────────────────────────────
import Home from './pages/Home'

// ── Admin pages ────────────────────────────────────────────────
import Admin from './pages/admin/Admin'
import AdminLogin from './pages/admin/AdminLogin'
import AdminUpload from './pages/admin/AdminUpload'
import AdminManage from './pages/admin/AdminManage'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { globalApis } from './api/baseApi'

// ── Auth pages ────────────────────────────────────────────────
// ── User pages ────────────────────────────────────────────────

// ── Legal pages ────────────────────────────────────────────────

const App = () => {
  const myRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      {/* ════════════════════ Public / Default Layout ════════════════════ */}
      <Route path='/' element={<LayoutOne />}>
        <Route index element={<Home />} />
      </Route>

      <Route path='/admin/login' element={<AdminLogin />} />

      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path='upload' element={<AdminUpload />} />
        <Route path='manage' element={<AdminManage />} />
      </Route>

    </Route>
  ))

  return (
    <>
      <Analytics />

      <ApiProvider api={globalApis}>
        <RouterProvider router={myRoute} />
      </ApiProvider>

    </>
  )
}

export default App