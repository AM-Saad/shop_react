import React, { useContext, useState } from 'react'
import AdminContext from '../../../store/Admin/admin-context'
import AuthContext from '../../../store/User/user_context'
import UploadImage from '../../UI/UploadImageInput'
import AdminItemGallery from '../../UI/AdminItemGallery'
import Category from '../../../models/Category'
import EditableInput from '../../UI/EditableInput'
import EditSubCategory from './EditSubCategory'
import ToggleBtn from '../../UI/ToggleBtn'


const SingleCategory: React.FC<{ category: Category }> = (props) => {
  const category = props.category

  const adminCtx = useContext(AdminContext)
  const authCtx = useContext(AuthContext)

  const { token } = adminCtx.authMeta

  const { updatingMeta } = adminCtx


  const [imageFiles, setImageFiles] = useState<[]>([])
  const cancelUpload = React.useRef<any>(null)
  const cleanInputValues = React.useRef<any>(null)

  let images = []
  for (const item of category.image) {
    images.push({ id: item, image: authCtx.url + item })
  }

  const imageSelectHandler = (file: any) => {
    setImageFiles(file)
  }

  const cancelUploadImage = () => {
    cancelUpload.current()
    setImageFiles([])
  }



  const uploadImage = () => {
    adminCtx.upload_category_image(category._id ?? '', imageFiles, token, 'Category')

  }
  const deleteImageHandler = (image: string) => {
    adminCtx.delete_category_image(category._id ?? '', image, token, 'Category')
  }

  return (
    <>
      <div className='flex gap-5 items-center mt-10'>

        <div className="flex">
          <span className="text-xl text-gray-600 mb-2 mr-2 block">Featured</span>
          <ToggleBtn value={category!.featured} onSetValue={(value: any) => adminCtx.update_partial_category([{ featured: value }], token)} />
        </div>
        <div className="flex">
          <span className="text-xl text-gray-600 mb-2 mr-2 block">Active</span>
          <ToggleBtn value={category!.active} onSetValue={(value: any) => adminCtx.update_partial_category([{ active: value }], token)} />
        </div>
      </div>
      <div className='grid sm:grid-cols-2 py-3 gap-10'>
        <div>
          <EditableInput
            label='Name'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_category([{ name: value }], token)}
            defaultVal={category.name}
            loading={updatingMeta.loading}
            required={true}
            validationMessage={'Name is required'}
          />
          <EditSubCategory defaultVal={category.subCategory} loading={updatingMeta.loading} onSave={(value: string[]) => adminCtx.update_partial_category([{ subCategory: value }], token)} />
        </div>
        <div>
          <div>
            {!category.image && <UploadImage cancelUpload={cancelUpload} cleanInputValues={cleanInputValues} image={authCtx.url + category.image} onSelectImage={imageSelectHandler} />}
            {category.image && <AdminItemGallery images={[{ id: category.image, image: authCtx.url + category.image }]} onDeleteImage={deleteImageHandler} />}

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

export default SingleCategory