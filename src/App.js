import "./App.css";
import { useEffect, useState } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function App() {
  const [imagesUpload, setImagesUpload] = useState([]);
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, "images/");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImagesUpload(files);
  };

  const uploadImages = () => {
    if (imagesUpload.length === 0) return;

    imagesUpload.forEach((image) => {
      const storageRef = ref(storage, `images/${image.name + v4()}`);
      uploadBytes(storageRef, image).then((snaphsot) => {
        getDownloadURL(snaphsot.ref).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="col-md-10 offset-1">
      <div className="col-md-6 offset-2">
        <input
          type="file"
          className="form-control mt-5"
          onChange={handleFileChange}
          multiple // Allow multiple file selection
        />
        <button className="my-3" onClick={uploadImages}>
          Upload Images
        </button>
      </div>
      <div className="row mt-3">
        <div className="col-md-10 offset-1">
          {imageList &&
            imageList.map((url) => {
              return (
                <img
                  key={url} // Add a unique key for each image
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  src={url}
                  alt={url}
                  className="m-3 rounded img-fluid img-thumbnail"
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
