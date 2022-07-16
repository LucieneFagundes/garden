import Image from 'next/image';
import { FileUpload } from 'primereact/fileupload';
import { useEffect, useState } from 'react';
import noImage from '../public/noImage.png';

type UploadProps = {
  // handleUploadImage?: () => string | ArrayBuffer;
  photo?: any;
}

export default function Upload(data: UploadProps) {
  const [image, setImage] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);
  const [preview, setPreview] = useState(undefined);

  useEffect(() => {
    if (!image) {
      setPreview(noImage)
      return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const onSelectFile = async event => {
    event.preventDefault();

    if (!event.target.files || event.target.files.length === 0) {
      setImage(noImage)
      return
    }
    setImage(event.target.files[0])

    const file = event.target.files[0];
    // console.log(file);
    const reader = new FileReader();
    let blob = await fetch(file.objectURI).then(r => r.blob()); //blob:url
    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      setPhoto(base64data.toString());
      // console.log(photo);
    }
  }

  function handleUploadImage() {
    if(!photo){
      return undefined
    }
    return photo;
  }

  return (
    <div className="flex flex-col w-auto items-center">
      <div className="max-w-md my-5 mx-auto block">
        <Image src={preview != undefined ? preview : noImage} alt="preview" width={300} height={300} />
      </div>
      <input
        type="file"
        name="image"
        id="image"
        accept='image/*'
        size={1000000}
        onChange={onSelectFile}
      />
    </div>
  )
}