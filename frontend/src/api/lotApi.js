import axios from "axios"
import useInstance from "../hooks/useInstance"

const useLotApi = () => {
  const instance = useInstance()

  const lotApi = {
    getLots: async (data = {}) => {
      const url = "/lot/lots"

      const res = await instance.post(url, JSON.stringify(data))

      return res.data
    },
    getAuctionEnd: async () => {
      const url = "/lot/lots/endOfAuction"

      const res = await instance.get(url)

      return res.data
    },
    getAuctionStart: async () => {
      const url = "/lot/lots/startOfAuction"

      const res = await instance.get(url)

      return res.data
    },
    getCategories: async () => {
      const url = "/lot/categoies"

      const res = await instance.get(url)

      return res.data
    }
  }

  return lotApi
}

export default useLotApi