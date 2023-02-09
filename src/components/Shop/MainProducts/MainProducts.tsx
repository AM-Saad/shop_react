

import { useState, useEffect, useContext } from 'react'
import Product from '../../../models/ProductResponse'
import AuthContext from '../../../store/User/user_context'
import useHttp from '../../../hooks/use-http'
import ProductItem from './ProductItem'
import FetchError from '../../Common/FetchError'
import Loading from './Loading'
import HookResponse from '../../../models/HookResponse'
import ProductResponse from '../../../models/ProductResponse'
export default function MainProducts() {
  const { sendRequest: fetch_products, isLoading, error } = useHttp()
  const [products, setProducts] = useState<Product[]>([])

  const set_products = (data: HookResponse<ProductResponse[]>) => {
    setProducts(data.items!)
  }
  const fetchProducts = () => {
    fetch_products({ url: `${import.meta.env.REACT_APP_REST_API_URL}/products?featured=false` }, set_products)

  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="my-20">
      <h2 className="text-2xl font-extrabold tracking-tight text-left mb-5">Customers also Like</h2>
      {!isLoading && error && <FetchError reload={fetchProducts} error={error} />}

      <ul role="list" className=" grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {isLoading && <Loading />}
        {!isLoading && !error && products.map((product) => <ProductItem  key={product._id} product={product} />)}
      </ul>
    </div>
  )
}
