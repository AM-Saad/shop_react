import React, { useState, useReducer } from 'react'
import BadgeWithDelete from '../../UI/BadgeWithDelete'
import Badge from '../../UI/Badge'
import EditIcon from '../../UI/EditIcon'



const inputReducer = (state: any, action: { type: string, isEdit: boolean }) => {
    if (action.type === 'EDIT') {
        return { isEdit: action.isEdit }
    }
    return { isEdit: false }
}

const EditSubCategory: React.FC<{ defaultVal: string[], loading: boolean; onSave: (value: string[]) => void }> = ((props, ref) => {

    const [subCategories, setSubCategories] = useState<string[]>(props.defaultVal)
    const [inputState, dispatchInputState] = useReducer(inputReducer, { isEdit: false });

    const [subCategoryInput, setSubCategoryInput] = useState<string>('')
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if (!subCategories.includes(subCategoryInput) && subCategoryInput.length !== 0) {
                setSubCategoryInput('')
                setSubCategories((prevState) => {
                    return prevState.concat(subCategoryInput)
                })
            }
        }
    }
    const deleteSubCategoryHandler = (item: string) => {
        setSubCategories((prevState) => {
            return prevState.filter(i => i !== item)
        })
    }
    return (

        <div className="text-left border-b-1-g mb-6 pb-2 border-b-2">
            <div className="flex items-center mb-2 mt-3">
                <span className="text-xl text-gray-600 mb-2 mr-2">Sub Category</span>
                <EditIcon isEdit={inputState.isEdit} startEdit={() => { dispatchInputState({ type: 'EDIT', isEdit: true }) }} />
            </div>

            <p className={`${inputState.isEdit ? 'hidden' : 'block'} mr-5  font-medium text-lg`}>
                {subCategories.length > 0 && subCategories.map((subCategory => <Badge label={subCategory} />))}
            </p>
            <div className={`${inputState.isEdit ? 'block' : 'hidden'}`}>
                <input value={subCategoryInput} id="name" className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full' onChange={(e) => setSubCategoryInput(e.target.value)} onKeyDown={handleKeyDown} type="text" name="subCategory" placeholder='Write then press enter to add (e.g T-Shirts)' />
                {subCategories.map(subCategory => <BadgeWithDelete id={subCategory} label={subCategory} onDelete={deleteSubCategoryHandler} />)}
                <div className="flex justify-end gap-2">
                    <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={() => dispatchInputState({ type: 'EDIT', isEdit: false })}>Cancel</button>
                    <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => props.onSave(subCategories)}>{props.loading ? 'Update...' : 'Update'}</button>
                </div>
            </div>
        </div>


    )
})

export default EditSubCategory