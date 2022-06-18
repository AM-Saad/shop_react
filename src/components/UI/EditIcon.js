import React from "react";
import editIcon from '../../public/images/editIcon.png'

const EditIcon = ({startEdit, isEdit}) => {
return <div className={`h-6 w-6 bg-blue-100 shadow-md rounded-full p-2 cursor-pointer hover:bg-blue-200 ${isEdit ? 'hidden' : 'block'}`}  onClick={() => {startEdit()}}>
    <img className="w-full h-full" src={editIcon} alt="edit-ocpn"/>
</div>

}

export default EditIcon;
