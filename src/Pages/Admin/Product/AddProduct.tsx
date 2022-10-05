import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import NewProductForm from '../../../components/Admin/Forms/NewProductForm'
import ProductsContext from '../../../store/Admin/products-context'
import AdminContext from '../../../store/Admin/admin-context'
import { NotificationModalContext } from '../../../store/Notification/notification-context'

import Product from '../../../models/Product'
const AddProduct: React.FC = () => {
    const productsCtx = useContext(ProductsContext)
    const adminCtx = useContext(AdminContext)
    const { token } = adminCtx.authMeta
    const { fetch_categories } = adminCtx
    const notificationCtx = useContext(NotificationModalContext)

    const history = useHistory()


    const saveNewProduct = async (product: Product) => {
        console.log(product.featured)
        const form = new FormData()
        form.append('name', product.name)
        form.append('price', product.price)
        form.append('description', product.description)
        form.append('details', product.details)
        form.append('quantity', product.quantity)
        form.append('featured', JSON.stringify(product.featured))
        form.append('popular', JSON.stringify(product.popular))
        form.append('category', JSON.stringify(product.category))
        form.append('attributes', JSON.stringify(product.attributes))
        for (const img of product.images) {
            form.append('image', img.image)
        }
        try {
            const response = await fetch(`http://localhost:8000/admin/api/items`, {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: form
            })
            if (response.status === 201) {

                notificationCtx.showModal({ title: 'Success', message: 'Your Product was successfully created' })
                return history.push('/admin/products')
            }
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })

        } catch (error) {
            notificationCtx.showModal({ title: 'Error', message: 'Something went wrong' })
        }

    }
    useEffect(() => {
        if (token) {
            fetch_categories(token  )
        }
    }, [token])
    return (
        <section className='p-4 sm:p-6 '>
            <h1 className='text-2xl font-bold mb-4'>New Product</h1>

            <NewProductForm onNewProduct={saveNewProduct} />
        </section>

    )
}

export default AddProduct