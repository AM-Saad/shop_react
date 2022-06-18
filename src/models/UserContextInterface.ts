import { Cart } from './Cart'
import Meta from './Meta'
import Product from './ProductResponse'
import Pagination from './Pagination'

export type User = {
    cart: string;
    email: string;
    name: string
    orders: []
    password: string
    signUpToken: string | null
    _id: string
}

export type AuthMeta = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null
}

export interface UserContextInterface {
    url: string;
    isLoggedIn: boolean;
    authMeta: AuthMeta;
    pagination: Pagination
    update_pagination?: (query: Pagination) => void


    cart?: Cart | null;
    onLogin: (email: string, password: string) => void,
    onLogout: () => void,
    getMe: (token: string) => void,
    get_cart?: (cartId?: string | null) => void
    cartMeta?: Meta,
    add_to_cart?: (payload: any) => void
    update_cart_item?: (productId: string, quantity: number) => void
    toggle_cart?: (state: boolean) => void
    delete_cart_item?: (productId: string) => void
    cartIsOpen?: boolean
    search_products?: (query: string) => void
    search_list?: Product[]
}

export default UserContextInterface