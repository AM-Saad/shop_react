import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminContext from '../../../store/Admin/admin-context'
import SingleCategory from '../../../components/Admin/Category/SingleCategory'
import Modal from '../../../components/UI/Modal'
import FetchError from '../../../components/Common/FetchError'
import ConfirmDeleteItem from '../../../components/Common/ConfirmDeleteItem'

const Product = () => {
    const params = useParams()
    const { id }: any = params
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { currentCategory, categoryMeta, fetch_category, delete_category } = adminCtx
    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)

    const cofirmDeleteCategory = () => {
        if (currentCategory) delete_category(currentCategory?._id!, token)
    }
    useEffect(() => {
        if (token) {
            fetch_category(id, token)
        }
    }, [token, id])

    if (categoryMeta.loading) {
        return <p>Loading...</p>
    }
    if (!categoryMeta.loading && categoryMeta.error) {
        return <FetchError error={categoryMeta.error} reload={() => fetch_category(id, token)} />
    }
    if (currentCategory) {
        return (
            <div className='p-4 sm:p-6'>
                <div className='flex items-center justify-between '>
                    <h1 className='text-2xl font-bold mb-4 text-left my-5'>Your Category.</h1>
                    {currentCategory && !categoryMeta.loading && <button onClick={() => { setOpenConfirmDeleteModal(true) }} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>}
                    {categoryMeta.loading && <button className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white opacity-50' > Delete </button>}
                </div>
                <Modal styles={'w-full sm:w-5/12 max-h-full overflow-scroll '} open={openConfirmDeleteModal} close={() => setOpenConfirmDeleteModal(false)}>
                    <ConfirmDeleteItem label='Category' cancel={() => setOpenConfirmDeleteModal(false)} confirmDelete={cofirmDeleteCategory} />
                </Modal>
                <SingleCategory category={currentCategory} />
            </div>
        )
    }
    return <></>

}

export default Product