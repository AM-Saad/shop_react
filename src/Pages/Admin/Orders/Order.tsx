import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import OrdersContext from '../../../store/Admin/orders-context'
import SingleOrder from '../../../components/Admin/Order/SingleOrder'
import OrderStatus from '../../../components/Admin/Order/OrderStatus'
import Modal from '../../../components/UI/Modal'
import FetchError from '../../../components/Common/FetchError'
import ConfirmDeleteItem from '../../../components/Common/ConfirmDeleteItem'

const Zone = () => {
    const params = useParams()
    const adminCtx = useContext(AdminContext)
    const ordersCtx = useContext(OrdersContext)

    const { id }: any = params
    const { token } = adminCtx.authMeta
    const { currentOrder, ordersMeta, fetch_order } = ordersCtx

    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)

    const cofirmDeleteOrder = () => {
        if (currentOrder) ordersCtx.delete_order(currentOrder?._id, token)
    }
    useEffect(() => {
        if (token) fetch_order(id, token)
    }, [token, id])


    if (ordersMeta.loading) return <p>Loading...</p>

    if (!ordersMeta.loading && ordersMeta.error) {
        return <FetchError error={ordersMeta.error} reload={() => fetch_order(id, token)} />
    }
    return (
        <div className='p-4 sm:p-6' >
            <div className='flex items-center justify-between ' >
                <div className='flex items-center gap-2 mb-4 my-5'>
                    <h1 className='text-2xl font-bold text-left' ># {currentOrder?.serialNo}</h1>
                    <OrderStatus />
                </div>
                {currentOrder && !adminCtx.updatingMeta.loading && <button onClick={() => { setOpenConfirmDeleteModal(true) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>}
                {adminCtx.updatingMeta.loading && <button className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white opacity-50' > Delete </button>}
            </div>
            <Modal styles={'w-full sm:w-5/12 max-h-full overflow-scroll '} open={openConfirmDeleteModal} close={() => setOpenConfirmDeleteModal(false)}>
                <ConfirmDeleteItem label='Order' cancel={() => setOpenConfirmDeleteModal(false)} confirmDelete={cofirmDeleteOrder} />
            </Modal>
            {currentOrder && <SingleOrder order={currentOrder} />}
        </div>
    )
}

export default Zone