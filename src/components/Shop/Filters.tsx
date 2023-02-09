import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import UserContext from '../../store/User/user_context'
import MultiSelect from '../UI/MultiSelect';
import MultiRangeSlider from '../UI/MultiRangeSlider';
import { RefreshIcon } from '@heroicons/react/solid'

interface Multiselect {
    val: string,
    label: string
}
const Filters: React.FC = () => {
    const userCtx = useContext(UserContext)

    const { productsMeta, update_products_meta, fetch_categories ,categories} = userCtx

    const [refresh, doRefresh] = useState(0);


    const changeCategory = (value: Multiselect[]) => {
        if (value !== null) update_products_meta({ ...productsMeta, filters: { ...productsMeta.filters, category: value.map(i => i.label) } })
    }
    const changeFeatured = (value: Multiselect[]) => {
        update_products_meta!({ ...productsMeta, filters: { ...productsMeta!.filters, featured: value[0] ? value[0].val : null } })
    }
    const changePopular = (value: Multiselect[]) => {
        update_products_meta!({ ...productsMeta, filters: { ...productsMeta!.filters, popular: value[0] ? value[0].val : null } })
    }
    const changePrice = (min: number, max: number) => {
        update_products_meta!({ ...productsMeta, filters: { ...productsMeta!.filters, min: min.toString(), max: max.toString() } })
    }
    const changeQuantity = (min: number, max: number) => {
        update_products_meta!({ ...productsMeta, filters: { ...productsMeta!.filters, minQty: min.toString(), maxQty: max.toString() } })
    }

    const resetFilters = () => {
        update_products_meta!({ ...productsMeta, filters: {} })
        doRefresh((prev) => prev + 1)

    }

    useEffect(() => {
        fetch_categories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>

            <div className='flex flex-wrap'>
                <div className='p-2 mb-2 text-left'>
                    <label htmlFor="desc" >Category</label>
                    {categories.length > 0 && <MultiSelect
                        options={categories.map((i) => ({ val: i._id, label: i.name }))}
                        trackBy="val"
                        label='label'
                        closeOnSelect={false}
                        multiple={true}
                        input={changeCategory}
                        placeholder="Choose categories.."
                        id='category'
                        disabled={false}
                        preSelected={productsMeta.filters.category?.map((i) => ({ val: i, label: i })) || []}
                        refresh={refresh}

                    />}
                </div>

                <div className='p-2 mb-2 text-left'>
                    <label htmlFor="price" >Price Range</label>
                    <MultiRangeSlider
                        min={0}
                        max={3000}
                        onChange={({ min, max }) => changePrice(min, max)}
                        refresh={refresh}

                    />
                </div>
                <div className='p-2 mb-2 text-left'>
                    <label htmlFor="price" >Quantity</label>
                    <MultiRangeSlider
                        min={0}
                        max={10000}
                        onChange={({ min, max }) => changeQuantity(min, max)}
                        refresh={refresh}

                    />
                </div>
            </div>
            <button className='flex items-center gap-2 ml-auto mt-3 mb-3 mr-3' onClick={resetFilters}>Reset Filters<RefreshIcon className='main-text-color' height="20" width="20" /></button>

        </>
    )
}

export default Filters