import React, { useEffect } from 'react'
import './assets/App.css'
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { v4 as uuid } from 'uuid'
import useLocalStorage from './hooks/useLocalStorage'
import useUserApi from './api/userApi'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { changeEmail, changeFirstName, changeId, changeImage, changeLastName, changePhone, changeRoleId } from "./store/reducers/UserSlice"
import Home from './pages/Home/Home'
import Catalog from './pages/Catalog/Catalog'
import Lot from './pages/Lot/Lot'
import User from './pages/User/User'
import Order from './pages/Order/Order'

function App() {
  const [deviceId, setDeviceId] = useLocalStorage("deviceId")

  const userApi = useUserApi()
  const dispatch = useDispatch()

  useEffect(() => {
    if(!deviceId)
      setDeviceId(uuid())
  }, [deviceId, setDeviceId])

  useEffect(() => {
    const setUserInfo = async (id) => {
      const userInfo = await userApi.getUser(id)

      dispatch(changeId(userInfo.id))
      dispatch(changeFirstName(userInfo.first_name))
      dispatch(changeLastName(userInfo.last_name))
      dispatch(changeEmail(userInfo.email))
      dispatch(changePhone(userInfo.phone))
      dispatch(changeImage(userInfo.image))
      dispatch(changeRoleId(userInfo.role_id))
    }

    const accessToken = localStorage.getItem("access_token")

    if(accessToken) {
      const infoFromJwt = jwtDecode(accessToken)
      setUserInfo(infoFromJwt?.id)
    }
  }, [localStorage.getItem("access_token")])

  return (
    <div className="flex flex-col justify-between min-h-screen bg-light-200 dark:bg-dark-100">
      <div className="grow flex flex-col">
        <Header />

        <main>
          <Routes>
            <Route exact path='/' element={<Home />}/>
            <Route exact path='/catalog' element={<Catalog />}/>
            <Route exact path='/lot/:id' element={<Lot />}/>
            <Route exact path='/user/:id' element={<User />}/>
            <Route exact path='/order/:id' element={<Order />}/>
            <Route exact path='*' element={<>404</>}/>
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
