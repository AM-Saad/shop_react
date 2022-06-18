import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import NewCategoryForm from '../../../components/Admin/Forms/NewCategoryForm'
import AdminContext from '../../../store/Admin/admin-context'
import { NotificationModalContext } from '../../../store/Notification/notification-context'

import Category from '../../../models/Category'
const AddProduct: React.FC = () => {
    const ctx = useContext(AdminContext)
    const notificationCtx = useContext(NotificationModalContext)

    const history = useHistory()


    const saveNewCategory = async (category: Category) => {
        const form = new FormData()
        form.append('name', category.name)
        form.append('attributes', JSON.stringify(category.attributes))
        form.append('subCategories', JSON.stringify(category.subCategory))
        form.append('image', category.image)
        try {
            const response = await fetch(`http://localhost:8000/admin/api/category`, {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + ctx.authMeta.token,
                },
                body: form
            })
            const json = await response.json()
            if (response.status === 201) {
                notificationCtx.showModal({ title: 'Success', message: 'Your Category Has Successfully Created' })
                return history.push('/admin/category')
            }
            notificationCtx.showModal({ title: 'Error', message: json.message })

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })

        }

    }
    return (
        <section className='mt-10'>
            <h1 className='text-2xl font-bold mb-4'>New Category</h1>

            <NewCategoryForm onNewCategory={saveNewCategory} />
        </section>

    )
}

export default AddProduct