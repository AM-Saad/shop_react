import React, { useState, useEffect } from 'react'
import BadgeWithDelete from '../../UI/BadgeWithDelete'
import Badge from '../../UI/Badge'
import EditIcon from '../../UI/EditIcon'



const EditSubCategory: React.FC<{ defaultVal: string[], loading: boolean; onSave: (value: string[]) => void }> = ((props, ref) => {
    const { loading, onSave } = props

    const [subCategories, setSubCategories] = useState<string[]>(props.defaultVal)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // By Default the Loading is false 
    // we need to track when the Loading became false Only after being true
    const [Finished, setFinished] = useState(0)

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

    const checkKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === "Escape") return cancel()

    }

    const cancel = () => {
        setIsEditing(false)
        setSubCategories(props.defaultVal)
    }


    const deleteSubCategoryHandler = (item: string) => {
        setSubCategories((prevState) => {
            return prevState.filter(i => i !== item)
        })
    }

    useEffect(() => {

        document.addEventListener('keydown', checkKeyboardEvent)
        // Finished will be (1) only if the Loading became true
        // If the Loading became false Again after Finished became (1) then finish the editing

        if (loading) setFinished(1)
        if (!loading && Finished === 1) setIsEditing(false)

        return () => {
            setFinished(0)
            document.removeEventListener('keydown', checkKeyboardEvent)
        }
    }, [props, loading])
    return (

        <div className="text-left border-b-1-g mb-6 pb-2 border-b-2">
            <div className="flex items-center mb-2 mt-3">
                <span className="text-xl text-gray-600 mb-2 mr-2">Sub Category</span>
                <EditIcon isEdit={isEditing} startEdit={() => { setIsEditing(true) }} />
            </div>

            <p className={`${isEditing ? 'hidden' : 'flex'} mr-5 gap-2 font-medium text-lg`}>
                {subCategories.length > 0 && subCategories.map((subCategory => <Badge key={subCategory} label={subCategory} className="bg-purple-300" />))}
            </p>
            {isEditing && <div >
                <input value={subCategoryInput}
                    id="name"
                    className='block border-1 border-b-2 border-gray my-2 outline-white py-2 w-full'
                    onChange={(e) => setSubCategoryInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    name="subCategory"
                    placeholder='Write then press enter to add (e.g T-Shirts)' />
                {subCategories.map(subCategory => <BadgeWithDelete id={subCategory} key={subCategory} label={subCategory} onDelete={deleteSubCategoryHandler} />)}
                <div className="flex justify-end gap-2 my-2">
                    <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => onSave(subCategories)}>{loading ? 'Update...' : 'Update'}</button>
                </div>
            </div>}
        </div>


    )
})

export default EditSubCategory