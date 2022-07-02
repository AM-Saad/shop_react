import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import SingleOrder from '../../../components/Admin/Order/SingleOrder'
import OrderStatus from '../../../components/Admin/Order/OrderStatus'
import Modal from '../../../components/UI/Modal'

const Zone = () => {
    const params = useParams()
    const adminCtx = useContext(AdminContext)

    const { id }: any = params
    const { token } = adminCtx.authMeta
    const { currentOrder, ordersMeta, fetch_order, updatingMeta } = adminCtx

    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)

    const cofirmDeleteOrder = () => {
        if (currentOrder) adminCtx.delete_order(currentOrder?._id, token)
    }
    useEffect(() => {
        if (token) fetch_order(id, token)
    }, [token, id])


    if (ordersMeta.loading) return <p>Loading...</p>

    if (!ordersMeta.loading && ordersMeta.error) {
        return <div className='p-3 border-2 border-red-200 my-4'><p className='text-red-400'>{ordersMeta.error}</p></div>
    }

    return (
        <div className='p-4 sm:p-6' >
            <div className='flex items-center justify-between ' >
                <div className='flex items-center gap-2 mb-4 my-5'>
                    <h1 className='text-2xl font-bold text-left' ># {currentOrder?.serialNo}</h1>
                    <OrderStatus />
                </div>
                {currentOrder && !updatingMeta.loading && <button onClick={() => { setOpenConfirmDeleteModal(true) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>}
                {updatingMeta.loading && <button className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white opacity-50' > Delete </button>}
            </div>
            <Modal styles={'w-full sm:w-5/12 max-h-full overflow-scroll '} open={openConfirmDeleteModal} close={() => setOpenConfirmDeleteModal(false)}>
                <div className="gap-2 grid text-center">
                    <h2 className='font-bold '>Are you sure you want to delete this order?</h2>
                    <p className='mb-3'>By deleting it you will never be able to retrive it</p>
                    <div className='flex items-center justify-around'>
                        <button onClick={() => setOpenConfirmDeleteModal(false)} className=' py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white' > Cancel </button>
                        <button onClick={cofirmDeleteOrder} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>
                    </div>

                </div>
            </Modal>
            {currentOrder && <SingleOrder order={currentOrder} />}
        </div>
    )
}

export default Zone