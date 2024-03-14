import "./App.css";
import { useEffect, useState } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function App() {
  const [imagesUpload, setImagesUpload] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // New state to track selected image
  const imageListRef = ref(storage, "images/");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImagesUpload(files);
  };

  const uploadImages = () => {
    if (imagesUpload.length === 0) return;

    imagesUpload.forEach((image) => {
      const storageRef = ref(storage, `images/${image.name + v4()}`);
      uploadBytes(storageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
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

  const enlargeImage = (url) => {
    setSelectedImage(url);
  };

  const closeEnlargeImage = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="col-md-10 offset-1">
        <div className="col-md-6 offset-2">
          <input
            type="file"
            className="form-control mt-5"
            onChange={handleFileChange}
            multiple // Allow multiple file selection
          />
          <button
            className="my-3 btn btn-outline-success"
            onClick={uploadImages}
          >
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
                      cursor: "pointer", // Add pointer cursor for clickable images
                    }}
                    src={url}
                    alt={url}
                    className="m-3 rounded img-fluid img-thumbnail"
                    onClick={() => enlargeImage(url)} // Call enlargeImage function on click
                  />
                );
              })}
          </div>
        </div>
      </div>
      {/* Conditionally render enlarged image with overlay */}
      {selectedImage && (
        <div className="enlarged-container">
          <div
            className="enlarged-background"
            onClick={closeEnlargeImage}
          ></div>
          <div className="enlarged-content">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="enlarged-image"
            />
            <button className="close-button btn btn-danger fw-bold" onClick={closeEnlargeImage}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
