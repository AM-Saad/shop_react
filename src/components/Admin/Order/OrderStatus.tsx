import { useRef, useContext, useState, useEffect } from 'react'
import Badge from '../../../components/UI/Badge'
import Tooltip from '../../../components/UI/Tooltip'
import { useDetectOutsideClick } from "../../../hooks/use-detect-outside-click";
import { getOrderStatusColor, ORDER_STATUS_LABELS } from '../../../models/Order';
import AdminContext from '../../../store/Admin/admin-context'

const statuses = Array.from(ORDER_STATUS_LABELS.values());

const OrderStatus = () => {
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { currentOrder, change_order_status, updatingMeta } = adminCtx

    const dropdownRef = useRef(null);
    const [isTooltipActive, setTooltipActive]: any = useDetectOutsideClick(dropdownRef, false);
    const [status, setStatus] = useState<number>(0)

    const changeStatus = (e: any) => {
        const value = +e.target.value
        setStatus(value)
    }
    const update = () => {
        change_order_status(status, token)
    }
    useEffect(() => {
        if (currentOrder) {
            setStatus(currentOrder?.status)
        }

    }, [currentOrder])
    return (
        <>
            {currentOrder && <div className='relative' ref={dropdownRef}>
                <div onClick={setTooltipActive}>

                    <Badge label={ORDER_STATUS_LABELS.get(currentOrder?.status!)} className={`bg-${getOrderStatusColor(currentOrder?.status)}-200 cursor-pointer hover:opacity-70`} />
                </div>
                <Tooltip className='w-56 mt-5' active={isTooltipActive}>
                    <div>
                        <select className='w-full p-1' onChange={changeStatus}>
                            {statuses.map((status, idx) => <option value={idx}>{status}</option>)}
                        </select>
                        <div className='flex mt-4 justify-end'>

                            <button onClick={update} className={`py-2 px-3 text-sm bg-green-400 rounded hover:opacity-70 text-white ${updatingMeta.loading ? 'opacity-70' : ''}`}>
                                {updatingMeta.loading ? 'Update...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </Tooltip>
            </div>}
        </>

    )
}

export default OrderStatus