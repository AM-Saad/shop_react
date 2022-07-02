import React, { useEffect, useReducer, useState } from 'react'
import EditIcon from './EditIcon'
enum ActionKind {
  USER_INPUT = 'USER_INPUT',
}
type Action = {
  type: ActionKind,
  value: string | number;
  isEdit: boolean;
}

interface InputState {
  value: string | number;
  isEdit: boolean;
}


const inputReducer = (state: InputState, action: Action) => {
  if (action.type === ActionKind.USER_INPUT) {
    return { isEdit: action.isEdit, value: action.value }
  }
  return { isEdit: false, value: state.value }
}

const EditableInput: React.FC<{ label: string, inputType: string; defaultVal: string | number, loading: boolean; onSave: (value: string | number) => void }> = ((props, ref) => {

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [defaultVal, setDefault] = useState(props.defaultVal)
  useEffect(() => {
 
    setDefault(props.defaultVal)
    return () => { }
  }, [props])
  return (
    <>
      <div className="text-left border-b-1-g mb-6 pb-2 border-b-2">
        <div className="flex items-center mb-2 mt-3">
          <span className="text-xl text-gray-600 mb-2 mr-2">{props.label}</span>
          <EditIcon isEdit={isEditing} startEdit={() => setIsEditing(true)} />
        </div>

        <p className={`${isEditing ? 'hidden' : 'block'} mr-5  font-medium text-lg`}>{defaultVal || 'n.c.'}</p>
        <div className={`${isEditing ? 'block' : 'hidden'}`}>
          <input disabled={props.loading} className={`border-1-b bg-lightgray  w-full  p-large b-r-medium mb-2 m-t-large font-medium p-2`}
            onChange={(e) => setDefault(e.target.value)}
            id={`update_${props.label}`} type={props.inputType} placeholder={`Add ${props.label}`} value={defaultVal} />
          <div className="flex justify-end gap-2">
            <button type="button" className=" py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="button" className=" py-2 px-4 text-sm bg-green-400 rounded hover:opacity-70 text-white" onClick={() => props.onSave(defaultVal)}>{props.loading ? 'Update...' : 'Update'}</button>
          </div>
        </div>
      </div>
    </>

  )
})

export default EditableInput