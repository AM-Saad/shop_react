import Product from './Product';
import Category, { CategoryMeta } from './Category';
import Meta from './Meta';
import UserContext from './UserContextInterface';

import PaginationType from './Pagination';




export interface AdminContext extends UserContext {

    categories: Category[];
    currentCategory: Category | null;
    categoryMeta: CategoryMeta;
    fetch_categories: (token: string) => void,
    fetch_category: (id: string, token: string | null) => void,
    delete_category: (id: string, token: string | null) => void,
    update_partial_category: (json_patch: any, token: string | null) => void,
    updatingMeta: Meta;
    categoryPagination: PaginationType
    update_category_pagination: (data: PaginationType) => void
    upload_category_image: (id: string, files: any, token: string | null, tag: string) => void,
    delete_category_image: (id: string, image: string, token: string | null, tag: string) => void,
    update_category_meta: (data: any) => void
    update_partial_admin: (json_patch: any, token: string | null) => void,

}

export default AdminContext