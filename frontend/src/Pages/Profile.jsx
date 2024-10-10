import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Card, CardContent, Button, Typography } from "@mui/material";
import EditProfileModal from "../Components/EditProfileModal";

import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const { userid } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const currentUserId = sessionStorage.getItem("myid");
  const token = sessionStorage.getItem("TOKEN");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/users/users/${userid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token.substring(1, token.length - 1)}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfile(data);
          setEditData((prev) => ({
            ...prev,
            fullName: data.fullName,
            permanent_address: data.permanent_address,
            current_address: data.current_address,
            gender: data.gender,
            phone_number: data.phone_number,
            birthday: data.birthday,
            bio_header: data.bio_header,
            bio_description: data.bio_description,
            interests: data.interests,
          }));
        } else {
          setError("Error fetching profile");
        }
      } catch (error) {
        setError("Error fetching profile", error);
      }
    };

    fetchProfile();
    setIsLoading(false);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log(editData);
    const dataToSubmit = {
      ...editData,
      interests: editData.interests
        .split(",")
        .map((interest) => interest.trim()), // split and trim interests
    };
    try {
      const response = await fetch(
        "http://localhost:8080/users/modify_my_profile/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        setProfile(editData);
        setIsEditing(false);
        console.log("Profile updated successfully");
        window.location.reload();
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const isMyProfile = profile && profile.id === parseInt(currentUserId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10">
      <Card
        className="w-full max-w-2xl"
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
        }}
      >
        <CardContent className="flex flex-col items-center">
          <Avatar
            sx={{ bgcolor: "#e2e2e2", width: 100, height: 100 }}
            className="mb-4"
          >
            <Typography sx={{ color: "#000", fontSize: "32px" }}>
              {profile?.fullName[0]}
            </Typography>
          </Avatar>
          <Typography variant="h4" className="mb-2 font-bold text-center">
            {profile?.fullName}
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-700 mb-4 text-center"
          >
            {profile?.bio_header}
          </Typography>
          <div className="w-full mb-4">
            <ProfileDetail
              icon={<EmailIcon />}
              label="Email"
              value={profile?.email}
            />
            <ProfileDetail
              icon={<HomeIcon />}
              label="Permanent Address"
              value={profile?.permanent_address}
            />
            <ProfileDetail
              icon={<HomeIcon />}
              label="Current Address"
              value={profile?.current_address}
            />
            <ProfileDetail
              icon={<PhoneIcon />}
              label="Phone Number"
              value={profile?.phone_number}
            />
            <ProfileDetail
              icon={<PersonIcon />}
              label="Gender"
              value={profile?.gender}
            />
            <ProfileDetail
              icon={<CalendarTodayIcon />}
              label="Birthday"
              value={new Date(profile?.birthday).toLocaleDateString()}
            />
            <ProfileDetail
              icon={<CalendarTodayIcon />}
              label="Member Since"
              value={new Date(profile?.member_since).toLocaleDateString()}
            />
            <ProfileDetail
              icon={<InfoIcon />}
              label="Bio Description"
              value={profile?.bio_description}
            />
            <ProfileDetail
              icon={<InfoIcon />}
              label="Interests"
              value={profile?.interests.join(", ")}
            />
          </div>

          {isMyProfile && (
            <Button
              variant="contained"
              color="primary"
              className="mt-4"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{
                color: "black",
                background: "#e2e2e2",
                fontSize: "10px",
                "&:hover": {
                  background: "#e2e2e2",
                },
              }}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditing}
        handleClose={handleClose}
        editData={editData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </div>
  );
};

const ProfileDetail = ({ icon, label, value }) => {
  return (
    <div className="flex items-center mb-4">
      <span className="mr-2 text-gray-600">{icon}</span>
      <Typography variant="body2" className="text-gray-500">
        <strong>{label}:</strong> {value}
      </Typography>
    </div>
  );
};

export default Profile;
