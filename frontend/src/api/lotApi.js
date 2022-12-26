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
    },
    getLot: async (id) => {
      const url = `/lot/${id}`

      const res = await instance.get(url)

      return res.data
    },
    getBets: async (id) => {
      const url = `/lot/${id}/bets`

      const res = await instance.get(url)

      return res.data
    },
    createBet: async (data) => {
      const url = "/order/bet"

      const res = await instance.post(url, JSON.stringify(data))

      return res
    },
    createLot: async (data) => {
      const url = "lot"

      const res = await instance.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      return res.data
    },
    updateLot: async (data, id) => {
      const url = `lot/${id}`

      const res = await instance.patch(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      return res.data
    },
    deleteLot: async (id) => {
      const url = `lot/${id}`

      const res = await instance.delete(url)

      return res.data
    },
  }

  return lotApi
}

export default useLotApi