

import { useState, useEffect, useContext } from 'react'
import Product from '../../../models/ProductResponse'
import AuthContext from '../../../store/User/user_context'
import useHttp from '../../../hooks/use-http'
import ProductItem from './ProductItem'
import FetchError from '../../Common/FetchError'
import Loading from './Loading'

export default function MainProducts() {
  const { sendRequest: fetch_products, isLoading, error } = useHttp()
  const [products, setProducts] = useState<Product[]>([])
  const { url } = useContext(AuthContext)
  const set_products = (data: any) => {
    setProducts(data.items)
  }
  const fetchProducts = () => {
    fetch_products({ url: `${url}/products?featured=false` }, set_products)

  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="my-20">
      <h2 className="text-2xl font-extrabold tracking-tight text-left mb-5">Customers also Like</h2>
      {!isLoading && error && <FetchError reload={fetchProducts} error={error} />}

      <div className=" grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {isLoading && <Loading />}
        {!isLoading && !error && <div>
          {products.map((product) => <ProductItem product={product} />)}
        </div>}
      </div>
    </div>
  )
}