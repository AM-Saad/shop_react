import { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import useHttp from '../../hooks/use-http'
import UserContext from '../../store/User/user_context'
import HookResponse from '../../models/HookResponse'
import PaginationType from '../../models/Pagination'
import ProductResponse from '../../models/ProductResponse'
import FetchError from '../../components/Common/FetchError'
import Loading from '../../components/Shop/MainProducts/Loading'
import ProductItem from '../../components/Shop/MainProducts/ProductItem'
import Pagination from '../../components/Common/Pagination'

const Category = () => {
    const { name }: any = useParams()
    const { url, pagination, update_pagination } = useContext(UserContext)
    const { sendRequest: fetch_category_products, isLoading, error } = useHttp()
    const [products, setProducts] = useState<ProductResponse[]>([])
    const { currentPage } = pagination
    const update_category = (data: HookResponse<ProductResponse[]>) => {
        setProducts(data.items)
        if (data.pagination) {
            update_pagination!(data.pagination)
        }
    }

    const fetchCategory = (categoryName: string) => {
        fetch_category_products({ url: `${url}/categories/${categoryName}?page=${pagination?.currentPage}&&itemsPerPage=${pagination?.itemsPerPage}` }, update_category)
    }

    const updatePagination = (page: number) => {
        update_pagination!({ ...pagination, currentPage: page })
    }
    useEffect(() => {
        fetchCategory(name)
    }, [name, currentPage])
    return (
        <div className="min-h-full max-w-2xl mx-auto py-16 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-left mb-5 capitalize">{name}</h2>
            {!isLoading && error && <FetchError reload={() => fetchCategory(name)} error={error} />}
            {!isLoading && !error && products.length === 0 && <>
                <p className='logo-font my-12 text-4xl text-center'>Nothing Here Yet, But Stay Tuned 🤌</p>
            </>}
            <div className=" grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {isLoading && <Loading />}
                {!isLoading && !error && products.length > 0 && <> {products.map((product) => <ProductItem product={product} />)} </>}
            </div>
            {!error && pagination && <Pagination pagination={pagination} update={updatePagination} />}
        </div>
    )
}

export default Category