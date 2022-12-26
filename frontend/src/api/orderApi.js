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
    }
  }

  return orderApi
}

export default useOrderApi