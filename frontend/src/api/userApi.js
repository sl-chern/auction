import { useDispatch } from "react-redux"
import axios from "axios"
import useInstance from "../hooks/useInstance"
import useLocalStorage from "../hooks/useLocalStorage"
import { v4 as uuid } from 'uuid'
import { changeEmail, changeFirstName, changeId, changeImage, changeIsLoading, changeLastName, changePhone, changeRoleId } from "../store/reducers/UserSlice"

const useUserApi = () => {
  const dispatch = useDispatch()
  const [deviceId, setDeviceId] = useLocalStorage("deviceId")
  const instance = useInstance()

  const clearUserInfo = () => {
    dispatch(changeId(null))
    dispatch(changeFirstName(null))
    dispatch(changeLastName(null))
    dispatch(changeEmail(null))
    dispatch(changePhone(null))
    dispatch(changeImage(null))
    dispatch(changeRoleId(null))
  }

  const userApi = {
    authenticate: async (token) => {
      try {
        if(deviceId === null)
          setDeviceId(uuid())
        
        const url = "http://localhost:5000/api/user/authenticate"
  
        const data = {
          token: token,
          deviceId: deviceId
        }
  
        const res = await axios.post(url, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          }
        })

        localStorage.setItem("access_token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)
  
        dispatch(changeId(res.data.user_info.id))
        dispatch(changeFirstName(res.data.user_info.firstName))
        dispatch(changeLastName(res.data.user_info.lastName))
        dispatch(changeEmail(res.data.user_info.email))
        dispatch(changePhone(res.data.user_info.phone))
        dispatch(changeImage(res.data.user_info.image))
        dispatch(changeRoleId(res.data.user_info.roleId))
      }
      catch(err) {
        console.log(err)
      }
    },
    logout: async () => {
      try {
        if(deviceId === null)
          setDeviceId(uuid())
  
        clearUserInfo()
  
        const url = "/user/logout"
  
        const data = {
          deviceId: deviceId
        }
  
        await instance.post(url, JSON.stringify(data))
  
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
      }
      catch(err) {
        console.log(err)
      }
    },
    getUser: async (id) => {
      try{
        dispatch(changeIsLoading(true))

        const url = `/user/${id}`

        const res = await instance.get(url)

        dispatch(changeIsLoading(false))

        return res.data
      }
      catch(err) {
        console.log(err)
      }
    },
    updateUser: async (data, id) => {
      const url = `/user/${id}`

      const res = await instance.patch(url, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      dispatch(changeId(res.data.id))
      dispatch(changeFirstName(res.data.firstName))
      dispatch(changeLastName(res.data.lastName))
      dispatch(changeEmail(res.data.email))
      dispatch(changePhone(res.data.phone))
      dispatch(changeImage(res.data.image))
      dispatch(changeRoleId(res.data.roleId))

      return res.data
    }
  }

  return userApi
}

export default useUserApi

export const useRefresh = () => {
  const [deviceId, setDeviceId] = useLocalStorage("deviceId")
  const dispatch = useDispatch()

  const refresh = async (instance) => {
    try {
      if(deviceId === null)
        setDeviceId(uuid())

      const url = `${process.env.REACT_APP_SERVER_URL}/user/refresh`

      const data = {
        deviceId: deviceId,
        refreshToken: localStorage.getItem("refresh_token")
      }

      const res = await axios.post(url, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        }
      })

      localStorage.setItem("access_token", res.data.access_token)
      localStorage.setItem("refresh_token", res.data.refresh_token)
    }
    catch(err) {
      if(err.response?.status === 401) {
        dispatch(changeId(null))
        dispatch(changeFirstName(null))
        dispatch(changeLastName(null))
        dispatch(changeEmail(null))
        dispatch(changePhone(null))
        dispatch(changeImage(null))
        dispatch(changeRoleId(null))
      }
      console.log(err)
    }
  }

  return refresh
}