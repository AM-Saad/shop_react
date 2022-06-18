import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import AuthContext from "../User/user_context"
import { useHistory } from "react-router-dom"

import AdminContextInterface from '../../models/AdminContextInterface';
import ProductResponse from '../../models/ProductResponse';
import Category from '../../models/Category';
import Meta from '../../models/Meta';
import { AuthMeta } from '../../models/AuthContextInterface'

const AdminContext = React.createContext<AdminContextInterface>({
    products: [],
    productsMeta: { loading: false, error: null },
    currentProduct: null,
    fetch_products: (token: string | null) => { },
    fetch_product: (id: string, token: string | null) => { },
    delete_product: (id: string, token: string | null) => { },
    update_partial_product: (json_patch: any, token: string | null) => { },
    categories: [],
    categoryMeta: { loading: false, error: null },
    currentCategory: null,
    fetch_categories: (token: string | null) => { },
    fetch_category: (id: string, token: string | null) => { },
    delete_category: (id: string, token: string | null) => { },
    update_partial_category: (json_patch: any, token: string | null) => { },
    updatingMeta: { loading: false, error: null },
    upload_image: (id: string, files: any, token: string | null, tag: string) => { },
    delete_image: (id: string, image: string, token: string | null, tag: string) => { },
    url: 'http://localhost:8000',
    isLoggedIn: false,
    authMeta: { user: null, token: null, loading: false, error: null },
    onLogin: (email: string, password: string) => { },
    onLogout: () => { },
    getMe: (token: string) => { },

})

export const AdminContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [authMeta, setAuthMeta] = useState<AuthMeta>({ user: null, token: null, loading: false, error: null })
    let history = useHistory()

    const [productsMeta, setProductsMeta] = useState<Meta>({ loading: false, error: null })
    const [products, setProducts] = useState([])
    const [currentProduct, setCurrentProduct] = useState<ProductResponse | null>(null)

    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [categoryMeta, setCategoryMeta] = useState<Meta>({ loading: false, error: null })
    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })
    const [categories, setCategories] = useState([])
    const notificationCtx = useContext(NotificationModalContext)
    const authCtx = useContext(AuthContext)


    const fetch_products = async (token: string | null) => {
        setProductsMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/items`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setProductsMeta({ loading: false, error: null })
            if (response.status === 200) {
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
                    return setCurrentProduct(json.item)
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
                    return setCurrentProduct(json.item)
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



    const fetch_categories = async (token: string | null) => {
        setCategoryMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/admin/api/category`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setCategoryMeta({ loading: false, error: null })
            if (response.status === 200) {
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
                console.log(json.item)
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
                console.log(json.item)
                return setCurrentCategory(json.item)
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
    }, [])
    const adminContext = {
        fetch_products, fetch_product, update_partial_product, delete_product, productsMeta, products, currentProduct,
        categoryMeta, categories, currentCategory, fetch_categories, fetch_category, delete_category, update_partial_category, upload_image, delete_image, updatingMeta,
        onLogin: login, onLogout: logout, getMe: getMe, isLoggedIn: isLoggedIn, authMeta: authMeta, url: 'http://localhost:8000'
    }


    return <AdminContext.Provider value={adminContext}>
        {props.children}
    </AdminContext.Provider>
}


export default AdminContext