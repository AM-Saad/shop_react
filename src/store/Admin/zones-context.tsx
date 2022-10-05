import React, { useEffect, useState, useContext } from 'react';
import { NotificationModalContext } from "../Notification/notification-context"
import { useHistory } from "react-router-dom"

import ZonesContextType from '../../models/ZonesContext';
import Pagination from '../../models/Pagination';
import Zone, { ZonesMeta } from '../../models/Zone';
import Meta from '../../models/Meta';
import serialize from '../../util/serialize';
const initialPagination = {
    itemsPerPage: 10,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    lastPage: 1,
    nextPage: 2,
    prevPage: 0,
    total: 0,
    skip: 0,
}
const ZonesContext = React.createContext<ZonesContextType>({
    zones: [],
    zonesMeta: { loading: true, error: null, filters: {} },
    pagination: initialPagination,
    currentZone: null,
    fetch_zones: (token?: string) => { },
    fetch_zone: (id: string, token: string | null) => { },
    delete_zone: (id: string, token: string | null) => { },
    update_partial_zone: (json_patch: any, token: string | null) => { },
    updatingMeta: { loading: false, error: null },
    update_meta: (data: any) => { },
    update_pagination: (data: Pagination) => { }
})

export const ZonesContextProvider: React.FC<{ children?: React.ReactNode; }> = (props) => {
    let history = useHistory()

    const [currentZone, setCurrentZone] = useState<Zone | null>(null)
    const [zonesMeta, setZonesMeta] = useState<ZonesMeta>({ loading: false, error: null, filters: {} })
    const [zones, setZones] = useState([])
    const [updatingMeta, setUpdatingMeta] = useState<Meta>({ loading: false, error: null })
    const [pagination, setPagination] = useState(initialPagination)
    const notificationCtx = useContext(NotificationModalContext)

    const fetch_zones = async (token?: string) => {

        setZonesMeta((prevState => { return { ...prevState, loading: true, error: null } }))
        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones?page=${pagination.currentPage}&&itemsPerPage=${pagination?.itemsPerPage}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })

            const json = await response.json()

            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                if (json.pagination) {
                    setZonesMeta((prevState => {
                        return { ...prevState, pagination: json.pagination }
                    }))
                }
                return setZones(json.items)
            }
            return setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))


        } catch (error) {
            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))


        }
    }
    const fetch_zone = async (id: string, token: string | null) => {
        setZonesMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))
        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,

                }
            })
            const json = await response.json()
            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                return setCurrentZone(json.item)
            }
            return setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: json.message }
            }))

        } catch (error) {
            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: 'Something went wrong' }
            }))


        }
    }

    const delete_zone = async (id: string, token: string | null) => {

        setZonesMeta((prevState => {
            return { ...prevState, loading: true, error: null }
        }))

        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))
            if (response.status === 200) {
                notificationCtx.showModal({ title: 'Success', message: json.message })
                return history.push('/admin/zones')

            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

            setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))



        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })

            return setZonesMeta((prevState => {
                return { ...prevState, loading: false, error: null }
            }))


        }
    }

    const update_partial_zone = async (json_patch: any, token: string | null) => {
        setUpdatingMeta({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:8000/admin/api/zones/${currentZone?._id}`, {
                method: 'PATCH',
                body: JSON.stringify({ values: json_patch }),
                headers: {
                    Authorization: "Bearer " + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            setUpdatingMeta({ loading: false, error: null })
            if (response.status === 200) {
                return setCurrentZone(json.item)
            }
            return notificationCtx.showModal({ title: 'Error', message: json.message })

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
            return setUpdatingMeta({ loading: false, error: null })
        }
    }


    const update_pagination = async (data: Pagination) => {
        return setPagination(data)
    }
    const update_meta = async (data: any) => {
        setPagination(prevState => { return { ...prevState, currentPage: 1 } })

        setZonesMeta(prevState => { return { ...prevState, ...data } })
    }

    useEffect(() => {

        update_pagination(initialPagination)
    }, [])
    const adminContext = {

        zones,
        currentZone,
        zonesMeta,
        fetch_zones,
        fetch_zone,
        delete_zone,
        update_partial_zone,
        updatingMeta,
        update_meta,
        update_pagination,
        pagination
    }


    return <ZonesContext.Provider value={adminContext}>
        {props.children}
    </ZonesContext.Provider>
}


export default ZonesContext