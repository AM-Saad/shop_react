import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import CategoryItem from '../../../components/Admin/Category/CategoryItem'
import Fallback from '../../../components/Common/Fallback'

const Categories = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { categories, fetch_categories } = adminCtx
    const { categoryMeta } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_categories(token)
        }

    }, [token, fetch_categories])

    if (categoryMeta.loading) {
        return <p>Loading...</p>
    }
    if (!categoryMeta.loading && categoryMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{categoryMeta.error}</p></div>
    }
    if (!categoryMeta.loading && !categoryMeta.error && categories.length === 0) {
        return <>
            <Fallback label="category" redirectLink="/admin/category/new" />

        </>
    }
    return (

        <div className="p-4 sm:p-6">

            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-boldtext-2xl text-left">Category</h2>
                <Link to={`/admin/category/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Category</Link>

            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul  className="divide-y divide-gray-200">
                    {categories.length > 0 && categories.map(category => <CategoryItem category={category} />)}

                </ul>
            </div>
        </div>


    )
}

export default Categories