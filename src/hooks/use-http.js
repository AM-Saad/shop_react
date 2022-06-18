import { useState, useCallback } from "react"

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = async (reqConfig, dataLoaded) => {
    setIsLoading(true)
    try {
      const response = await fetch(reqConfig.url, {
        method: reqConfig.method ? reqConfig.method : 'GET',
        headers: reqConfig.headers ? reqConfig.headers : {},
        body: reqConfig.body ? JSON.stringify(reqConfig.body) : null,
      })

      const data = await response.json()
      if (response.status === 200 || response.status === 201) {
        dataLoaded(data)
      } else {
        setError(data.message)
      }
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      setError(error.message || 'Something went wrong')

    }

  }
  return { isLoading, error, sendRequest }
}

export default useHttp