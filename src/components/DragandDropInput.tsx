import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
interface DragAndDropInputProps {
    submit: (file: File) => Promise<void>;
}

const DragAndDropInput: React.FC<DragAndDropInputProps> = ( {submit}) => {

  const [isUploading, setIsUploading] = useState<boolean>(false);

    const onSubmit = (file: File) => {
        setIsUploading(true);
        submit(file).then(() => { 
            setIsUploading(false);
         });

    }
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
        <DropzoneArea 
        filesLimit={1}
        acceptedFiles={['application/pdf']}
        dropzoneText={isUploading ? "Uploading": "Drag and drop a document here or click"}
        onChange={(files) => onSubmit(files[0])}
        showFileNames/>
    </div>
   
  );
};

export default DragAndDropInput;
