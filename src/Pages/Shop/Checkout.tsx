import { useContext } from 'react'
import UserContext from '../../store/User/user_context'
import FetchError from '../../components/Common/FetchError'
import CartItem from '../../components/Shop/Cart/CartProductItem'
import Loading from '../../components/Shop/Cart/Loading'
import { Link } from 'react-router-dom'
import CheckoutInterface from '../../models/Checkout'
import { XCircleIcon } from '@heroicons/react/solid'

const Checkout = () => {
    const { cart, cartMeta, toggle_cart, get_cart, checkout, checkoutMeta } = useContext(UserContext)
    const startProccessing = () => {
        const orderObject: CheckoutInterface = {

        }
        checkout!(orderObject)
    }
    return (
        <div className="min-h-full max-w-2xl mx-auto py-16 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="pt-6">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Checkout</h2>
                {!cartMeta?.loading && cartMeta?.error && <FetchError reload={get_cart!} error={cartMeta?.error} />}
                {!checkoutMeta?.loading && checkoutMeta?.error && 
                    <div className="rounded-md bg-red-50 p-4 mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">There were an error with your submission</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul role="list" className="list-disc pl-5 space-y-1">
                            <li>{checkoutMeta?.error}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <div className='grid sm:grid-cols-2 gap-5'>
                    <div>
                        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                            <div className="md:col-span-1 mb-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                                <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                            </div>
                            <div className="">
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                    <form action="#" method="POST">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    autoComplete="given-name"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    autoComplete="family-name"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-4">
                                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                                    Email address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email-address"
                                                    id="email-address"
                                                    autoComplete="email"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Country
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    autoComplete="country-name"
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option>United States</option>
                                                    <option>Canada</option>
                                                    <option>Mexico</option>
                                                </select>
                                            </div>

                                            <div className="col-span-6">
                                                <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                                    Street address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="street-address"
                                                    id="street-address"
                                                    autoComplete="street-address"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    autoComplete="address-level2"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                                    State / Province
                                                </label>
                                                <input
                                                    type="text"
                                                    name="region"
                                                    id="region"
                                                    autoComplete="address-level1"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                                    ZIP / Postal code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postal-code"
                                                    id="postal-code"
                                                    autoComplete="postal-code"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 mt-2"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <button
                                    onClick={startProccessing}
                                    className="mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Place Order</button>
                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                        or{' '}
                                        <Link
                                            to="/shop"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div>
                        {!cartMeta?.loading && !cartMeta?.error && cart?.items?.length === 0 &&
                            <div className='my-11 p-4 text-center text-xl'>
                                <p className='mb-8 font-bold'>Your Cart is Empty 😔</p>
                                <p className='mb-3'>Fill it now 👇</p>
                                <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => toggle_cart?.(false)}
                                >
                                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                </button>
                            </div>
                        }
                        {cartMeta?.loading && !cartMeta.error && <Loading />}

                        {cart && !cartMeta?.loading && !cartMeta?.error &&
                            <div className="mb-8">
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200 overflow-scroll sm:h-96">
                                        {cart.items.map((product) => <CartItem key={product._id} product={product} />)}
                                    </ul>
                                </div>
                            </div>}
                        {cart && cart.items.length > 0 &&
                            <div className="border-t border-gray-200 py-6 ">
                                <div className="border-b-2 mb-5">
                                    <div className="mb-6 flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>${cart.total}.00</p>
                                    </div>
                                    <div className="mb-6 flex justify-between text-base font-medium text-gray-900">
                                        <p>Shipping</p>
                                        <p>$00.00</p>
                                    </div>
                                    <div className="mb-6 flex justify-between text-base font-medium text-gray-900">
                                        <p >Taxes</p>
                                        <p>$00.00</p>
                                    </div>
                                </div>
                                <div className="mb-5 flex justify-between text-base font-medium text-gray-900">
                                    <p className='font-bold'>Total</p>
                                    <p>${cart.total}.00</p>
                                </div>

                            </div>}
                    </div>


                </div>
            </div>
        </div>

    )
}

export default Checkout