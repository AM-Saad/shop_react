import React, { useEffect } from 'react'

import classes from './Modal.module.css'

const Modal: React.FC<any> = ({ open, close, children, styles }) => {

    useEffect(() => {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close()
            }
        })
        return () => document.removeEventListener('keydown', close)
    })
    return (
        <div onClick={close} className={`bg-white bg-opacity-20 ${open ? classes["modal--open"] : classes["modal--close"]}`}>
            <div onClick={(e) => e.stopPropagation()} className={`shadow-lg rounded-md p-5 bg-white ${styles}`}>
                <span className="border  cursor-pointer flex h-8 hover:bg-gray-100 items-center justify-around my-1 rounded-full w-8" onClick={close}>X</span>
                <span className="modalText">{children}</span>
            </div>
        </div>
    )
}

export default Modal