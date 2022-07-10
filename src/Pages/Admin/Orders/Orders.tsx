import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import OrderItem from '../../../components/Admin/Order/OrderItem'
import Fallback from '../../../components/Common/Fallback'

const Orders = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { orders, fetch_orders, ordersMeta } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_orders(token)
        }

    }, [token])

    if (ordersMeta.loading) {
        return <p>Loading...</p>
    }
    if (!ordersMeta.loading && ordersMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{ordersMeta.error}</p></div>
    }
    if (!ordersMeta.loading && !ordersMeta.error && orders.length === 0) {
        return <Fallback label="Orders" redirectLink="/admin/orders/new" />
    }
    return (

        <div className="p-4 sm:p-6">

            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-boldtext-2xl text-left">Orders</h2>
                <Link to={`/admin/orders/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Order</Link>

            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.length > 0 && orders.map(order => <OrderItem key={order._id} order={order} />)}
                </ul>
            </div>
        </div>


    )
}

export default Orders