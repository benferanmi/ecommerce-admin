import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Spinner from "./Spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: esistingPrice,
  uploadedFiles: existingFiles
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(esistingPrice || '');
  const [goToProducts, setGoToProducts] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(existingFiles || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter()


  const fliteredImages = {};
  const filteredArray = uploadedFiles.filter(obj => {
    const key = obj.filePath;
    const isUnique = !fliteredImages[key];
    fliteredImages[key] = true;
    return isUnique;
  });

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price, uploadedFiles:filteredArray }
    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id })
      setGoToProducts(true)
    } else {
      //create
      await axios.post('/api/products', data)
      setGoToProducts(true)
    }
  };

  console.log("this is flittered array" + filteredArray.map(index => index.filePath));

  if (goToProducts) {
    router.push('/products')
  }

  async function uploadImages(e) {
    e.preventDefault();
    setLoading(true)
    const files = e.target.files

    if (files?.length > 0) {
      const data = new FormData();

      for (const file of files) {
        data.append('file', file);
      }
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });

        if (response.ok) {
          const responseData = await response.json()
          setUploadedFiles([...existingFiles, ...responseData.uploadedFiles]);
          setLoading(false)
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  }
  console.log("this is uploaded" + uploadedFiles.map(file => file.filePath));


  return (
    <form onSubmit={saveProduct}>
      <label >Product Name</label>
      <input
        type="text"
        placeholder="product name"
        className="h-6"
        value={title}
        onChange={(e) => setTitle(e.target.value)} />

      <label>Photos</label>
      <div className="mb-2 ">
        <label htmlFor="images" className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm text-gray-500 gap-1 rounded-lg bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
          </svg>
          <div>
            Upload
          </div>
          <input
            onChange={uploadImages}
            multiple
            id="images"
            type="file"
            className="hidden" />
        </label>
        <div className="flex gap-2 flex-wrap">
          {
            filteredArray?.map((file, index) => (
              <img key={index} src={'/' + file.filePath} className="h-24 w-24"></img>
            ))
          }
          {
            loading && <div class="flex align-center justify-center "><Spinner /></div>
          }
        </div>


      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}></textarea>

      <label >Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)} />

      <button type="submit" className="btn-primary" >Save</button>

    </form>
  );
}