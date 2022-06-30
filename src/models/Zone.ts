export default interface Zone {
    _id: string;
    name: string
    zoneId:number
    governorate: string
    pickup: boolean,
    delivery: boolean,
    shipping: number,
    orders: any[],
    notes: string,
    duration: string,
    active: boolean
}