import React, {useState} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

const EditImage = ({open, handleClose, handleSave}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const token = sessionStorage.getItem("TOKEN");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageSave = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("image_type", "profile");

        try {
            const response = await fetch("http://localhost:8000/image_storage/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
                },
                body: formData,
            });

            if (response.ok) {
                handleSave();
                handleClose();
            } else {
                console.error("Image upload failed");
            }
        } catch (error) {
            console.error("Error uploading image", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} style={{backdropFilter: "blur(5px)"}}>
            <DialogTitle>Edit Profile Image</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Choose a new profile image to upload.
                </DialogContentText>

                {preview ? (
                    <img
                        src={preview}
                        alt="Image Preview"
                        style={{width: "100%", height: "auto", borderRadius: "8px", marginBottom: "16px"}}
                    />
                ) : (
                    <div style={{
                        height: "200px",
                        width: "100%",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <p style={{color: "#888"}}>Image Preview</p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{marginTop: "16px"}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{
                    color: "black",
                    background: "#e2e2e2",
                    fontSize: "10px",
                    "&:hover": {background: "#d0d0d0"}
                }}>
                    Cancel
                </Button>
                <Button onClick={handleImageSave} sx={{
                    color: "black",
                    background: "#e2e2e2",
                    fontSize: "10px",
                    "&:hover": {background: "#d0d0d0"}
                }}>
                    Save Image
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditImage;
