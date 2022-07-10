import React, { useEffect, useState, useMemo } from 'react'
import { useIsFirstRender } from '../../hooks/use-is-first-render';



const EditIcon: React.FC<{
  startEdit: () => void;
  isEdit: boolean;
}> = ({ isEdit, startEdit }) => {
  return (
    <>
      {!isEdit &&
        <div onClick={() => { startEdit() }} className='bg-blue-100 flex h-5 w-5 p-1 hover:bg-blue-200 items-center justify-center rounded-full shadow cursor-pointer'>
          <svg

            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="18" height="18"
            viewBox="0 0 24 24"
            style={{ fill: "#444444" }}>    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path></svg>
        </div>

      }
    </>
  )
}


function isEmptyOrSpaces(str: string | number) {
  return str === null || (typeof str === 'string' && str.match(/^ *$/) !== null);
}



interface Props {
  label: string,
  inputType: string;
  defaultVal: string | number,
  loading: boolean;
  onSave: (value: string | number) => void
  required?: boolean
  validationMessage?: string
  classes: string
}
const EditableInput: React.FC<Props> = ((props, ref) => {

  const { loading, inputType, label, classes, required, validationMessage, onSave } = props
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isTouched, setIsTouched] = useState<boolean>(false)
  const [defaultVal, setDefault] = useState<string | number>(props.defaultVal)
  const [newVal, setNewVal] = useState<string | number>('')
  const [error, setError] = useState<string | null>(null)

  // By Default the Loading is false 
  // we need to track when the Loading became false Only after being true
  const [Finished, setFinished] = useState(0)

  const checkKeyboardEvent = (e: KeyboardEvent) => {
    if (e.key === "Escape") if (isTouched) return cancel()
    if (e.key === "Enter") {
      if (isTouched) return submit()
    }
  }



  const handleChange = (e: any) => {
    setNewVal(e.target.value);
  };
  const cancel = (): void => {
    setIsEditing(false)
    setNewVal(props.defaultVal)
  }
  const submit = (): void => {
    setIsTouched(true)
    if (required && isEmptyOrSpaces(newVal)) {
      return setError(validationMessage || 'This field is required')
    }
    return onSave(newVal)
  }

  const checkValidation = (): void => {
    if (required && isEmptyOrSpaces(defaultVal)) {
      return setError(validationMessage || 'This field is required')
    }
  }
  useEffect(() => {

    document.addEventListener('keydown', checkKeyboardEvent)

    checkValidation()
    // Finished will be (1) only if the Loading became true
    // If the Loading became false Again after Finished became (1) then finish the editing
    if (loading) setFinished(1)
    if (!loading && Finished === 1 && isTouched) setIsEditing(false)
    setDefault(props.defaultVal)
    console.log(newVal)

    return () => {
      setFinished(0)
      setError(null)
      document.removeEventListener('keydown', checkKeyboardEvent)
    }
  }, [isTouched, loading, error, props.defaultVal])

  return (
    <>
      <div className="text-left border-b-1-g mb-6 pb-2 border-b">
        <div className="flex items-center mb-2 mt-3">
          <label htmlFor={`update_${label}`} className="text-xl text-gray-600 mr-3">{label}</label>
          <EditIcon isEdit={isEditing} startEdit={() => setIsEditing(true)} />
        </div>

        <p className={`${isEditing ? 'hidden' : 'block'} mr-5  font-medium text-lg`}>{defaultVal || 'n.c.'}</p>
        {isEditing && <div >
          <input
            onFocus={() => setIsTouched(true)}
            onBlur={() => setIsTouched(false)}
            disabled={loading}
            autoFocus
            className={classes}
            onKeyUp={handleChange}
            id={`update_${label}`}
            type={inputType}
            placeholder={`Add ${label}`}
            defaultValue={defaultVal} />
          {required && <p className='text-red-400 mt-2'>{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" className="shadow py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white" onClick={cancel}>Cancel</button>
            <button type="button" className="shadow py-2 px-4 text-sm bg-green-500 rounded hover:opacity-70 text-white" onClick={submit}>{loading ? 'Update...' : 'Update'}</button>
          </div>
        </div>}
      </div>
    </>

  )
})

export default EditableInput