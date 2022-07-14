import { FileUpload } from 'primereact/fileupload';
import { useEffect, useState } from 'react';
import noImage from '../public/noImage.png';


export default function Upload() {
  const [image, setImage] = useState(undefined);
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

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(noImage)
      return
    }
    setImage(e.target.files[0])
  }

  function UploadImage() {

  }

  return (
    <div className="w-6/12 ">
      {/* <form onSubmit={UploadImage}> */}
      <div className="flex flex-col w-auto">
        <div className="max-w-md my-5 mx-auto border-spacing-3 border-black">
          <img src={preview == undefined ? preview : noImage} alt="preview"
            width="auto" height="auto"
            className=""
          />
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
      <button type="submit">Enviar</button>
      {/* </form> */}
    </div>
  )
}