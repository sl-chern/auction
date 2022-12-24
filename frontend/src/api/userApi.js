import { useDispatch } from "react-redux"
import axios from "axios"
import useInstance from "../hooks/useInstance"
import useLocalStorage from "../hooks/useLocalStorage"
import { v4 as uuid } from 'uuid'
import { changeEmail, changeFirstName, changeId, changeImage, changeIsLoading, changeLastName, changePhone, changeRoleId } from "../store/reducers/UserSlice"

const useUserApi = () => {
  const dispatch = useDispatch()
  const [deviceId, setDeviceId] = useLocalStorage("deviceId")
  const [, setAccessToken] = useLocalStorage("access_token")
  const [, setRefreshToken] = useLocalStorage("refresh_token")
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
  
        setAccessToken(res.data.access_token)
        setRefreshToken(res.data.refresh_token)
  
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
  
        setAccessToken(null)
        setRefreshToken(null)
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
    }
  }

  return userApi
}

export default useUserApi

export const useRefresh = () => {
  const [deviceId, setDeviceId] = useLocalStorage("deviceId")
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh_token")
  const [, setAccessToken] = useLocalStorage("access_token")

  const refresh = async (instance) => {
    try {
      if(deviceId === null)
        setDeviceId(uuid())

      const url = "/user/refresh"

      const data = {
        deviceId: deviceId,
        refreshToken: refreshToken
      }

      const res = await instance.post(url, JSON.stringify(data))

      setAccessToken(res.data.access_token)
      setRefreshToken(res.data.refresh_token)
    }
    catch(err) {
      console.log(err)
    }
  }

  return refresh
}