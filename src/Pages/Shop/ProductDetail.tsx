import { useContext, useEffect, useState, useCallback, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import Product from '../../models/ProductResponse'
import Attribute, { SelectedAttribute } from '../../models/Attribute'
import useHttp from '../../hooks/use-http'
import { StarIcon } from '@heroicons/react/solid'
import UserContext from '../../store/User/user_context'
import ProductGallery from '../../components/Shop/Product/ProductGallery'
import ProductAttributes from '../../components/Shop/Product/Attributes'
import NotFound from '../../components/Shop/Product/NotFound'
import HookResponse from '../../models/HookResponse'
import ProductResponse from '../../models/ProductResponse'

const reviews = { href: '#', average: 4, totalCount: 117 }


enum ActionKind {
    UPDATE_CART = 'UPDATE_CART',
    CHANGE_ATTR = 'CHANGE_ATTR',
}

type Action = {
    type: ActionKind,
    value: CartState
}
interface CartState {
    id: string | null;
    attributes: SelectedAttribute[];
    name: string | null;
    quantity: number | null;
    price: number | null;
}




const cartReducer = (state: CartState, action: Action): CartState => {
    if (action.type === ActionKind.UPDATE_CART) {
        return action.value
    }
    return state

}
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}


const ProductDetail = () => {
    const { slug }: any = useParams()
    const { url, add_to_cart } = useContext(UserContext)
    const { sendRequest: fetch_product, isLoading, error } = useHttp()
    const [product, setProduct] = useState<Product>()
    const [cartState, dispatchCartState] = useReducer(cartReducer, { id: null, attributes: [], name: null, quantity: null, price: null })

    const set_product = (data: HookResponse<ProductResponse[]>) => {
        let product = data.items[0]
        setProduct(product)
        if (product) {
            const initAttributes = product.attributes.map((i: any) => ({
                _id: i._id,
                name: i.name,
                option: i.options[0].name,
                price: parseInt(i.options[0].price, 10),
            }))
            const initPrice = initAttributes.reduce((acc: any, value: any) => acc + value.price, product.info.price)
            dispatchCartState({ type: ActionKind.UPDATE_CART, value: { id: product._id, attributes: initAttributes, name: product.name, quantity: 1, price: initPrice } })
        }
    }

    const changeAttr = (attributes: SelectedAttribute[], price: number) => {
        dispatchCartState({ type: ActionKind.UPDATE_CART, value: { ...cartState, attributes: attributes, price: price } })
    }
    const addToCart = (e: any) => {
        e.preventDefault()
        add_to_cart!({ productId: product?._id, attributes: cartState.attributes, quantity: 1 })
    }

    const getProduct = useCallback(() => {
        return fetch_product({ url: `${url}/products/?slug=${slug}` }, set_product)
    }, [slug, fetch_product, url]);

    useEffect(() => {
        getProduct()
    }, [])

    if (!isLoading && error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{error}</p></div>
    }
    if (!isLoading && !error && !product) {
        return <NotFound />
    }

    return (
        <div className="bg-white">
            <div className="pt-6">


                <ProductGallery images={product?.images || []} productName={product?.name || ''} loading={isLoading} />

                <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{product?.name}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:mt-0 lg:row-span-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl text-gray-900">{cartState?.price || '....'} $</p>

                        {/* Reviews */}
                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{reviews.average} out of 5 stars</p>
                                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    {reviews.totalCount} reviews
                                </a>
                            </div>
                        </div>

                        <form className="mt-10">

                            <ProductAttributes loading={isLoading} productAttributes={product?.attributes || []} selectedAttributes={cartState?.attributes || []} productPrice={product?.info.price || 0} onChange={changeAttr} />

                            {!isLoading && <button
                                onClick={addToCart}
                                type="submit"
                                className="mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add to bag
                            </button>}
                            {isLoading && <button
                                type="button"
                                className="opacity-50 mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white  focus:outline-none"
                            >
                                Loading...
                            </button>}
                        </form>
                    </div>

                    <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{product?.description || 'Loading...'}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Details</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{product?.details}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail