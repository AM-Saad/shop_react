import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import OrderItem from '../../../components/Admin/Order/OrderItem'
import RequestStatus from '../../../components/Admin/RequestStatus'
import Pagination from '../../../components/Common/Pagination'

const Orders = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { orders, fetch_orders, ordersMeta, pagination } = adminCtx
    const { loading, error } = ordersMeta
    const { currentPage } = pagination
    const updatePagination = (page: number) => {
        fetch_orders(token!, page)

    }
    useEffect(() => {
        if (token) {
            fetch_orders(token, 1)
        }

    }, [token])

  
    return (

        <div className="p-4 sm:p-6">

            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-bold text-2xl text-left">Orders</h2>
                {/* <Link to={`/admin/orders/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Order</Link> */}
            </div>
            <RequestStatus loading={loading} error={error} items={orders} label="orders" createNew={false}/>
            {!loading && !error && orders.length > 0 && <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.length > 0 && orders.map(order => <OrderItem key={order._id} order={order} />)}
                </ul>
            </div>}
            {!error && pagination && <Pagination pagination={pagination} update={updatePagination} />}

        </div>


    )
}

export default Orders