import React, { useContext, useState, useEffect } from 'react'
import AdminContext from '../../../store/Admin/admin-context'
import UploadImage from '../../UI/UploadImage'
import AdminItemGallery from '../../UI/AdminItemGallery'
import Product from '../../../models/ProductResponse'
import EditableInput from '../../UI/EditableInput'
import ToggleBtn from '../../UI/ToggleBtn'
import EditProductCategory from './EditProductCategory'
import EditProductAttribute from './EditProductAttribute'

const SingleProduct: React.FC<{ product: Product }> = (props) => {
  const product = props.product

  const adminCtx = useContext(AdminContext)

  const { token } = adminCtx.authMeta
  const { updatingMeta } = adminCtx

  const [imageFiles, setImageFiles] = useState<[]>([])
  const childFunc = React.useRef<any>(null)

  let images = []
  for (const item of product.images) {
    images.push({ id: item, image: adminCtx.url + item })
  }

  const imageSelectHandler = (file: any) => {
    setImageFiles(file)
  }

  const cancelUploadImage = () => {
    childFunc.current()
    setImageFiles([])
  }

  const deleteImageHandler = (image: string) => {
    adminCtx.delete_image(product._id, image, token, 'Product')
  }

  const uploadImage = () => {
    adminCtx.upload_image(product._id, imageFiles, token, 'Product')
  }

  useEffect(() => {
    if (token) {
      adminCtx.fetch_categories(token)
    }
  }, [token])

  return (
    <>
      <div className='grid sm:grid-cols-2 py-6 gap-8'>

        <div>
          <EditableInput label='Name' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_product([{ name: value }, { slug: value.toString().replace('', '-') }], token)} defaultVal={product.name} loading={updatingMeta.loading} />
          <EditableInput label='Price' inputType="number" onSave={(value: string | number) => adminCtx.update_partial_product([{ 'info.price': value }], token)} defaultVal={product.info.price} loading={updatingMeta.loading} />
          <EditableInput label='Quantity' inputType="number" onSave={(value: string | number) => adminCtx.update_partial_product([{ 'info.quantity': value }], token)} defaultVal={product.info.quantity} loading={updatingMeta.loading} />
          <EditableInput label='Description' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_product([{ description: value }], token)} defaultVal={product.description} loading={updatingMeta.loading} />
          <EditableInput label='Details' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_product([{ details: value }], token)} defaultVal={product.details} loading={updatingMeta.loading} />
          <EditProductCategory defaultVal={product.category} loading={updatingMeta.loading} onSave={(value: any) => adminCtx.update_partial_product([{ category: value }], token)} />
          <EditProductAttribute defaultVal={product.attributes} loading={updatingMeta.loading} onSave={(value: any) => adminCtx.update_partial_product([{ attributes: value }], token)} />
          <div className='flex gap-5 items-center border-b-2'>
            <div className="flex">
              <span className="text-xl text-gray-600 mb-2 mr-2 block">Featured</span>
              <ToggleBtn value={product.featured} onSetValue={(value: any) => adminCtx.update_partial_product([{ featured: value }], token)} />
            </div>
            <div className="flex">
              <span className="text-xl text-gray-600 mb-2 mr-2 block">Popular</span>
              <ToggleBtn value={product.popular} onSetValue={(value: any) => adminCtx.update_partial_product([{ popular: value }], token)} />
            </div>

          </div>
        </div>
        <div>
          <div>
            <UploadImage childFunc={childFunc} image={adminCtx.url + product.images[0]} onSelectImage={imageSelectHandler} />
            <AdminItemGallery images={images} onDeleteImage={deleteImageHandler} />
            {imageFiles.length > 0 && <div className="flex justify-end gap-2">
              <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={() => cancelUploadImage()}>Cancel</button>
              <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => uploadImage()}>{updatingMeta.loading ? 'Update...' : 'Update'}</button>
            </div>}
          </div>
        </div>
      </div>


    </>
  )
}

export default SingleProduct