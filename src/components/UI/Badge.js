import React from 'react'

const Badge = (props) => {
    return (
        <>
            <span className="inline-flex rounded-full items-center py-0.5 px-2 text-sm font-medium bg-indigo-100 text-indigo-700">
                {props.label}
            </span>
        </>
    )
}

export default Badge