import Product from './Product';
import ProductResponse from './ProductResponse';
import Category from './Category';
import Zone from './Zone';
import Order from './Order';
import Meta from './Meta';
import AuthContext from './UserContextInterface';





export interface AdminContextInterface extends AuthContext {
    products: ProductResponse[];
    currentProduct:ProductResponse | null;
    productsMeta:Meta;
    categories: Category[];
    currentCategory:Category | null;
    categoryMeta:Meta;
    updatingMeta:Meta;
    fetch_products: (token: string | null, page:number) => void,
    fetch_product: (id: string, token: string| null) => void,
    delete_product: (id: string, token: string | null) => void,
    update_partial_product: (json_patch: any, token: string | null) => void,
    upload_image: (id: string, files: any, token: string | null, tag:string) => void,
    delete_image: (id: string, image: string, token: string | null, tag:string) => void,
    fetch_categories:(token: string, page: number) => void,
    fetch_category: (id: string, token: string| null) => void,
    delete_category: (id: string, token: string | null) => void,
    update_partial_category: (json_patch: any, token: string | null) => void,


    zones: Zone[],
    zonesMeta: Meta,
    currentZone: Zone | null,
    fetch_zones: (token?: string, page?: number) => void,
    fetch_zone: (id: string, token: string | null) => void,
    delete_zone: (id: string, token: string | null) => void,
    update_partial_zone: (json_patch: any, token: string | null) => void,


    orders: Order[],
    ordersMeta: Meta,
    currentOrder: Order | null,
    fetch_orders: (token: string, page:number) => void,
    fetch_order: (id: string, token: string | null) => void,
    delete_order: (id: string, token: string | null) => void,
    change_order_status: (status: number, token: string | null) => void,
    
}

export default AdminContextInterface