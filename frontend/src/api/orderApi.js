import useInstance from "../hooks/useInstance"

const useOrderApi = () => {
  const instance = useInstance()

  const orderApi = {
    createBet: async (data) => {
      const url = "/order/bet"

      const res = await instance.post(url, JSON.stringify(data))

      return res.data
    },
    deleteBet: async (id) => {
      const url = `/order/bet/${id}`

      const res = await instance.delete(url)

      return res
    },
    createOrder: async (data) => {
      const url = "/order/"

      const res = await instance.post(url, data)

      return res.data
    },
    getOrders: async (type) => {
      const url = `/order/${type}`

      const res = await instance.get(url)

      return res.data
    },
    createReview: async (data) => {
      const url = "/order/review/"

      const res = await instance.post(url, JSON.stringify(data))

      return res.data
    },
    getReviews: async (id) => {
      const url = `/order/review/${id}`

      const res = await instance.get(url)

      return res.data
    },
    updateReview: async (data) => {
      const url = "/order/review/"

      const res = await instance.patch(url, data)

      return res.data
    },
    deleteReview: async (id) => {
      const url = `/order/review/${id}`

      const res = await instance.delete(url)

      return res.data
    },
  }

  return orderApi
}

export default useOrderApi