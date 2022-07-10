import React, { useState, useEffect, useRef } from 'react'
import classes from './UploadImage.module.css'

interface Props {
    image: string
    cancelUpload: any
    cleanInputValues: any
    onSelectImage: (value: any[]) => void

}

const UploadImage: React.FC<Props> = (props) => {
    const { onSelectImage, cancelUpload, cleanInputValues } = props
    const [selectedFiles, setSelectedFiles] = useState<any>([])
    const [preview, setPreview] = useState<string>()
    const uploadField = useRef<any>()

    
    let image = props.image || ''
    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFiles(undefined)
            return
        }
        setSelectedFiles(e.target.files)
        onSelectImage(e.target.files)
    }

    const resetUploadingImage = () => {
        setPreview(image)
        setSelectedFiles([])
        uploadField.current.value = '';

    }
    const cleanInput = () => uploadField.current.value = '';

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreview(undefined)
            return
        }
        const objectUrl: string = URL.createObjectURL(selectedFiles[0])
        setPreview(objectUrl)
        cancelUpload.current = resetUploadingImage
        cleanInputValues.current = cleanInput

        return () => {

            URL.revokeObjectURL(objectUrl)
        }
    }, [selectedFiles])


    return (
        <div className={classes['img-input-container']}>
            <div className={classes['img-input-container']}>

                <img src={preview} id="uploadImg" className={`${preview ? 'opacity-100' : 'opacity-0'}`} alt="Product Images" />
                <div className={classes['input']}>
                    <label className="label" htmlFor="image"></label>
                    <input ref={uploadField} className={classes['image-input']} id="image" type='file' onChange={onSelectFile} multiple />
                </div>
            </div>

        </div>
    )
}

export default UploadImage