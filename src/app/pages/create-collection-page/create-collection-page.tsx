import React, { useState } from 'react';

import UploadIcon from '../../component/uploadIcon';

export const CreateCollectionPage = () => {

    const [loadImage, setLoadImage] = useState("");
    const [uploadFile, setUploadFile] = useState<File>();

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null || event.target.files.length === 0) {
            return;
        }
        setUploadFile(event.target.files[0]);
        setLoadImage(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <div className="d-flex w-100 justify-content-center">
            <div className="d-flex flex-column bg-primary mt-120 min-vh-100">
                <div className="text-white font-36"> Create Collection </div>
                <div className="d-flex flex-column justify-content-between flex-lg-row border-1 border-radius-10 border-secondary mt-20 p-20">
                    <div className="d-flex justify-content-center align-items-center width-400 height-400 border-1 border-radius-10 border-secondary">
                        <div className="d-flex flex-column justify-content-center align-items-center position-absolute">
                            <UploadIcon className="width-150 height-150" />
                            <div className="font-24 text-white">
                                Choose Image File
                            </div>
                        </div>
                        <input className="position-absolute cursor-pointer width-400 height-400"
                               style={{ opacity: 0 }}
                               type="file" accept="image/*" onChange={(event) => selectFile(event)}/>
                        <img className="border-radius-10 object-fit-cover w-100 h-100" src={loadImage} alt="img" />
                    </div>
                    <div className="d-flex flex-column justify-content-between ml-20">
                        <div className="d-flex flex-column">
                            <div className="font-26 text-white"> Collection Name </div>
                            <input className="font-15 mt-20 w-100 height-40 bg-dark text-white border-1 border-secondary border-radius-7" type="text" placeholder="Collection Name" name="name"/>
                        </div>
                        <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white">
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
