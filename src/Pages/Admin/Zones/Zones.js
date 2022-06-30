import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context';
import ZoneItem from '../../../components/Admin/Zone/ZoneItem'
import Fallback from '../../../components/Common/Fallback'

const Zones = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { zones, fetch_zones } = adminCtx
    const { zonesMeta } = adminCtx
    useEffect(() => {
        if (token) {
            fetch_zones(token)
        }

    }, [token])

    if (zonesMeta.loading) {
        return <p>Loading...</p>
    }
    if (!zonesMeta.loading && zonesMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{zonesMeta.error}</p></div>
    }
    if (!zonesMeta.loading && !zonesMeta.error && zones.length === 0) {
        return <>
            <Fallback label="Zones" redirectLink="/admin/zones/new" />

        </>
    }
    return (

        <div className="p-4 sm:p-6">

            <div className=' mb-5  flex items-center justify-between'>
                <h2 className="font-boldtext-2xl text-left">Zones</h2>
                <Link to={`/admin/zones/new`} className=' py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white'>New Zone</Link>

            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {zones.length > 0 && zones.map(zone => <ZoneItem key={zone._id} zone={zone} />)}

                </ul>
            </div>
        </div>


    )
}

export default Zones