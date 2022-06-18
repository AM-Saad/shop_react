import CategoryInterface from './Category'

interface ProductResponse {
    attributes:[];
    category:{name:string, subCategory: string | null}
    createdAt: string;
    description:string;
    details:string;
    discount:string | number;
    images:string[];
    info:{
        initialQuanitity:number;
        price:number;
        purchasingPrice:number;
        quantity:number;
        refunded:number;
    }
    name:string;
    ratings:[]
    reviews:[]
    serial:number;
    sku:string;
    slug:string;
    units:[];
    updatedAt:string;
    _id:string;
    featured:boolean;
    popular:boolean;
}


export default ProductResponse