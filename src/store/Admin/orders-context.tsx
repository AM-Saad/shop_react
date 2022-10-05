import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import { useHistory, useLocation } from "react-router-dom"

import OrderContextType from '../../models/OrdersContext';
import Pagination from '../../models/Pagination';
import Order, { OrdersMeta } from '../../models/Order';
import Meta from '../../models/Meta';
import serialize from '../../util/serialize';
const initialPagination = {
    itemsPerPage: 10,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    lastPage: 1,
    nextPage: 2,
    prevPage: 0,
    total: 0,
    skip: 0,
}
const OrdersContext = React.createContext<OrderContextType>({

    orders: [],
    ordersMeta: { loading: true, error: null, filters: {} },
    pagination: initialPagination,
    currentOrder: null,

    fetch_orders: (token?: string) => { },
    fetch_order: (id: string, token: string | null) => { },
    delete_order: (id: string, token: string | null) => { },
    change_order_status: (status: number, token: string | null) => { },
    update_meta: (data: any) => { },
    update_pagination: (data: Pagination) => { }

})

export const OrdersContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    let history = useHistory()

    const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
    const [orders, setOrders] = useState([])

    const [ordersMeta, setOrdersMeta] = useState<OrdersMeta>({ loading: false, error: null, filters: {} })
    const [pagination, setPagination] = useState(initialPagination)
    const notificationCtx = useContext(NotificationModalContext)
    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })



    const fetch_orders = async (token: string) => {
        setOrdersMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        const { from, to,  min, max, minQty, maxQty, status } = ordersMeta.filters
        const params = new Map<string, string | string[]>();
        if (min) params.set("min", min);
        if (max) params.set("max", max);
        if (minQty) params.set("minQty", minQty);
        if (maxQty) params.set("maxQty", maxQty);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (status && status?.length > 0) {
            params.set("status", status.map((s) => s.toString()));
        }
        const paramsUrl = serialize(params)
        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders?page=${pagination.currentPage}&&itemsPerPage=${pagination.itemsPerPage}&&${paramsUrl}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                if (json.pagination) {
                    update_pagination!(json.pagination)
                }
                return setOrders(json.items)
            }
            return setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))



        } catch (error) {
            return setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))

        }
    }
    const fetch_order = async (id: string, token: string | null) => {
        setOrdersMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                return setCurrentOrder(json.item)
            }
            return setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))


        } catch (error) {
            setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))


        }
    }

    const delete_order = async (id: string, token: string | null) => {
        setOrdersMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setOrdersMeta((prevState => {
                return { ...prevState, loading: true, error: null }
            }))
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/orders')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setOrdersMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))

        }
    }

    const change_order_status = async (status: number, token: string | null) => {
        setUpdatingMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders/${currentOrder?._id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: status }),
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setUpdatingMeta({ loading: false, error: null })
            if (response.status === 200) {
                console.log(json.item)
                return setCurrentOrder(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })
        }
    }
    const update_pagination = async (data: Pagination) => {
        return setPagination(data)
    }

    const update_meta = async (data: any) => {
        setPagination(prevState => { return { ...prevState, currentPage: 1 } })
        console.log(data)
        setOrdersMeta(prevState => { return { ...prevState, ...data } })
    }
    useEffect(() => {
        update_pagination(initialPagination)
    }, [])
    const ctx = {
        orders,
        currentOrder,
        ordersMeta,
        fetch_orders,
        fetch_order,
        delete_order,
        change_order_status,
        updatingMeta,
        update_pagination,
        update_meta,
        pagination,
        url: 'http://localhost:8000'
    }


    return <OrdersContext.Provider value={ctx}>
        {props.children}
    </OrdersContext.Provider>
}


export default OrdersContext