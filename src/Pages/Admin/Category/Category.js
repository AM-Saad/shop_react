import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import SingleCategory from '../../../components/Admin/Category/SingleCategory'
const Product = (props) => {
    const params = useParams()
    const { id } = params
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { currentCategory, categoryMeta, fetch_category } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_category(id, token)
        }
    }, [token, id, fetch_category])

    if (categoryMeta.loading) {
        return <p>Loading...</p>
    }

    if (!categoryMeta.loading && categoryMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{categoryMeta.error}</p></div>
    }
    if (currentCategory) {

        return (
            <div className='p-4 sm:p-6'>
                <div className='flex items-center justify-between '>
                    <h1 className='text-2xl font-bold mb-4 text-left my-5'>Your Category.</h1>
                    <button onClick={() => { adminCtx.delete_category(currentCategory._id, token) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white'>Delete</button>
                </div>
                <SingleCategory category={currentCategory} />
            </div>
        )
    }
    return <></>

}

export default Product