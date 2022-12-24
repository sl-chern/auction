import axios from "axios"
import { useDispatch } from "react-redux"
import useLocalStorage from "./useLocalStorage"
import { useRefresh } from "../api/userApi"
import { changeEmail, changeFirstName, changeId, changeImage, changeLastName, changePhone, changeRoleId } from "../store/reducers/UserSlice"

const useInstance = () => {
  const dispatch = useDispatch()
  const refresh = useRefresh()
  const [accessToken,] = useLocalStorage("access_token")
  const [refreshToken,] = useLocalStorage("refresh_token")

  const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) 
        config.headers["Authorization"] = `Bearer ${accessToken}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  instance.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalConfig = err.config
  
      if(refreshToken === null)
        return Promise.reject(err)
      
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          refresh(instance)
          return instance(originalConfig)
        } 
        catch (_error) {
          // dispatch(changeId(null))
          // dispatch(changeFirstName(null))
          // dispatch(changeLastName(null))
          // dispatch(changeEmail(null))
          // dispatch(changePhone(null))
          // dispatch(changeImage(null))
          // dispatch(changeRoleId(null))
          return Promise.reject(_error)
        }
      }
  
      return Promise.reject(err)
    }
  )
  
  return instance
}

export default useInstance