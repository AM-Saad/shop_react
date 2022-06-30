import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import SingleZone from '../../../components/Admin/Zone/SingleZone'
import EditableInput from '../../../components/UI/EditableInput'

const Zone = () => {
    const params = useParams()
    const { id }: any = params
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { currentZone, zonesMeta, fetch_zone, updatingMeta } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_zone(id, token)
        }
        return 
    }, [token, id])



    if (zonesMeta.loading) {
        return <p>Loading...</p>
    }

    if (!zonesMeta.loading && zonesMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{zonesMeta.error}</p></div>
    }
    return (
        <div className='p-4 sm:p-6' >
            <div className='flex items-center justify-between ' >
                <h1 className='text-2xl font-bold mb-4 text-left my-5' > Your Zone.</h1>
                {currentZone && <button onClick={() => { adminCtx.delete_zone(currentZone._id, token) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>}
                {updatingMeta.loading && <button className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white opacity-50' > Delete </button>}
            </div>
            {currentZone && <div className='grid sm:grid-cols-2 py-6 gap-8' >
                <div>
                    <EditableInput label='Name' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)} defaultVal={currentZone.name} loading={updatingMeta.loading} />
                </div>
                < div >
                    <EditableInput label='Shipping Price' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ name: value }], token)} defaultVal={currentZone.shipping} loading={updatingMeta.loading} />
                </div>
                < div >
                    <EditableInput label='Zone Number' inputType="number" onSave={(value: string | number) => adminCtx.update_partial_zone([{ zoneId: value }], token)} defaultVal={currentZone.zoneId} loading={updatingMeta.loading} />
                </div>
                < div > 
                    <EditableInput label='Notes' inputType="text" onSave={(value: string | number) => adminCtx.update_partial_zone([{ notes: value }], token)} defaultVal={currentZone.notes} loading={updatingMeta.loading} />
                </div>

            </div>}
        </div>
    )



}

export default Zone