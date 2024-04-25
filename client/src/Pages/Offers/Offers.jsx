import React, { useState, useRef } from "react";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Modal } from "react-responsive-modal";
import AddOffer from "./AddOffer";
import { Button } from "@mui/material";

export default function Offers() {
  const [likes, setLikes] = useState([13, 21, 3]); // Initial likes for each offer
  const [liked, setLiked] = useState([false, false, false]); // Initial liked state for each offer
  const [comments, setComments] = useState([[], [], []]); // Initial comments for each offer
  const [newComment, setNewComment] = useState(""); // State to store the newly typed comment
  const [newOffer, setNewOffer] = useState(null); // State to store the newly created offer
  const newOfferRef = useRef(null); // Ref for the new offer section

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  // Handle like button click
  const handleLikeClick = (index) => {
    setLiked((prevLiked) => {
      const newLiked = [...prevLiked];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
    setLikes((prevLikes) => {
      const newLikes = [...prevLikes];
      newLikes[index] = !liked[index]
        ? prevLikes[index] + 1
        : prevLikes[index] - 1;
      return newLikes;
    });
  };

  // Handle comment input change
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  // Handle comment submit
  const handleCommentSubmit = (index) => {
    if (newComment.trim() !== "") {
      setComments((prevComments) => {
        const newComments = [...prevComments];
        newComments[index] = [newComment, ...prevComments[index]]; // Prepend new comment to existing comments
        return newComments;
      });
      setNewComment("");
    }
  };

  // Handle new offer submission
  const handleNewOfferSubmit = (title, text, photos) => {
    // Process new offer data
    const newOfferData = {
      title: title,
      text: text,
      photos: photos,
    };
    setNewOffer(newOfferData);
  };

  // Scroll to the bottom of the page
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  // Render new offer if created
  if (newOffer) {
    const { title, text, photos } = newOffer;
    return (
      <div className="container mx-auto px-2 pt-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-md border p-4 mt-4" ref={newOfferRef}>
            <h2 className="text-lg font-semibold text-blue-600 hover:underline">
              {title}
            </h2>
            <p className="text-gray-700 mb-4 border-b-[1px] pb-4">
              {text}
              <div className="flex space-x-4 pt-4">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-28 h-28 rounded-md"
                  />
                ))}
              </div>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render existing offers
  return (
    
    <div className="container mx-auto px-2 pt-8">
      <Modal open={open} onClose={onCloseModal} center>
      <AddOffer />

      </Modal>

      <div className="flex my-4 justify-end">
        <Button
          variant="outlined"
          style={{
            backgroundColor: "transparent",
            color: "#1976d2",
          }}
          onClick={onOpenModal}
          sx={{ width: "150px", height: "40px" }}
        >
          Add Offers
        </Button>
      </div>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">New Offers</h1>

        {/* Your offer cards */}
        {likes.map((like, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border p-4 mt-4"
          >
            {/* Offer details */}
            <div className="flex items-center mb-4">
              <img
                className="w-12 h-12 rounded-full mr-3"
                src={`https://randomuser.me/api/portraits/${
                  index % 2 === 0 ? "men" : "women"
                }/${index + 1}.jpg`}
                alt="Profile Image"
              />
              <div>
                
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {index % 2 === 0 ? "John Doe" : "Jane Smith"}
                  </h2>
              </div>
            </div>
            <p className="text-gray-700 mb-4 border-b-[1px] pb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac
              orci fermentum, viverra erat at, accumsan elit. Proin ultrices
              auctor nisl, eu facilisis lectus condimentum eu.
              <div className="flex space-x-4 pt-4">
                <img
                  src={`./public/images/image-1.jpg`}
                  alt=""
                  className="w-28 h-28 rounded-md"
                />
                <img
                  src={`./public/images/image-2.jpg`}
                  alt=""
                  className="w-28 h-28 rounded-md"
                />
              </div>
            </p>
            <div className="border-b-[1px] pb-4 flex space-x-4">
              <div>
                <InsertCommentIcon style={{ fontSize: 16, color: "gray" }} />{" "}
                <span className="text-sm">
                  {comments[index].length === 0
                    ? "No Comments"
                    : comments[index].length === 1
                    ? "One Comment"
                    : `${comments[index].length} Comments`}
                </span>
              </div>
              <div
                onClick={() => handleLikeClick(index)}
                style={{ cursor: "pointer" }}
              >
                <FavoriteIcon
                  style={{
                    fontSize: 16,
                    color: liked[index] ? "red" : "gray",
                  }}
                />{" "}
                <span className="text-sm">{like} Likes</span>
              </div>
            </div>
            {/* Display comments */}
            {comments[index].reverse().map((comment, i) => (
              <div key={i} className="text-gray-700 mb-4 border-b-[1px] pb-4">
                <p>{comment}</p>
              </div>
            ))}
            <div className="flex flex-col p-4 mx-auto max-w-xl mt-4">
              <label
                className="mb-2 font-bold text-lg text-gray-900"
                htmlFor={`comment-${index}`}
              >
                Leave a Comment:
              </label>
              <textarea
                rows="1"
                value={newComment}
                onChange={handleCommentChange}
                className="mb-4 px-3 py-2 border-2 border-gray-300 rounded-lg"
                id={`comment-${index}`}
                name={`comment-${index}`}
                style={{ height: "50px" }}
              ></textarea>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCommentSubmit(index)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-[100px]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
