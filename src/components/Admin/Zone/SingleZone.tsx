import React, { useContext } from 'react'
import AdminContext from '../../../store/Admin/admin-context'

import Zone from '../../../models/Zone'
import EditableInput from '../../UI/EditableInput'


const SingleZone: React.FC<{ zone: Zone }> = ({ zone }) => {

  const adminCtx = useContext(AdminContext)

  const { token } = adminCtx.authMeta
  const { updatingMeta } = adminCtx

  return (
    <>
      <div className='grid sm:grid-cols-2 py-6 gap-8' >
        <div>
          <EditableInput
            label='Name'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)}
            defaultVal={zone.name}
            loading={updatingMeta.loading}
            validationMessage={'Name is required'}
            required={true}
            classes={"border-1-b bg-lightgray w-full p-large b-r-medium m-t-large font-medium p-2"}
          />
        </div>
        < div >
          <EditableInput
            label='Shipping Price'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)}
            defaultVal={zone.shipping}
            loading={updatingMeta.loading}
            validationMessage={'Shipping Price is required'}
            required={true}
            classes={"border-1-b bg-lightgray w-full p-large b-r-medium m-t-large font-medium p-2"}
          />
        </div>
        < div >
          <EditableInput
            label='Zone Number'
            inputType="number"
            onSave={(value: string | number) => adminCtx.update_partial_zone([{ zoneId: value }], token)}
            defaultVal={zone.zoneId}
            loading={updatingMeta.loading}
            validationMessage={'Zone Number is required'}
            required={true}
            classes={"border-1-b bg-lightgray w-full p-large b-r-medium m-t-large font-medium p-2"}
          />
        </div>
        < div >
          <EditableInput
            label='Notes'
            inputType="text"
            onSave={(value: string | number) => adminCtx.update_partial_zone([{ notes: value }], token)}
            defaultVal={zone.notes}
            loading={updatingMeta.loading}
            classes={"border-1-b bg-lightgray w-full p-large b-r-medium m-t-large font-medium p-2"}
          />
        </div>

      </div>
    </>
  )
}

export default SingleZone