import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import AuthContext from "../User/user_context"
import { useHistory, useLocation } from "react-router-dom"

import AdminContextType from '../../models/AdminContext';
import ProductResponse, { ProductsMeta } from '../../models/ProductResponse';
import Pagination from '../../models/Pagination';
import Category, { CategoryMeta } from '../../models/Category';
import Meta from '../../models/Meta';
import { AuthMeta } from '../../models/UserContextInterface'
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
const AdminContext = React.createContext<AdminContextType>({
    categories: [],
    categoryMeta: { loading: true, error: null, filters: {} },
    categoryPagination: initialPagination,
    currentCategory: null,
    fetch_categories: (token: string, page?: number) => { },
    fetch_category: (id: string, token: string | null) => { },
    delete_category: (id: string, token: string | null) => { },
    update_partial_category: (json_patch: any, token: string | null) => { },
    updatingMeta: { loading: true, error: null },
    upload_category_image: (id: string, files: any, token: string | null, tag: string) => { },
    delete_category_image: (id: string, image: string, token: string | null, tag: string) => { },
    url: 'http://localhost:8000',
    isLoggedIn: false,
    authMeta: { user: null, token: null, loading: false, error: null },
    onLogout: () => { },
    onLogin: (email: string, password: string) => { },
    getMe: (token: string) => { },
    update_category_pagination: (data: Pagination) => { },
    update_category_meta: (data: any) => { },
    update_partial_admin: (json_patch: any, token: string | null) => { },
})

export const AdminContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    let history = useHistory()
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [authMeta, setAuthMeta] = useState<AuthMeta>({ user: null, token: null, loading: false, error: null })
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
    const [categoryMeta, setCategoryMeta] = useState<CategoryMeta>({ loading: false, error: null, filters: {} })
    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })
    const [categories, setCategories] = useState([])
    const [categoryPagination, setCategoryPagination] = useState(initialPagination)


    const notificationCtx = useContext(NotificationModalContext)
    const [searchMeta, setSearchMeta] = useState<Meta>({ loading: false, error: null })


    const upload_category_image = async (id: string, files: any, token: string | null, tag: string) => {
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
                return setCurrentCategory(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })
            return setUpdatingMeta({ loading: false, error: json.message })

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })


        }
    }
    const delete_category_image = async (id: string, image: string, token: string | null, tag: string) => {
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
                return setCurrentCategory(json.item)
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setUpdatingMeta({ loading: false, error: json.message })


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })


        }
    }



    const fetch_categories = async (token: string) => {
        setCategoryMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        const { active, featured } = categoryMeta.filters

        const params = new Map<string, string | string[]>();
        if (featured !== null && featured !== undefined) params.set("featured", featured);
        if (active !== null && active !== undefined) params.set("active", active);
        const paramsUrl = serialize(params)
        try {
            const response = await fetch(`http://localhost:8000/admin/api/category?page=${categoryPagination.currentPage}&&itemsPerPage=${categoryPagination?.itemsPerPage}&&${paramsUrl}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                if (json.pagination) {
                    update_category_pagination(json.pagination)
                }
                return setCategories(json.items)
            }

            return setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))
        } catch (error) {
            return setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))

        }
    }
    const fetch_category = async (id: string, token: string | null) => {
        setCategoryMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))


        try {
            const response = await fetch(`http://localhost:8000/admin/api/category/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))

            if (response.status === 200) {
                return setCurrentCategory(json.item)
            }
            setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))

        } catch (error) {
            return setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))
        }
    }

    const delete_category = async (id: string, token: string | null) => {
        setCategoryMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
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
            setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/category')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            return setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setCategoryMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))

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

    const update_partial_admin = async (json_patch: any, token: string | null) => {
        setAuthMeta((prevState) => { return { ...prevState, loading: true, error: null } })


        try {
            const response = await fetch(`http://localhost:8000/admin/settings/info/${authMeta.user?._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ values: json_patch }),
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()

            notificationCtx.showModal({ title: json.messageType === 'success' ? 'Success' : 'Error', message: json.message })
            if (response.status === 200) {
              return  setAuthMeta((prevState) => { return { ...prevState, loading: false, error: null, user: json.user } })
            } else {
                return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: "Something went wrong" } })

            }



        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: "Something went wrong" } })

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

    const search_products = async (query: string): Promise<ProductResponse[]> => {
        setSearchMeta((prevState) => { return { ...prevState, loading: true, error: null } })

        try {
            const response = await fetch(`http://localhost:8000/search?q=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const json = await response.json()
            if (response.status === 200) {
                setSearchMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                const items: ProductResponse[] = json.items
                return items
            }
            setSearchMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong...' } })
            return []

        } catch (error) {
            setSearchMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })
            return []

        }
    }
    const update_category_pagination = async (data: Pagination) => {
        return setCategoryPagination(data)

    }


    const update_category_meta = async (data: any) => {
        setCategoryPagination(prevState => { return { ...prevState, currentPage: 1 } })
        console.log(data)
        setCategoryMeta(prevState => { return { ...prevState, ...data } })
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
        update_category_pagination(initialPagination)
    }, [])
    const adminContext = {


        categoryMeta,
        categories,
        currentCategory,
        fetch_categories,
        fetch_category,
        delete_category,
        update_partial_category,
        categoryPagination,
        upload_category_image,
        delete_category_image,
        updatingMeta,
        onLogin: login,
        onLogout: logout,
        getMe,
        isLoggedIn: isLoggedIn,
        authMeta,
        update_category_pagination,
        search_products,
        searchMeta,
        update_category_meta,
        update_partial_admin,
        url: 'http://localhost:8000'
    }


    return <AdminContext.Provider value={adminContext}>
        {props.children}
    </AdminContext.Provider>
}


export default AdminContext