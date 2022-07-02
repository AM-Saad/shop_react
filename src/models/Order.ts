import { SelectedAttribute } from './Attribute'


export enum OrderStatus {
    Panding = 1,
    Confirmed = 2,
    Delivered = 3,
    Canceled = 4,
}

export const ORDER_STATUS_LABELS = new Map<OrderStatus, string>([
    [OrderStatus.Panding, "Panding"],
    [OrderStatus.Confirmed, "Confirmed"],
    [OrderStatus.Delivered, "Delivered"],
    [OrderStatus.Canceled, "Canceled"],
]);

export const getOrderStatusColor = (
    bundleStatus: OrderStatus | undefined
) => {
    if (bundleStatus === undefined) return "gray";

    if (bundleStatus === OrderStatus.Panding) {
        return "gray";
    } else if (bundleStatus === OrderStatus.Confirmed) {
        return "yellow";
    } else if (bundleStatus === OrderStatus.Delivered) {
        return "green";
    } else {
        return "red";
    }
};



export default interface Order {
    createdAt: string
    date: string
    items: OrderItem[]
    leadSource: string
    order_info: OrderInfo
    serialNo: number
    sessionId: string
    status: OrderStatus
    totalPrice: number
    updatedAt: string
    _id: string
}

export interface OrderInfo {
    billing_details: {
        email: string
        first_name: string
        last_name: string
        phone: string
    }
    shipping_details: {
        apartment: string
        area: { name: string, zoneId: number }
    }
    floor: string
    price: number
    street: string
}

export interface OrderItem {
    attributes: SelectedAttribute[]
    category: string
    id: string
    name: string
    price: number
    quantity: number
    total: number
    _id: string
}