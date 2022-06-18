import React, { useState, useReducer,useEffect } from 'react'
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import AttributeLine from './AttributeLine'
import Attribute, { Option } from '../../../models/Attribute'
import EditIcon from '../../UI/EditIcon'


const inputReducer = (state: any, action: { type: string, isEdit: boolean }) => {
    if (action.type === 'EDIT') {
        return { isEdit: action.isEdit }
    }
    return { isEdit: false }
}

const AttributesContainer: React.FC<{ defaultVal: Attribute[], loading: boolean, onSave: (attributes: Attribute[]) => void }> = (props) => {
    const [attributes, setAttributes] = useState<Attribute[]>(props.defaultVal)
    const [inputState, dispatchInputState] = useReducer(inputReducer, { isEdit: false });


    const addNewAttributeLine = () => {
        setAttributes((prevState) => {
            return prevState.concat({ attrNo: (attributes.length + 1).toString(), name: '', options: [] })
        })
    }

    const deleteAttributeLine = (id: string | number) => {
        setAttributes((prevState) => {
            return prevState.filter(i => i.attrNo !== id)
        })
    }

    const updateAttributes = (attribute: Attribute) => {
        const attributeIdx = attributes.findIndex(i => i.attrNo === attribute.attrNo)
        attributes[attributeIdx] = attribute
        // spread attributes to new array to feel the chagnes in useEffect
        const newAttributes = [...attributes]
        setAttributes(newAttributes)
    }
    useEffect(() => {
        if (!props.loading) {
            dispatchInputState({ type: 'EDIT', isEdit: false })
          }
    },[props.loading])

    return (
        <div className="text-left border-b-1-g mb-6 pb-2 border-b-2">
            <div className="flex items-center mb-2 mt-3">
                <span className="text-xl text-gray-600 mb-2 mr-2">Attributes</span>
                <EditIcon isEdit={inputState.isEdit} startEdit={() => { dispatchInputState({ type: 'EDIT', isEdit: true }) }} />
            </div>
            <div className={`${inputState.isEdit ? 'block' : 'hidden'}`}>

                <div className='flex justify-between'>
                    <label htmlFor="desc" >Attributes</label>
                    <button
                        onClick={addNewAttributeLine}
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                {attributes.length > 0 && attributes.map((attribute) => <AttributeLine  attribute={attribute} updateAttributes={(attribute: Attribute) => updateAttributes(attribute)} onDelete={(id: string | number) => deleteAttributeLine(id)} />)}
                <div className="flex justify-end gap-2">
                    <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={() => dispatchInputState({ type: 'EDIT', isEdit: false })}>Cancel</button>
                    <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => props.onSave(attributes)}>{props.loading ? 'Update...' : 'Update'}</button>
                </div>
            </div>
        </div>
    )
}

export default AttributesContainer