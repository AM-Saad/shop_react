import React, { useEffect, useRef, useState, useContext } from 'react'
import Product from '../../../models/ProductResponse'
import UserContext from '../../../store/User/user_context'

const NotFound: React.FC = () => {


    const inputRef: any = useRef()
    const [inputVal, setInputVal] = useState('')
    const [searchList, setSearchList] = useState<Product[]>([])
    const {  search_products } = useContext(UserContext)

    const searchHandler = () => {
        setInputVal(inputRef?.current?.value)
    }

    const setSearch = async (query: string) => {

        const items = await search_products!(query)
        setSearchList(items!)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(inputVal)
        }, 500)
        return () => clearTimeout(timer)
    }, [inputVal])

    return (
        <div className="max-w-lg mx-auto my-20">
            <div>
                <div className="text-center">
                    <div className="h-20 w-20 m-auto">

                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 98.31"
                        >
                            <g>
                                <path className="st0" d="M8.32,0h106.24c4.57,0,8.32,3.74,8.32,8.32V90c0,4.57-3.74,8.32-8.32,8.32l-106.24,0C3.74,98.31,0,94.57,0,90 V8.32C0,3.74,3.74,0,8.32,0L8.32,0z M37.46,65.4H23.01v-6.53l14.45-17.18h6.9v17.56h3.59v6.15h-3.59v5.35h-6.9V65.4L37.46,65.4z M37.46,59.25v-9.02l-7.63,9.02H37.46L37.46,59.25z M49.77,56.34c0-5.43,0.98-9.23,2.93-11.39c1.96-2.17,4.94-3.25,8.93-3.25 c1.92,0,3.51,0.24,4.74,0.71c1.24,0.47,2.24,1.09,3.02,1.85c0.78,0.76,1.4,1.56,1.84,2.39c0.45,0.84,0.81,1.82,1.08,2.93 c0.53,2.13,0.8,4.35,0.8,6.67c0,5.18-0.88,8.97-2.63,11.37c-1.75,2.4-4.77,3.61-9.06,3.61c-2.4,0-4.34-0.39-5.83-1.15 c-1.48-0.77-2.69-1.89-3.65-3.37c-0.69-1.05-1.22-2.49-1.61-4.31C49.96,60.56,49.77,58.55,49.77,56.34L49.77,56.34z M57.63,56.35 c0,3.63,0.32,6.12,0.96,7.45c0.64,1.33,1.58,2,2.8,2c0.8,0,1.5-0.28,2.1-0.84c0.59-0.57,1.02-1.46,1.3-2.68 c0.28-1.22,0.42-3.13,0.42-5.71c0-3.79-0.32-6.34-0.96-7.65c-0.65-1.3-1.61-1.96-2.89-1.96c-1.32,0-2.26,0.67-2.85,2 C57.92,50.28,57.63,52.75,57.63,56.35L57.63,56.35z M89.37,65.4H74.92v-6.53l14.45-17.18h6.9v17.56h3.59v6.15h-3.59v5.35h-6.9V65.4 L89.37,65.4z M89.37,59.25v-9.02l-7.63,9.02H89.37L89.37,59.25z M117.97,23.29H5.29v67.51c0,0.64,0.25,1.2,0.67,1.63 c0.42,0.43,0.99,0.67,1.63,0.67h108.04c0.64,0,1.2-0.25,1.63-0.67c0.43-0.43,0.67-0.99,0.67-1.63l0-67.51H117.97L117.97,23.29z M106.64,9.35c2.27,0,4.11,1.84,4.11,4.11c0,2.27-1.84,4.11-4.11,4.11c-2.27,0-4.11-1.84-4.11-4.11 C102.54,11.19,104.38,9.35,106.64,9.35L106.64,9.35z M78.8,9.35c2.27,0,4.11,1.84,4.11,4.11c0,2.27-1.84,4.11-4.11,4.11 c-2.27,0-4.11-1.84-4.11-4.11C74.69,11.19,76.53,9.35,78.8,9.35L78.8,9.35z M92.72,9.35c2.27,0,4.11,1.84,4.11,4.11 c0,2.27-1.84,4.11-4.11,4.11c-2.27,0-4.11-1.84-4.11-4.11C88.61,11.19,90.45,9.35,92.72,9.35L92.72,9.35z" />
                            </g>
                        </svg>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        We cannot find this project maybe it's has been deleted or the link is borken
                    </p>
                </div>
                <form action="#" className="mt-6 flex">
                    <label htmlFor="email" className="sr-only">
                        Search for a project
                    </label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-16 focus:outline-none px-2"
                        placeholder="Search for a project"
                        ref={inputRef}
                        autoComplete="off"
                        onChange={searchHandler}
                    />

                </form>
            </div>
            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">

                </h3>
                <ul role="list" className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
                    {searchList.map((product, productIdx) => (
                        <li key={productIdx} className="py-4 ">
                            <a className='flex items-center justify-between space-x-3' href={`/products/${product.slug}`}>
                                <div className="min-w-0 flex-1 flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={import.meta.env.REACT_APP_REST_API_URL + product.images[0]} alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default NotFound
