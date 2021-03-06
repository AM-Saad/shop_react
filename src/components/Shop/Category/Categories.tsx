import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import useHttp from '../../../hooks/use-http'
import Category from '../../../models/Category'
import UserContext from '../../../store/User/user_context'
import FetchError from '../../Common/FetchError'
import Loading from './Loading'
import HookResponse from '../../../models/HookResponse'
const Categories: React.FC = () => {
    const { sendRequest: fetch_category, isLoading, error } = useHttp()
    const [categories, setCategories] = useState<Category[]>([])
    const { url } = useContext(UserContext)
    const update_category = (data: HookResponse<Category[]>) => {
        setCategories(data.items)
    }
    const fetchCategory = () => {
        fetch_category({ url: `${url}/categories` }, update_category)
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div data-testid="categorytest" className="max-w-2xl mx-auto py-8 lg:max-w-none">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Collections</h2>

                    {!isLoading && error && <FetchError reload={fetchCategory} error={error} />}

                    <div className=" space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
                        {isLoading && <Loading />}
                        {!isLoading && !error &&
                            categories.map((callout) => (
                                <ul key={callout.name} className="group relative">
                                    <li role="listitem">
                                        <div className="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                                            <img
                                                src={url + callout.image}
                                                alt={callout.name}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>
                                        <h3 className="mt-6 text-sm text-gray-500">
                                            <a href={'/category/' + callout.name}>
                                                <span className="absolute inset-0" />
                                                {callout.name}
                                            </a>
                                        </h3>
                                    </li>

                                </ul>
                            ))}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Categories