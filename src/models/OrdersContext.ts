
import Order, { OrdersMeta } from './Order';
import PaginationType from './Pagination';

export interface OrdersContext {
    orders: Order[],
    ordersMeta: OrdersMeta,
    currentOrder: Order | null,
    pagination: PaginationType,

    fetch_orders: (token: string) => void,
    fetch_order: (id: string, token: string | null) => void,
    delete_order: (id: string, token: string | null) => void,
    change_order_status: (status: number, token: string | null) => void,
    update_meta:(data: any) => void
    update_pagination:(data: any) => void
}

export default OrdersContext