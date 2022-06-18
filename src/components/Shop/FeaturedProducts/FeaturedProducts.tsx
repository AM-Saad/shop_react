import React, { useState, useEffect, useContext } from 'react'
import Product from '../../../models/ProductResponse'
import AuthContext from '../../../store/User/user_context'
import useHttp from '../../../hooks/use-http'
import FeatureProductItem from './FeatureProductItem'
import Loading from './Loading'
import FetchError from '../../Common/FetchError'
import HookResponse from '../../../models/HookResponse'
import ProductResponse from '../../../models/ProductResponse'

const FeaturedProducts = () => {
    const { sendRequest: fetch_products, isLoading, error } = useHttp()
    const [products, setProducts] = useState<Product[]>([])
    const { url } = useContext(AuthContext)
    const set_products = (data: HookResponse<ProductResponse[]>) => {
        setProducts(data.items)
    }
    const fetchProducts = () => {
        fetch_products({ url: `${url}/products?featured=true` }, set_products)

    }
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className='my-20'>
            <h2 className='text-left  text-3xl font-bold mb-5'>Featured</h2>
            {!isLoading && error &&<FetchError reload={fetchProducts} error={error}/> }
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">

                {isLoading && <Loading />}
                {!isLoading && !error && products.length > 0 && products.map(product => <FeatureProductItem key={product._id} product={product} url={url} />)}
            </div>
        </div>
    )
}

export default FeaturedProducts