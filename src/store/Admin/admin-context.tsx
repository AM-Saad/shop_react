import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import AuthContext from "../User/user_context"
import { useHistory, useLocation } from "react-router-dom"

import AdminContextInterface from '../../models/AdminContextInterface';
import ProductResponse from '../../models/ProductResponse';
import Pagination from '../../models/Pagination';
import Category from '../../models/Category';
import Zone from '../../models/Zone';
import Order from '../../models/Order';
import Meta from '../../models/Meta';
import { AuthMeta } from '../../models/UserContextInterface'
const initialPagination = {
    itemsPerPage: 5,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    lastPage: 1,
    nextPage: 2,
    prevPage: 0,
    total: 0,
    skip: 0,
}
const AdminContext = React.createContext<AdminContextInterface>({
    pagination: initialPagination,
    products: [],
    productsMeta: { loading: true, error: null },
    currentProduct: null,
    fetch_products: (token: string | null, page:number) => { },
    fetch_product: (id: string, token: string | null) => { },
    delete_product: (id: string, token: string | null) => { },
    update_partial_product: (json_patch: any, token: string | null) => { },
    categories: [],
    categoryMeta: { loading: true, error: null },
    currentCategory: null,
    fetch_categories:(token: string, page?:number) => { },
    fetch_category: (id: string, token: string | null) => { },
    delete_category: (id: string, token: string | null) => { },
    update_partial_category: (json_patch: any, token: string | null) => { },
    updatingMeta: { loading: true, error: null },
    upload_image: (id: string, files: any, token: string | null, tag: string) => { },
    delete_image: (id: string, image: string, token: string | null, tag: string) => { },
    url: 'http://localhost:8000',
    isLoggedIn: false,
    authMeta: { user: null, token: null, loading: false, error: null },
    onLogin: (email: string, password: string) => { },
    onLogout: () => { },
    getMe: (token: string) => { },

    zones: [],
    zonesMeta: { loading: true, error: null },
    currentZone: null,
    fetch_zones: (token?: string, page?:number) => { },
    fetch_zone: (id: string, token: string | null) => { },
    delete_zone: (id: string, token: string | null) => { },
    update_partial_zone: (json_patch: any, token: string | null) => { },


    orders: [],
    ordersMeta: { loading: true, error: null },
    currentOrder: null,
    fetch_orders: (token?: string) => { },
    fetch_order: (id: string, token: string | null) => { },
    delete_order: (id: string, token: string | null) => { },
    change_order_status: (status: number, token: string | null) => { },
    update_pagination: (data: Pagination) => { },

})

export const AdminContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    let history = useHistory()
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [authMeta, setAuthMeta] = useState<AuthMeta>({ user: null, token: null, loading: false, error: null })

    const [productsMeta, setProductsMeta] = useState<Meta>({ loading: false, error: null })
    const [products, setProducts] = useState([])
    const [currentProduct, setCurrentProduct] = useState<ProductResponse | null>(null)
    const [pagination, setPagination] = useState<Pagination>(initialPagination)

    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [categoryMeta, setCategoryMeta] = useState<Meta>({ loading: false, error: null })
    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })
    const [categories, setCategories] = useState([])

    const [currentZone, setCurrentZone] = useState<Zone | null>(null)
    const [zonesMeta, setZonesMeta] = useState<Meta>({ loading: false, error: null })
    const [zones, setZones] = useState([])

    const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
    const [ordersMeta, setOrdersMeta] = useState<Meta>({ loading: false, error: null })
    const [orders, setOrders] = useState([])

    const notificationCtx = useContext(NotificationModalContext)
    const authCtx = useContext(AuthContext)



    const fetch_products = async (token: string | null, page:number = 1) => {
        setProductsMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/items?page=${page}&&itemsPerPage=${pagination?.itemsPerPage}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setProductsMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (json.pagination) {
                    update_pagination!(json.pagination)
                }
                return setProducts(json.items)
            }
            return setProductsMeta({ loading: false, error: json.message })


        } catch (error) {
            return setProductsMeta({ loading: false, error: 'Something went wrong' })


        }
    }
    const fetch_product = async (id: string, token: string | null) => {
        setProductsMeta({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/admin/api/items/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setProductsMeta({ loading: false, error: null })
            if (response.status === 200) {
                console.log(json.item)
                return setCurrentProduct(json.item)
            }
            return setProductsMeta({ loading: false, error: json.message })


        } catch (error) {
            return setProductsMeta({ loading: false, error: 'Something went wrong' })


        }
    }
    const update_partial_product = async (json_patch: any, token: string | null) => {
        setUpdatingMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/items/${currentProduct?._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ values: json_patch }),
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
                window.history.pushState({}, '', `/admin/products/${json.item.slug}`);

                return setCurrentProduct(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })


        }
    }
    const delete_product = async (id: string, token: string | null) => {
        setProductsMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setProductsMeta({ loading: false, error: null })
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/products')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setProductsMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setProductsMeta({ loading: false, error: null })


        }
    }
    const upload_image = async (id: string, files: any, token: string | null, tag: string) => {
        setUpdatingMeta({ loading: true, error: null })

        try {
            const newForm = new FormData()
            for (const img of files) {
                console.log(img)
                newForm.append('image', img)
            }
            // files.forEach(img => ))
            const response = await fetch(`http://localhost:8000/admin/api/images/${id}/?type=upload&&tag=${tag}`, {
                method: 'PUT',
                body: newForm,
                headers: {
                    Authorization: "Bearer " + token,
                }
            })
            const json = await response.json()
            setUpdatingMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (tag === 'Product') {
                    return setCurrentProduct((prevState) => {
                        return { ...prevState!, images: json.item.images }
                    })
                } else {
                    return setCurrentCategory(json.item)
                }
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })
            return setUpdatingMeta({ loading: false, error: json.message })

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })


        }
    }
    const delete_image = async (id: string, image: string, token: string | null, tag: string) => {
        setUpdatingMeta({ loading: true, error: null })

        try {

            const response = await fetch(`http://localhost:8000/admin/api/images/${id}?type=delete&&tag=${tag}`, {
                method: 'PUT',
                body: JSON.stringify({ image: image }),
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setUpdatingMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (tag === 'Product') {
                    console.log(json.item)
                    return setCurrentProduct((prevState) => {
                        return { ...prevState!, images: json.item.images }
                    })
                } else {
                    return setCurrentCategory(json.item)
                }
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: json.message })


        } catch (error) {
            console.error(error)
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })


        }
    }



    const fetch_categories = async (token: string, page:number = 1) => {
        setCategoryMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/category?page=${page}&&itemsPerPage=${pagination?.itemsPerPage}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setCategoryMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (json.pagination) {
                    setPagination(json.pagination)
                }
                return setCategories(json.items)
            }
            return setCategoryMeta({ loading: false, error: json.message })


        } catch (error) {
            return setCategoryMeta({ loading: false, error: 'Something went wrong' })


        }
    }
    const fetch_category = async (id: string, token: string | null) => {
        setCategoryMeta({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/admin/api/category/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setCategoryMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setCurrentCategory(json.item)
            }
            return setCategoryMeta({ loading: false, error: json.message })


        } catch (error) {
            return setCategoryMeta({ loading: false, error: 'Something went wrong' })


        }
    }

    const delete_category = async (id: string, token: string | null) => {
        setCategoryMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setCategoryMeta({ loading: false, error: null })
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/category')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setCategoryMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setCategoryMeta({ loading: false, error: null })


        }
    }

    const update_partial_category = async (json_patch: any, token: string | null) => {
        setUpdatingMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/category/${currentCategory?._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ values: json_patch }),
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setUpdatingMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setCurrentCategory(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })
        }
    }
    const fetch_zones = async (token?: string, page:number = 1) => {


        setZonesMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones?page=${page}&&itemsPerPage=${pagination?.itemsPerPage}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setZonesMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (json.pagination) {
                    update_pagination!(json.pagination)
                }
                return setZones(json.items)
            }
            return setZonesMeta({ loading: false, error: json.message })


        } catch (error) {
            return setZonesMeta({ loading: false, error: 'Something went wrong' })


        }
    }
    const fetch_zone = async (id: string, token: string | null) => {
        setZonesMeta({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setZonesMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setCurrentZone(json.item)
            }
            return setZonesMeta({ loading: false, error: json.message })


        } catch (error) {
            return setZonesMeta({ loading: false, error: 'Something went wrong' })


        }
    }

    const delete_zone = async (id: string, token: string | null) => {
        setZonesMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setZonesMeta({ loading: false, error: null })
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/zones')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setZonesMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setZonesMeta({ loading: false, error: null })


        }
    }

    const update_partial_zone = async (json_patch: any, token: string | null) => {
        setUpdatingMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${currentZone?._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ values: json_patch }),
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
                return setCurrentZone(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })
        }
    }
    const fetch_orders = async (token: string,  page:number = 1) => {
        setOrdersMeta({ loading: true, error: null })
        console.log('hee')
        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders?page=${page}&&itemsPerPage=${pagination?.itemsPerPage}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setOrdersMeta({ loading: false, error: null })
            if (response.status === 200) {
                if (json.pagination) {
                    update_pagination!(json.pagination)
                }
                return setOrders(json.items)
            }
            return setOrdersMeta({ loading: false, error: json.message })


        } catch (error) {
            return setOrdersMeta({ loading: false, error: 'Something went wrong' })


        }
    }
    const fetch_order = async (id: string, token: string | null) => {
        setOrdersMeta({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/admin/api/orders/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setOrdersMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setCurrentOrder(json.item)
            }
            return setOrdersMeta({ loading: false, error: json.message })


        } catch (error) {
            return setOrdersMeta({ loading: false, error: 'Something went wrong' })


        }
    }

    const delete_order = async (id: string, token: string | null) => {
        setOrdersMeta({ loading: true, error: null })

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
            setOrdersMeta({ loading: false, error: null })
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/orders')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setOrdersMeta({ loading: false, error: null })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setOrdersMeta({ loading: false, error: null })


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

    const login = async (email: string, password: string) => {
        setAuthMeta((prevState) => { return { ...prevState, loading: true, error: null } })

        try {
            const response = await fetch(`http://localhost:8000/admin/login`, {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password }), headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            if (response.status === 200) {

                setAuthMeta({ user: json.user, token: json.token, loading: false, error: null })
                setIsLoggedIn(true)
                localStorage.setItem('uid', json.token)
                getMe(json.token)
                return history.push('/admin/products')
            }
            return setAuthMeta({ ...authMeta, loading: false, error: 'Your information is incorrect.' })

        } catch (error) {
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })


        }
    }

    const getMe = async (token: string) => {
        setAuthMeta((prevState) => { return { ...prevState, loading: true, error: null } })

        try {
            const response = await fetch(`http://localhost:8000/admin/me`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            if (response.status === 200) {
                setAuthMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                return setIsLoggedIn(true)
            }
            setIsLoggedIn(false)
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Your information is incorrect.' } })


        } catch (error) {
            setIsLoggedIn(false)
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }

    const update_pagination = async (data: Pagination) => {
        return setPagination(data)
    }
    const logout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('uid')
    }


    useEffect(() => {
        const uid = localStorage.getItem('uid')
        if (uid) {
            setIsLoggedIn(true)
            setAuthMeta((prevState => { return { ...prevState, token: uid.toString(), loading: true } }))
            // Why getMe() not able to get the new token
            getMe(uid)
        } else {
            setIsLoggedIn(false)
        }
        update_pagination(initialPagination)
    }, [])
    const adminContext = {
        fetch_products,
        fetch_product,
        update_partial_product,
        delete_product,
        productsMeta,
        products,
        currentProduct,
        categoryMeta,
        categories,
        currentCategory,
        fetch_categories,
        fetch_category,
        delete_category,
        update_partial_category,
        zones,
        currentZone,
        zonesMeta,
        fetch_zones,
        fetch_zone,
        delete_zone,
        update_partial_zone,
        orders,
        currentOrder,
        ordersMeta,
        fetch_orders,
        fetch_order,
        delete_order,
        change_order_status,

        upload_image,
        delete_image,
        updatingMeta,
        onLogin: login,
        onLogout: logout,
        getMe: getMe,
        isLoggedIn: isLoggedIn,
        authMeta,
        pagination,
        update_pagination,
        url: 'http://localhost:8000'
    }


    return <AdminContext.Provider value={adminContext}>
        {props.children}
    </AdminContext.Provider>
}


export default AdminContext