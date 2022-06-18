import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import ProductItem from '../../../components/Admin/Products/ProductItem'
import Fallback from '../../../components/Common/Fallback'

const Products = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { productsMeta, products, fetch_products } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_products(token)
        }

    }, [token])

    if (productsMeta.loading) {
        return <p>Loading...</p>
    }
    if (!productsMeta.loading && productsMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{productsMeta.error}</p></div>
    }
    if (!productsMeta.loading && !productsMeta.error && products.length === 0) {
        return <>
            <Fallback label="products" redirectLink='/admin/products/new' />
        </>
    }
    return (

        <div className="p-4 sm:p-6">
            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-boldtext-2xl text-left">Products</h2>
                <Link to={`/admin/products/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Product</Link>

            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul  className="divide-y divide-gray-200">
                    {products.length > 0 && products.map(product => <ProductItem product={product} />)}

                </ul>
            </div>
        </div>


    )
}

export default Products