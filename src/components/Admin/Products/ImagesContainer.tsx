import { useState, useEffect, useRef, useId, useContext } from 'react'
import UploadImage from '../../UI/UploadImageInput'
import AdminItemGallery from '../../UI/AdminItemGallery'
import AdminContext from '../../../store/Admin/admin-context'
import ProductsContext from '../../../store/Admin/products-context'
import ProductResponse from '../../../models/ProductResponse'

type DisplayedImages = {
    id: string
    image: string
    isNew?: boolean
}

const Images: React.FC<{ product: ProductResponse }> = ({ product }) => {

    const id: string = useId();

    const adminCtx = useContext(AdminContext)
    const productsCtx = useContext(ProductsContext)
    const { token } = adminCtx.authMeta
    const { updatingMeta } = adminCtx

    const [imagesToUpload, setImagesToUpload] = useState<any[]>([])
    const [imagesToDisplay, setImagesToDisplay] = useState<DisplayedImages[]>([])

    const cancelUpload = useRef<any>(null)
    const cleanInputValues = useRef<any>(null)

    const imageSelectHandler = (files: any) => {

        setImagesToUpload((prevState) => { return [...prevState, ...files] })
        let imagesUrls: DisplayedImages[] = []
        for (let i = 0; i < files.length; i++) {
            const objectUrl: string = URL.createObjectURL(files.item(i))
            imagesUrls.push({ id: id + imagesToUpload.length + 1, image: objectUrl, isNew: true })
        }
        setImagesToDisplay((prevState) => prevState.concat(imagesUrls))

    }

    const cancelUploadImages = () => {
        setImagesToUpload([])
        cancelUpload.current()
        const images = convertImages()
        setImagesToDisplay(images)
    }

    const deleteImageHandler = (id: string, isNew: boolean) => {

        if (!isNew) {
            return productsCtx.delete_image(product._id, id, token, 'Product')
        }

        setImagesToDisplay((prevState) => {
            return prevState.filter(i => i.id !== id)
        })
        cancelUpload.current()
        
        cleanInputValues.current()
        // Delete from the uploaded
    }

    const uploadImage = () => {
        productsCtx.upload_image(product._id, imagesToUpload, token, 'Product')
        cancelUpload.current()
        setImagesToUpload([])
        setImagesToDisplay([])
    }


    const convertImages = () => {
        let images: DisplayedImages[] = []
        for (const item of product.images) {
            images.push({ id: item, image: adminCtx.url + item })
        }
        return images
    }

    useEffect(() => {
        const images = convertImages()
        setImagesToDisplay(images)
        console.log(product)
    }, [product])
    return (
        <div>
            <UploadImage cancelUpload={cancelUpload} cleanInputValues={cleanInputValues} image={adminCtx.url + product.images[0]} onSelectImage={imageSelectHandler} />
            <AdminItemGallery images={imagesToDisplay} onDeleteImage={deleteImageHandler} />
            {imagesToUpload.length > 0 && <div className="flex justify-end gap-2">
                <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={cancelUploadImages}>Cancel</button>
                <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => uploadImage()}>{updatingMeta.loading ? 'Update...' : 'Update'}</button>
            </div>}
        </div>
    )
}

export default Images