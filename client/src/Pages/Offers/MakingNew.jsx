import React, { useState } from "react";

export default function MakingNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = event.target.files;
    const selectedImagesArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(selectedImagesArray);
  };

  const handlePost = () => {
    // Implement your post functionality here
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Selected Images:", selectedImages);
  };

  const handleCancel = () => {
    // Clear all fields and data
    setTitle("");
    setDescription("");
    setSelectedImages([]);
  };

  return (
    <div className="mt-52 mb-20">
      <div className="heading text-center font-bold text-2xl m-5 text-gray-800">
        New Post
      </div>
      <style>
        {`
          body {background:white !important;}
          .textarea-with-images {
            position: relative;
          }
          .textarea-overlay {
            position: absolute;
            bottom: 10px;
            left: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          .selected-image {
            width: 100px;
            height: 100px;
          }
          .editor {
            position: relative;
          }
          textarea {
            width: 100%;
            height: 150px; /* Adjust height as needed */
          }
        `}
      </style>
      <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
        <input
          className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
          spellCheck="false"
          placeholder="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="textarea-with-images">
          <textarea
            className="description bg-gray-100 sec p-3 border border-gray-300 outline-none"
            spellCheck="false"
            placeholder="Describe everything about this post here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="textarea-overlay">
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Selected ${index + 1}`}
                className="selected-image"
              />
            ))}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <svg
            className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </label>
        <div className="buttons flex">
          <div
            className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto"
            onClick={handleCancel}
          >
            Cancel
          </div>
          <div
            className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
            onClick={handlePost}
          >
            Post
          </div>
        </div>
      </div>
    </div>
  );
}
