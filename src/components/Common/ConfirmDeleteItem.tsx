import React from 'react'

const ConfirmDeleteItem: React.FC<{ label: string, message?: string, confirmDelete: () => void, cancel: () => void }> = ({ label, message, confirmDelete, cancel }) => {
    return (
        
        <div className="gap-2 grid text-center">
            <h2 className='font-bold '>Are you sure you want to delete this {label}?</h2>
            {message && <p className='mb-3 text-gray-500'>{message}</p>}
            {!message && <p className='mb-3 text-gray-500'>By deleting it you will never be able to retrive it.</p>}
            <div className='flex items-center justify-around'>
                <button onClick={cancel} className=' py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white' > Cancel </button>
                <button onClick={confirmDelete} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > Delete </button>
            </div>

        </div>
    )
}

export default ConfirmDeleteItem