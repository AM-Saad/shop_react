import React, { useState, useEffect } from 'react'
import classes from './UploadImage.module.css'


export default function UploadImage(props) {

    const [selectedFiles, setSelectedFiles] = useState([])
    const [preview, setPreview] = useState()

  
    // let image = props.image ? url + "/" + props.image : 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder.jpg'
    let image = props.image || ''
    const resetUploadingImage = () =>{
        setPreview(image)
        setSelectedFiles([])

    }

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFiles[0])
        setPreview(objectUrl)
        props.childFunc.current = resetUploadingImage
        // free memory when ever this component is unmounted
        return () => {
        URL.revokeObjectURL(objectUrl)}
    }, [selectedFiles])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFiles(undefined)
            return
        }
        setSelectedFiles(e.target.files)
        props.onSelectImage(e.target.files)
    }
    return (
        <div className={classes['img-input-container']}>
            <div className={classes['img-input-container']}>

            <img src={preview} id="uploadImg" className={`${preview ? 'opacity-100': 'opacity-0'}`} alt="Product Images" />
            <div className={classes['input']}>
                <label className="label" htmlFor="image"></label>
                <input className={classes['image-input']} id="image" type='file' onChange={onSelectFile} multiple/>
            </div>
            </div>
         
        </div>
    )
}