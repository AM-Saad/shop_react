import React, { useEffect, useReducer, useState, useContext } from 'react'

import UploadImage from '../../UI/UploadImage'
import AdminItemGallery from '../../UI/AdminItemGallery'
import ToggleBtn from '../../UI/ToggleBtn'
import Product from '../../../models/Product'
import AttributesContainer from '../Products/AttributesContainer'
import AdminContext from '../../../store/Admin/admin-context'
import Attribute from '../../../models/Attribute'

enum ActionKind {
    USER_INPUT = 'USER_INPUT',
    INPUT_BLUR = 'INPUT_BLUR',
}

type Action = {
    type: ActionKind,
    value: string
}

interface InputState {
    value: string;
    isValid: boolean;
}

const inputReducer = (state: InputState, action: Action) => {
    if (action.type === ActionKind.USER_INPUT) {
        return { value: action.value, isValid: action.value.length > 0 }
    }
    if (action.type === ActionKind.INPUT_BLUR) {
        return { value: state.value, isValid: state.value.length > 0 }

    }
    return state
}

const NewProductForm: React.FC<{ onNewProduct: (newProduct: Product) => void }> = (props) => {

    const [nameState, dispatchNameState] = useReducer(inputReducer, { value: '', isValid: false })
    const [priceState, dispatchPriceState] = useReducer(inputReducer, { value: '', isValid: false })
    const [quantityState, dispatchQuantityState] = useReducer(inputReducer, { value: '', isValid: false })
    const [descState, dispatchDescState] = useReducer(inputReducer, { value: '', isValid: false })
    const [detailsState, dispatchDetailsState] = useReducer(inputReducer, { value: '', isValid: false })
    const [featured, setFeatured] = useState<boolean>(true);
    const [popular, setPopular] = useState<boolean>(true);
    const [category, setCategory] = useState<{ name: string, subCategory: string | null }>({ name: 'Default', subCategory: null });
    const [subCategory, setSubCategory] = useState<string[] | undefined>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([])
    const [imageFile, setImageFile] = useState<any[]>([])
    const [imageWarning, setImageWarning] = useState<string | null>(null)
    const [imageFilePreview, setImageFilePreview] = useState<any[]>([])
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const adminCtx = useContext(AdminContext)
    const { categories } = adminCtx
    const childFunc = React.useRef<any>(null)

    const nameChangeHandler = (e: any) => {
        dispatchNameState({ type: ActionKind.USER_INPUT, value: e.target.value })
    }
    const checkNameValidity = (e: any) => {
        dispatchNameState({ type: ActionKind.INPUT_BLUR, value: '' })

    }
    const priceChangeHandler = (e: any) => {
        dispatchPriceState({ type: ActionKind.USER_INPUT, value: e.target.value })
    }
    const checkPriceValidity = (e: any) => {
        dispatchPriceState({ type: ActionKind.INPUT_BLUR, value: '' })
    }
    const quantityChangeHandler = (e: any) => {
        dispatchQuantityState({ type: ActionKind.USER_INPUT, value: e.target.value })
    }
    const checkQuantitQValidity = (e: any) => {
        dispatchQuantityState({ type: ActionKind.INPUT_BLUR, value: '' })
    }
    const descriptionChangeHandler = (e: any) => {
        dispatchDescState({ type: ActionKind.USER_INPUT, value: e.target.value })
    }
    const checkDescriptionValidity = (e: any) => {
        dispatchDescState({ type: ActionKind.INPUT_BLUR, value: '' })
    }
    const detailsChangeHandler = (e: any) => {
        dispatchDetailsState({ type: ActionKind.USER_INPUT, value: e.target.value })
    }

    const checkDetailsValidity = (e: any) => {
        dispatchDescState({ type: ActionKind.INPUT_BLUR, value: '' })
    }

    const imageSelectHandler = (files: any[]) => {

        if ((imageFile.length + files.length) <= 5) {
            let allFiles = [...files]
            const returnedFiles: any[] = []
            for (const file of allFiles) {
                const uid = Math.random()
                returnedFiles.push({ image: file, id: uid })
            }
            setImageFile((prevState: any[]) => {
                return prevState.concat(returnedFiles)
            })
            return setImageWarning(null)
        }
        setImageWarning('Maximum images is (5)')
    }
    const cancelUploadImage = () => {
        childFunc.current()
    }
    const deleteImageHandler = (id: string) => {
        setImageFile((prevState: any[]) => {
            if ((prevState.length - 1) === 0) {
                cancelUploadImage()
            }
            return prevState.filter(i => i.id !== id)
        })

    }

    const selectCategoryHandler = (event: any) => {
        const category = categories.find(category => category.name.toLowerCase() === event.target.value.toLowerCase())
        setCategory({ name: category?.name ?? '', subCategory: null })
        setSubCategory(category?.subCategory)
    }
    const selectSubCategoryHandler = (event: any) => {
        const { value } = event.target; // <-- moved outside asynchronous context
        setCategory((prevState) => {
            return Object.assign({}, prevState, { subCategory: value })
        })
    }
    const updateAttributes = (attributes: Attribute[]) => {
        console.log(updateAttributes)
        setAttributes(attributes)

    }

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const newProduct = {
            name: nameState.value,
            price: priceState.value,
            quantity: quantityState.value,
            description: descState.value,
            details: detailsState.value,
            images: imageFile,
            featured: featured,
            popular: popular,
            category: category,
            attributes: attributes
        }
        props.onNewProduct(newProduct);
    };

    const { isValid: nameValid } = nameState
    const { isValid: priceValid } = priceState
    const { isValid: descValid } = descState
    const { isValid: quantityValid } = quantityState

    useEffect(() => {
        setFormIsValid(nameValid && priceValid && descValid && quantityValid && (attributes.length === 0 || attributes.find(i => i.options.length === 0 || i.name === '') === undefined))

        if (imageFile.length === 0) {
            setImageFilePreview([])
            return
        }

        let previwImages: any = []
        for (const item of imageFile) {
            const objectUrl = URL.createObjectURL(item.image)
            previwImages.push({ image: objectUrl, id: item.id })
        }
        setImageFilePreview(previwImages)

    }, [nameValid, priceValid, descValid, quantityValid, imageFile, categories, attributes])
    return (
        <>
            <form onSubmit={submitHandler} >
                <div>
                    <UploadImage childFunc={childFunc} onSelectImage={imageSelectHandler} />
                    <AdminItemGallery images={imageFilePreview} onDeleteImage={deleteImageHandler} />
                    {imageWarning && <p className='text-yellow-600'>{imageWarning}</p>}

                </div>
                <div className="grid sm:grid-cols-2">
                    <div>

                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="name" >Name</label>
                            <input className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={nameChangeHandler} onBlur={checkNameValidity} type="text" name="name" placeholder='Great Book...' />
                        </div>
                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="price" >Price</label>
                            <input className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={priceChangeHandler} onBlur={checkPriceValidity} type="number" name="price" min="0" placeholder='1.99' />
                        </div>
                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="quantity" >Quantity</label>
                            <input className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={quantityChangeHandler} onBlur={checkQuantitQValidity} type="number" name="quantity" min="0" placeholder='5' />
                        </div>
                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="desc" >Description</label>
                            <textarea className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={descriptionChangeHandler} onBlur={checkDescriptionValidity} name="desc" placeholder='Describe you product'></textarea>
                        </div>
                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="desc" >Details</label>
                            <textarea className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={detailsChangeHandler} onBlur={checkDetailsValidity} name="desc" placeholder='Add product details'></textarea>
                        </div>

                    </div>
                    <div>
                        <div className="flex items-center justify-between p-4 mb-3 text-left border-1 border-b-2 border-gray">

                            <div className=''>
                                <label htmlFor="desc" className='block mb-2'>Featured</label>
                                <ToggleBtn value={featured} onSetValue={setFeatured}></ToggleBtn>
                            </div>
                            <div className=''>
                                <label htmlFor="desc" className='block mb-2'>Popular</label>
                                <ToggleBtn value={popular} onSetValue={setPopular}></ToggleBtn>
                            </div>
                        </div>
                        <div className='p-4 mb-3 text-left'>
                            <label htmlFor="desc" >Category</label>
                            <select className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={selectCategoryHandler} name="" id="">
                                <option value='Default'>Default</option>
                                {categories.map((category) => <option value={category.name}>{category.name}</option>)}
                            </select>
                        </div>
                        {subCategory && subCategory.length > 0 && <div className='p-4 mb-3 text-left'>
                            <label htmlFor="desc" >Sub Category</label>
                            <select className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={selectSubCategoryHandler} name="" id="">
                                <option >Choose Sub Category</option>

                                {subCategory.map((category) => <option value={category}>{category}</option>)}
                            </select>
                        </div>}
                        <AttributesContainer updateAttributes={(attributes: Attribute[]) => updateAttributes(attributes)} />

                    </div>

                    {formIsValid && <button type="submit" className='w-36 p-3 bg-green-400 rounded hover:opacity-50'>Add</button>}
                    {!formIsValid && <button type="button" className='w-36 p-3 bg-green-400 rounded opacity-50 '>Add</button>}
                </div>


            </form>
        </>
    )
}

export default NewProductForm