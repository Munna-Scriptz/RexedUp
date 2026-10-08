import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'

// ── Layouts ──────────────
import LayoutOne from './layout/LayoutOne'
import Home from './pages/Home'

// ── Default pages ────────────────────────────────────────────────


// ── Auth pages ────────────────────────────────────────────────
// ── User pages ────────────────────────────────────────────────
// ── Admin pages ────────────────────────────────────────────────
// ── Legal pages ────────────────────────────────────────────────

const App = () => {
  const myRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      {/* ════════════════════ Public / Default Layout ════════════════════ */}
      <Route path='/' element={<LayoutOne />}>
        <Route index element={<Home />} />
      </Route>

    </Route>
  ))

  return (
    <>
      <RouterProvider router={myRoute} />
    </>
  )
}

export default App