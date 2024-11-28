import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Avatar,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  TextField,
  Modal,
} from "@mui/material";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import EditProfileModal from "../Components/EditProfileModal";
import ChangePasswordModal from "../Components/EditPasswordModal";

const Profile = () => {
  const { userid } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [twoFAState, setTwoFAState] = useState("empty");
  const [qrCode, setQrCode] = useState(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

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

        // Check 2FA status
        const response2FA = await fetch("http://localhost:8080/2fa/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token.substring(1, token.length - 1)}`,
          },
        });
        const data2FA = await response2FA.json();
        setTwoFAState(data2FA.state);
      } catch (error) {
        setError("Error fetching profile and 2FA state");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handlePasswordChangeClick = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

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

  const handleGenerate2FA = async () => {
    const response = await fetch("http://localhost:8080/2fa/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token.substring(1, token.length - 1)}`,
      },
    });
    const data = await response.json();
    setQrCode(data.provisioning_uri);
    setIsConfirming(true);
  };

  const handleConfirm2FA = async () => {
    const response = await fetch(
      "http://localhost:8080/2fa/confirm_2fa_generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token.substring(1, token.length - 1)}`,
        },
        body: JSON.stringify({ code: twoFACode }),
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      setIsConfirming(false);
      setTwoFAState("created");
    } else {
      alert("Incorrect code, please try again.");
    }
  };

  const handleDelete2FA = async () => {
    await fetch("http://localhost:8080/2fa", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token.substring(1, token.length - 1)}`,
      },
    });
    setTwoFAState("empty");
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
            <>
              {twoFAState === "created" ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete2FA}
                >
                  Delete 2FA
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginBottom: "10px",
                    color: "black",
                    background: "#e2e2e2",
                    fontSize: "10px",
                    "&:hover": {
                      background: "#e2e2e2",
                    },
                  }}
                  onClick={handleGenerate2FA}
                >
                  Enable 2FA
                </Button>
              )}
            </>
          )}

          {isMyProfile && (
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                gap: "20px",
              }}
            >
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
              <Button
                variant="contained"
                color="primary"
                className="mt-4"
                startIcon={<LockOpenIcon />}
                onClick={handlePasswordChangeClick}
                sx={{
                  color: "black",
                  background: "#e2e2e2",
                  fontSize: "10px",
                  "&:hover": {
                    background: "#e2e2e2",
                  },
                }}
              >
                Change Password
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      <EditProfileModal
        open={isEditing}
        handleClose={handleClose}
        editData={editData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />

      {/* Confirm 2FA Modal */}
      <Modal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        className="flex justify-center items-center"
      >
        <div className="p-4 bg-white rounded shadow-lg">
          <QRCodeSVG value={qrCode} />
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <TextField
              label="Enter 2FA Code"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className="mt-4"
              InputProps={{
                sx: {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: "40px",
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "14px",
                },
              }}
            />
            <Button
              onClick={handleConfirm2FA}
              variant="contained"
              color="primary"
              className="mt-8"
              sx={{
                marginBottom: "10px",
                color: "black",
                background: "#e2e2e2",
                fontSize: "10px",
                "&:hover": {
                  background: "#e2e2e2",
                },
              }}
            >
              Confirm
            </Button>
          </Stack>
        </div>
      </Modal>
      <ChangePasswordModal
        open={isPasswordModalOpen}
        handleClose={handleClosePasswordModal}
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
