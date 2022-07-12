import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom"
import { UserContextInterface, AuthMeta } from '../../models/UserContextInterface'
import Meta from '../../models/Meta'
import { Cart } from '../../models/Cart'
import ProductResponse from '../../models/ProductResponse'
import Pagination from '../../models/Pagination'
import Checkout from '../../models/Checkout'

const initialPagination = {
    itemsPerPage: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    lastPage: 1,
    nextPage: 2,
    prevPage: 0,
    total: 0,
    skip: 0
}

const UserContext = React.createContext<UserContextInterface>({
    url: 'http://localhost:8000',
    isLoggedIn: false,
    authMeta: { user: null, token: null, loading: false, error: null },
    pagination: initialPagination,
    update_pagination: (data: Pagination) => { },
    cart: null,
    onLogin: (email: string, password: string) => { },
    onLogout: () => { },
    getMe: (token: string) => { },
    cartMeta: { loading: false, error: null },
    get_cart: () => { },
    add_to_cart: (payload: any) => { },
    toggle_cart: (state: boolean) => { },
    update_cart_item: (productId: string, quantity: number) => { },
    delete_cart_item: (productId: string) => { },
    checkout: (payload: Checkout) => { },
    checkoutMeta: { loading: false, error: null },
    search_products: (query: string) => null,
    searchMeta: { loading: false, error: null },
    zonesMeta: { loading: true, error: null },
    fetch_zones: () => { },
    zones: []



})

export const UserContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [authMeta, setAuthMeta] = useState<AuthMeta>({ user: null, token: null, loading: false, error: null })
    const [cartMeta, setCartMeta] = useState<Meta>({ loading: false, error: null })
    const [searchMeta, setSearchMeta] = useState<Meta>({ loading: false, error: null })
    const [pagination, setPagination] = useState<Pagination>(initialPagination)
    const [cartIsOpen, setCartIsOpen] = useState<boolean>(false)
    const [cart, setCart] = useState<Cart | null>(null)
    const [checkoutMeta, setCheckoutMeta] = useState<Meta>({ loading: false, error: null })
    const [zonesMeta, setZonesMeta] = useState<Meta>({ loading: false, error: null })
    const [zones, setZones] = useState([])

    let history = useHistory()


    const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
        setAuthMeta({ ...authMeta, loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/auth/signup`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password: password, confirmPassword }), headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            if (response.status === 201) {
                setAuthMeta({ ...authMeta, loading: false, error: null })
                return history.push('/login')

            }

            return setAuthMeta({ ...authMeta, loading: false, error: json.message })

        } catch (error) {
            return setAuthMeta((prevState) => { return { ...prevState, loading: true, error: 'Something went wrong.' } })

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
                return history.push('/')
            }
            return setAuthMeta({ ...authMeta, loading: false, error: 'Your information is incorrect.' })

        } catch (error) {
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })


        }
    }

    const getMe = async (token: string) => {
        setAuthMeta((prevState) => { return { ...prevState, loading: true, error: null } })

        try {
            const response = await fetch(`http://localhost:8000/auth/me`, {
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
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Your information is incorrect.' } })


        } catch (error) {
            return setAuthMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }
    const get_cart = async () => {
        setCartMeta((prevState) => { return { ...prevState, loading: true, error: null } })
        const cardId = localStorage.getItem('cid')

        try {
            const response = await fetch(`http://localhost:8000/cart?cart=${cardId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                }
            })
            const json = await response.json()
            if (response.status === 200) {
                setCartMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                return setCart(json.cart)
            }
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong, we cannot find your cart...' } })

        } catch (error) {
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }
    const add_to_cart = async (payload: any) => {
        setCartMeta((prevState) => { return { ...prevState, loading: true, error: null } })
        const cid = localStorage.getItem('cid')

        try {
            const response = await fetch(`http://localhost:8000/cart/${payload.productId}?cart=${cid}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ attributes: payload.attributes, quantity: payload.quantity })
            })
            const json = await response.json()
            if (response.status === 200) {
                setCartMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                return setCart(json.cart)
            }
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong, we cannot find your cart...' } })

        } catch (error) {
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }
    const update_cart_item = async (productId: string, quantity: number) => {
        setCartMeta((prevState) => { return { ...prevState, loading: true, error: null } })
        const cid = localStorage.getItem('cid')

        try {
            const response = await fetch(`http://localhost:8000/cart/${productId}?cart=${cid}&&qty=${quantity}`, {
                method: 'Put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
            })
            const json = await response.json()
            if (response.status === 200) {
                setCartMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                console.log(cart)
                setCart(json.cart)
                return setCartIsOpen(true)
            }
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong, we cannot find your cart...' } })

        } catch (error) {
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }
    const delete_cart_item = async (productId: string) => {
        setCartMeta((prevState) => { return { ...prevState, loading: true, error: null } })
        const cid = localStorage.getItem('cid')

        try {
            const response = await fetch(`http://localhost:8000/cart/${productId}?cart=${cid}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
            })
            const json = await response.json()
            if (response.status === 200) {
                setCartMeta((prevState) => { return { ...prevState, user: json.user, loading: false, error: null } })
                return setCart(json.cart)
            }
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong, we cannot find your cart...' } })

        } catch (error) {
            return setCartMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

        }
    }

    const checkout = async (payload: Checkout) => {
        setCheckoutMeta((prevState) => { return { ...prevState, loading: true, error: null } })
        const cid = localStorage.getItem('cid')

        try {
            const response = await fetch(`http://localhost:8000/checkout?cart=${cid}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(payload)
            })
            const json = await response.json()

            if (response.status === 200) {
                setCart((prevState) => { return { ...prevState!, items: [] } })

                return history.push(`/order/${json.order.serialNo}`)

            }
            return setCheckoutMeta((prevState) => { return { ...prevState, loading: false, error: json.message } })

        } catch (error) {
            console.log(error)
            return setCheckoutMeta((prevState) => { return { ...prevState, loading: false, error: 'Something went wrong.' } })

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

    const fetch_zones = async () => {
        setZonesMeta({ loading: true, error: null })

        try {
            const response = await fetch(`http://localhost:8000/zones`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setZonesMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setZones(json.items)
            }
            return setZonesMeta({ loading: false, error: json.message })

        } catch (error) {
            return setZonesMeta({ loading: false, error: 'Something went wrong' })
        }
    }
    const update_pagination = async (data: Pagination) => {
        return setPagination(data)
    }
    const logout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('uid')
    }
    const toggle_cart = (state: boolean) => {
        return setCartIsOpen(state)
    }



    const authContext = {
        onLogin: login,
        onLogout: logout,
        onSignup: signup,
        getMe,
        get_cart,
        add_to_cart,
        cart,
        cartMeta,
        toggle_cart,
        update_cart_item,
        delete_cart_item,
        cartIsOpen,
        search_products,
        searchMeta,
        isLoggedIn: isLoggedIn,
        authMeta,
        checkoutMeta,
        pagination,
        update_pagination,
        checkout,
        zones,
        fetch_zones,
        zonesMeta,
        url: 'http://localhost:8000'
    }

    useEffect(() => {
        const uid = localStorage.getItem('uid')
        const cid = localStorage.getItem('cid')
        if (uid) {
            setIsLoggedIn(true)
            setAuthMeta((prevState => { return { ...prevState, token: uid.toString(), loading: true } }))
            // Why getMe() not able to get the new token
            getMe(uid)
        } else {
            setIsLoggedIn(false)
        }
        get_cart()

    }, [])

    return <UserContext.Provider value={authContext}>
        {props.children}
    </UserContext.Provider>
}


export default UserContext