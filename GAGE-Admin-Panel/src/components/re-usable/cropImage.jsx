import React, {useState} from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import ReactCrop from "react-image-crop";
import {Button} from "shards-react";

const CropImage = ({aspectRatio, stateSetImage, setLocal, setError, imageLocation}) => {
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [modalImage, setModalImage] = useState(null);
    const [modalToggle, setModalToggle] = useState(false);

    const toggleRightModal = () => {
        setModalToggle(!modalToggle);
        
    };
    const cropRightImage = async () => {
        
        const image = new Image();
        image.src = modalImage;
        const croppedImageUrl = await getCroppedImg(image, crop);
        
        
        setLocal(croppedImageUrl);
        toggleRightModal();
        setModalImage(null);
    };
    const getCroppedImg = (image, crop) => {
        
        
        
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        
        
        stateSetImage(canvas.toDataURL('image/png'));
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                blob.name = 'newFile.png';
                window.URL.revokeObjectURL(image.src);
                resolve(window.URL.createObjectURL(blob));
            }, 'image/png');
        });
    }
    return (
        <div>
            <input
                // disabled={loading === "pending"}
                // required
                accept="image/png,  image/jpeg"
                className=" plainInput  "
                type="file"
                id="formFile"
                onClick={(e) => {
                    e.target.value = null;
                    // setImageError(null);
                    setError(null);
                    
                }}
                onChange={(e) => {
                    
                    
                    if (e.target.files[0].size <= 1000000) {
                        if (e.target.files && e.target.files.length > 0) {
                            setCrop(undefined) // Makes crop preview update between images.
                            const reader = new FileReader()
                            reader.addEventListener('load', () => {
                                    let image = new Image();
                                    image.src = reader.result;
                                    
                                    image.onload = () => {
                                        let canvas = document.createElement("canvas");
                                        let ctx = canvas.getContext("2d");
                                        let maxWidth = 300;
                                        let maxHeight = 300;
                                        let width = image.width;
                                        let height = image.height;
                                        if (width > height) {
                                            if (width > maxWidth) {
                                                height *= maxWidth / width;
                                                width = maxWidth;
                                            }
                                        } else {
                                            if (height > maxHeight) {
                                                width *= maxHeight / height;
                                                height = maxHeight;
                                            }
                                        }
                                        canvas.width = width;
                                        canvas.height = height;
                                        ctx.drawImage(image, 0, 0, width, height);
                                        let dataUrl = canvas.toDataURL("image/png");
                                        setModalImage(dataUrl);
                                    }
                                    // setModalImage(reader.result?.toString() || '')
                                }
                            )
                            reader.readAsDataURL(e.target.files[0])
                        }
                        // setModalImage(e.target.files[0]);
                        toggleRightModal();
                    } else {
                        // setImageError("right");
                        setError(imageLocation);
                        
                    }
                }}
                name="uploadFile"
            />
            <Modal isOpen={modalToggle} toggle={toggleRightModal} backdrop={false}>
                <ModalHeader>Crop Image</ModalHeader>
                <ModalBody className="text-center modalBg">
                    <p className="text-start ">Please select image area you want to show in Logo</p>
                    <ReactCrop crop={crop} aspect={aspectRatio} className="bg-dark" onChange={(c) => {
                        setCrop(c);
                        
                    }}>
                        <img src={modalToggle && modalImage} alt=""/>
                    </ReactCrop>
                    <div className="d-flex justify-content-start mt-3">
                        <Button className="editBtn w-50" onClick={cropRightImage}>Save</Button>
                        <Button className="deleteBtn mx-3 w-50" type="button"
                                onClick={toggleRightModal}>Cancel</Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default CropImage;
