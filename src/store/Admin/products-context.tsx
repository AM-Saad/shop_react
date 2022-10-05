import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import { useHistory, useLocation } from "react-router-dom"

import ProductsType from '../../models/ProductsContext';
import ProductResponse, { ProductsMeta } from '../../models/ProductResponse';
import Pagination from '../../models/Pagination';
import Meta from '../../models/Meta';
import serialize from '../../util/serialize';
const initialPagination = {
    itemsPerPage: 4,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    lastPage: 1,
    nextPage: 2,
    prevPage: 0,
    total: 0,
    skip: 0,
}
const ProductsContext = React.createContext<ProductsType>({
    products: [],
    productsMeta: { loading: true, error: null, filters: {} },
    pagination: initialPagination,
    currentProduct: null,
    fetch_products: (token: string | null) => { },
    fetch_product: (id: string, token: string | null) => { },
    delete_product: (id: string, token: string | null) => { },
    update_partial_product: (json_patch: any, token: string | null) => { },
    upload_image: (id: string, files: any, token: string | null, tag: string) => { },
    delete_image: (id: string, image: string, token: string | null, tag: string) => { },
    updatingMeta: { loading: true, error: null },
    update_meta: (data: any) => { },
    update_pagination: (data: Pagination) => { }
})

export const ProductsContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    let history = useHistory()


    const [productsMeta, setProductsMeta] = useState<ProductsMeta>({ loading: false, error: null, filters: {} })
    const [pagination, setPagination] = useState(initialPagination)
    const [products, setProducts] = useState([])
    const [currentProduct, setCurrentProduct] = useState<ProductResponse | null>(null)

    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })

    const notificationCtx = useContext(NotificationModalContext)
    const [searchMeta, setSearchMeta] = useState<Meta>({ loading: false, error: null })



    const fetch_products = async (token: string | null) => {
        setProductsMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        const { name, featured, popular, id, slug, min, max, minQty, maxQty, category } = productsMeta.filters
        const params = new Map<string, string | string[]>();
        if (name) params.set("name", name);
        if (featured !== null && featured !== undefined) params.set("featured", featured);
        if (popular !== null && popular !== undefined) params.set("popular", popular);
        if (id) params.set("_id", id);
        if (slug) params.set("slug", slug);
        if (min) params.set("min", min);
        if (max) params.set("max", max);
        if (minQty) params.set("minQty", minQty);
        if (maxQty) params.set("maxQty", maxQty);
        if (category && category?.length > 0) {
            params.set("category", category.map((s) => s.toString()));
        }
        const paramsUrl = serialize(params)

        try {
            const response = await fetch(`http://localhost:8000/admin/api/items?page=${pagination.currentPage}&&itemsPerPage=${pagination?.itemsPerPage}&&${paramsUrl}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                if (json.pagination) {
                    setPagination(json.pagination)
                }
                return setProducts(json.items)
            }
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))


        } catch (error) {
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))

        }
    }
    const fetch_product = async (id: string, token: string | null) => {
        setProductsMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        try {
            const response = await fetch(`http://localhost:8000/admin/api/items/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                if (json.pagination) {
                    setProductsMeta((prevState => {
                        return { ...prevState, pagination: json.pagination }
                    }))
                }
                return setCurrentProduct(json.item)
            }
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))

        } catch (error) {
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))


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
        setProductsMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))

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
            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/products')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))


        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setProductsMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))


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
                    // return setCurrentCategory(json.item)
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
    const update_pagination = async (data: Pagination) => {
        return setPagination(data)
    }
    const update_meta = async (data: any) => {
        setPagination(prevState => { return { ...prevState, currentPage: 1 } })
        console.log(data)
        setProductsMeta(prevState => { return { ...prevState, ...data } })
    }
    const logout = () => {
        localStorage.removeItem('uid')
    }


    useEffect(() => {
        update_pagination(initialPagination)
    }, [])
    const ctx = {
        fetch_products,
        fetch_product,
        update_partial_product,
        delete_product,
        productsMeta,
        pagination,
        products,
        currentProduct,
        upload_image,
        delete_image,
        updatingMeta,
        onLogout: logout,
        update_pagination,
        search_products,
        searchMeta,
        update_meta
    }


    return <ProductsContext.Provider value={ctx}>
        {props.children}
    </ProductsContext.Provider>
}


export default ProductsContext