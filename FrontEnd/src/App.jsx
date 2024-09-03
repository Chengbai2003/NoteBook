import React, { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom"

import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'

import routes from '@/router'
import NavBar from '@/components/NavBar'

function App() {
  const location = useLocation()
  const { pathname } = location
  const needNav = ['/','/data','/user']
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    setShowNav(needNav.includes(location.pathname))
    console.log(pathname,showNav)
  }, [pathname])
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Routes>
          {
            routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))
          }
        </Routes>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App