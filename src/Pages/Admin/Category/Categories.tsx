import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import CategoryItem from '../../../components/Admin/Category/CategoryItem'
import Pagination from '../../../components/Common/Pagination'
import RequestStatus from '../../../components/Admin/RequestStatus'


const Categories = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { categories, fetch_categories, categoryMeta, pagination } = adminCtx
    const { loading, error } = categoryMeta

    const updatePagination = (page: number) => {
        fetch_categories(token!, page)

    }
    useEffect(() => {
        if (token) {
            fetch_categories(token, 1)
        }
    }, [token])


    return (

        <div className="p-4 sm:p-6">

            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-boldtext-2xl text-left">Category</h2>
                <Link to={`/admin/category/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Category</Link>
            </div>
            <RequestStatus loading={loading} error={error} items={categories} label="category"/>

            {!loading && !error && categories.length > 0 && <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {categories.length > 0 && categories.map(category => <CategoryItem category={category} />)}

                </ul>
            </div>}
            {!loading && !error && pagination && <Pagination pagination={pagination} update={updatePagination} />}

        </div>


    )
}

export default Categories