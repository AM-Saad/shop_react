import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useHttp from '../../../hooks/use-http'
import Category from '../../../models/Category'
import FetchError from '../../Common/FetchError'
import Loading from './Loading'
import HookResponse from '../../../models/HookResponse'
const Categories: React.FC = () => {
    const { sendRequest: fetch_category, isLoading, error } = useHttp()
    const [categories, setCategories] = useState<Category[]>([])
    const update_category = (data: HookResponse<Category[]>) => {
        setCategories(data.items)
    }
    const fetchCategory = () => {
        fetch_category({ url: `${import.meta.env.REACT_APP_REST_API_URL}/categories` }, update_category)
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div data-testid="categorytest" className=" mx-auto py-8 lg:max-w-none">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Collections</h2>

                    {!isLoading && error && <FetchError reload={fetchCategory} error={error} />}

                    <div >
                        {isLoading && <Loading />}
                        <ul className=" lg:space-y-0 grid sm:grid-cols-3 gap-6">
                            {!isLoading && !error &&
                                categories.map((ctg) => (
                                    <li key={ctg.name} className="relative">
                                        <Link key={ctg._id} to={'/category/' + ctg.name} className="block h-full overflow-hidden rounded-2xl w-full">

                                            <img
                                                src={import.meta.env.REACT_APP_REST_API_URL + ctg.image}
                                                alt={ctg.name}
                                                className="w-full h-full object-center object-cover"
                                            />
                                            <div style={{ backdropFilter: "blur(5px)" }} className='w-full absolute bottom-10 left-0 p-4 h-20 bg-black bg-opacity-50'>

                                                <h3 className="mt-2 font-black lg:text-2xl text-white capitalize">
                                                    {ctg.name}
                                                </h3>
                                            </div>
                                        </Link>

                                    </li>

                                ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Categories