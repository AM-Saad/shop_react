import React, { useContext, useEffect } from 'react'
import AdminContext from '../../../store/Admin/admin-context'
import Product from '../../../models/ProductResponse'
import EditableInput from '../../UI/EditableInput'
import ToggleBtn from '../../UI/ToggleBtn'
import EditProductCategory from './EditProductCategory'
import EditProductAttribute from './EditProductAttribute'
import ImagesContainer from './ImagesContainer'

const SingleProduct: React.FC = () => {

  const adminCtx = useContext(AdminContext)

  const { token } = adminCtx.authMeta
  const { updatingMeta, currentProduct } = adminCtx


  useEffect(() => {

    if (token) {
      adminCtx.fetch_categories(token, 1)
    }
  }, [token, currentProduct])

  return (
    <>
      <div className='grid xl:grid-cols-5 py-6 gap-8'>

        <div className="col-span-3">
          <EditableInput
            label='Name'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_product([{ name: value }, { slug: value.toString().split(' ').join('_') }], token)}
            defaultVal={currentProduct!.name}
            loading={updatingMeta.loading}
            classes={"rounded shadow w-full p-large b-r-medium m-t-large font-medium p-2 outline-none"}
            required={true}
            validationMessage={'Name is required'}

          />
          <EditableInput
            label='Price'
            inputType="number"
            onSave={(value: string | number) => adminCtx.update_partial_product([{ 'info.price': value }], token)}
            defaultVal={currentProduct!.info.price}
            loading={updatingMeta.loading}
            classes={"rounded shadow w-full p-large b-r-medium m-t-large font-medium p-2 outline-none"}
            required={true}
            validationMessage={'Price is required'}
          />
          <EditableInput
            label='Quantity'
            inputType="number"
            onSave={(value: string | number) => adminCtx.update_partial_product([{ 'info.quantity': value }], token)}
            defaultVal={currentProduct!.info.quantity}
            loading={updatingMeta.loading}
            classes={"rounded shadow w-full p-large b-r-medium m-t-large font-medium p-2 outline-none"}
            required={true}
            validationMessage={'Quantity is required'}
          />
          <EditableInput
            label='Description'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_product([{ description: value }], token)}
            defaultVal={currentProduct!.description}
            loading={updatingMeta.loading}
            classes={"rounded shadow w-full p-large b-r-medium m-t-large font-medium p-2 outline-none"}
            required={true}
            validationMessage={'Description is required'}
          />
          <EditableInput
            label='Details'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_product([{ details: value }], token)}
            defaultVal={currentProduct!.details}
            loading={updatingMeta.loading}
            classes={"rounded shadow w-full p-large b-r-medium m-t-large font-medium p-2 outline-none"}

          />

          <EditProductCategory defaultVal={currentProduct!.category} loading={updatingMeta.loading} onSave={(value: any) => adminCtx.update_partial_product([{ category: value }], token)} />

          <EditProductAttribute defaultVal={currentProduct!.attributes}
            loading={updatingMeta.loading} onSave={(value: any) => adminCtx.update_partial_product([{ attributes: value }], token)} />

          <div className='flex gap-5 items-center border-b-2'>
            <div className="flex">
              <span className="text-xl text-gray-600 mb-2 mr-2 block">Featured</span>
              <ToggleBtn value={currentProduct!.featured} onSetValue={(value: any) => adminCtx.update_partial_product([{ featured: value }], token)} />
            </div>
            <div className="flex">
              <span className="text-xl text-gray-600 mb-2 mr-2 block">Popular</span>
              <ToggleBtn value={currentProduct!.popular} onSetValue={(value: any) => adminCtx.update_partial_product([{ popular: value }], token)} />
            </div>

          </div>
        </div>
        <div className='col-span-2'>
          <ImagesContainer product={currentProduct!} />
        </div>
      </div>


    </>
  )
}

export default SingleProduct