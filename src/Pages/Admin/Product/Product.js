import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import SingleProduct from '../../../components/Admin/Products/SingleProduct'
const Product = (props) => {
    const params = useParams()
    const { slug } = params
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { currentProduct, productsMeta, fetch_product } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_product(slug, token)
        }
    }, [token, slug])

    if (productsMeta.loading) {
        return <p>Loading...</p>
    }

    if (!productsMeta.loading && productsMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{productsMeta.error}</p></div>
    }
    if (currentProduct) {
        return (
            <div className="p-4 sm:p-6">

                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold mb-4 text-left my-5'>Your Product.</h1>
                    <button onClick={() => { adminCtx.delete_product(currentProduct._id, token) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white'>Delete</button>
                </div>
                <SingleProduct product={currentProduct} />
            </div>
        )
    }
    return <></>

}

export default Product