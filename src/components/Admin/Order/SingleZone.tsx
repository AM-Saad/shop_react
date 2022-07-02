import React, { useContext, useEffect, useState } from 'react'
import AdminContext from '../../../store/Admin/admin-context'
import AuthContext from '../../../store/User/user_context'

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
          <EditableInput label='Name' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)} defaultVal={zone.name} loading={updatingMeta.loading} />
        </div>
        < div >
          <EditableInput label='Shipping Price' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)} defaultVal={zone.shipping} loading={updatingMeta.loading} />
        </div>
        < div >
          <EditableInput label='Zone Number' inputType="number" onSave={(value: string | number) => adminCtx.update_partial_zone([{ zoneId: value }], token)} defaultVal={zone.zoneId} loading={updatingMeta.loading} />
        </div>
        < div >
          <EditableInput label='Notes' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ notes: value }], token)} defaultVal={zone.notes} loading={updatingMeta.loading} />
        </div>

      </div>
    </>
  )
}

export default SingleZone