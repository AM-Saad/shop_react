import ProductResponse, { ProductsMeta } from './ProductResponse'
import Meta from './Meta';
import PaginationType from './Pagination';

export interface ProjectContext {
    products: ProductResponse[];
    currentProduct: ProductResponse | null;
    productsMeta: ProductsMeta;
    pagination:PaginationType
    fetch_products: (token: string | null) => void,
    fetch_product: (id: string, token: string | null) => void,
    delete_product: (id: string, token: string | null) => void,
    update_partial_product: (json_patch: any, token: string | null) => void,
    upload_image: (id: string, files: any, token: string | null, tag: string) => void,
    delete_image: (id: string, image: string, token: string | null, tag: string) => void,
    updatingMeta: Meta,
    update_meta:(data: any) => void
    update_pagination:(data: any) => void
}

export default ProjectContext