import React, { useState, useEffect } from "react";
import { AiOutlineUpload } from "react-icons/ai";

const ImageUploader = () => {
  const [image, setImage] = useState(() =>
    localStorage.getItem("userImage")
      ? JSON.parse(localStorage.getItem("userImage"))
      : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImage(imageData);
        localStorage.setItem("userImage", JSON.stringify(imageData));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    localStorage.removeItem("userImage");
  };

  return (
    <div className="flex flex-col items-center">
      {image ? (
        <div className="relative group w-28 h-28 rounded-full border-4 border-gray-300 overflow-hidden">
          <img
            src={image}
            alt="Uploaded"
            className="object-cover w-full h-full"
          />
          <button
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-dashed border-gray-400 cursor-pointer">
          <AiOutlineUpload className="w-8 h-8 text-gray-600" />
          <span className="text-sm text-gray-600">Upload</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
