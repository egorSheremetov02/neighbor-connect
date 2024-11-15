// import React, { Fragment, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { HiOutlineMenu } from "react-icons/hi";
// import { RiCloseLine } from "react-icons/ri";

// import logo from "../assets/logo.png";
// import { links } from "../assets/constants";

// const NavLinks = ({ onLinkClick }) => (
//   <div className="mt-10">
//     {links.map(({ name, to, icon: Icon }) => {
//       if (name === "Logout") {
//         return (
//           <button
//             className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
//             onClick={() => {
//               sessionStorage.removeItem("TOKEN");
//               window.location.href = "login";
//             }}
//             key={name}
//           >
//             <Icon className="w-6 h-6 mr-2" />
//             {name}
//           </button>
//         );
//       } else {
//         return (
//           <Fragment key={name}>
//             <NavLink
//               key={name}
//               to={to}
//               className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
//               onClick={onLinkClick}
//             >
//               <Icon className="w-6 h-6 mr-2" />
//               {name}
//             </NavLink>
//           </Fragment>
//         );
//       }
//     })}
//   </div>
// );

// const Sidebar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleMobileMenuToggle = () => {
//     setIsMobileMenuOpen((prevState) => !prevState);
//   };

//   return (
//     <>
//       <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#e2e2e2]">
//         <img
//           src={logo}
//           alt="Company Logo"
//           className="w-full h-14 object-contain"
//         />
//         <NavLinks />
//       </div>

//       {/* Mobile sidebar toggle button */}
//       <div className="absolute md:hidden block top-1 right-3">
//         {isMobileMenuOpen ? (
//           <RiCloseLine
//             className="w-6 h-6 text-black"
//             onClick={handleMobileMenuToggle}
//           />
//         ) : (
//           <HiOutlineMenu
//             className="w-6 h-6 text-black"
//             onClick={handleMobileMenuToggle}
//           />
//         )}
//       </div>

//       {/* Mobile sidebar menu */}
//       <div
//         className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#e2e2e2] backdrop-blur-lg z-10 p-6 md:hidden transition-transform duration-300 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <img
//           src={logo}
//           alt="Company Logo"
//           className="w-full h-14 object-contain"
//         />
//         <NavLinks onLinkClick={handleMobileMenuToggle} />
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React, { Fragment, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import { Avatar, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import logo from "../assets/logo.png";
import { links } from "../assets/constants";

const ProfilePictureUploader = () => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="relative cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageUpload}
        />
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="w-30 h-30 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
            +
          </div>
        )}
      </label>
    </div>
  );
};

const NavLinks = ({ onLinkClick, profilePic, onProfilePicChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="">
      <div className="my-8 flex items-center justify-between">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full mr-2 cursor-pointer"
            onClick={() => onProfilePicChange(null)}
          />
        ) : (
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onProfilePicChange}
            />
            <span className="text-black text-sm font-medium">
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#e0e0e0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <IconButton>
                  <CameraAltIcon sx={{ color: "#333", fontSize: 24 }} />
                </IconButton>
              </Avatar>
            </span>
          </label>
        )}
      </div>
      {links.map(({ name, to, icon: Icon }) => (
        <Fragment key={name}>
          {name === "Logout" ? (
            <button
              className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
              onClick={() => {
                sessionStorage.removeItem("TOKEN");
                window.location.href = "login";
              }}
            >
              <Icon className="w-6 h-6 mr-2" />
              {name}
            </button>
          ) : (
            <NavLink
              to={to}
              className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
              onClick={onLinkClick}
            >
              <Icon className="w-6 h-6 mr-2" />
              {name}
            </NavLink>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic")
  );

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleProfilePicChange = (e) => {
    if (e?.target?.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfilePic(imageUrl);
        localStorage.setItem("profilePic", imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePic(null);
      localStorage.removeItem("profilePic");
    }
  };

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] px-4 bg-[#e2e2e2]">
        <NavLinks
          profilePic={profilePic}
          onProfilePicChange={handleProfilePicChange}
        />
      </div>

      {/* Mobile sidebar toggle button */}
      <div className="absolute md:hidden block top-1 right-3">
        {isMobileMenuOpen ? (
          <RiCloseLine
            className="w-6 h-6 text-black"
            onClick={handleMobileMenuToggle}
          />
        ) : (
          <HiOutlineMenu
            className="w-6 h-6 text-black"
            onClick={handleMobileMenuToggle}
          />
        )}
      </div>

      {/* Mobile sidebar menu */}
      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#e2e2e2] backdrop-blur-lg z-10 p-6 md:hidden transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img
          src={logo}
          alt="Company Logo"
          className="w-full h-14 object-contain"
        />
        <NavLinks onLinkClick={handleMobileMenuToggle} />
      </div>
    </>
  );
};

export default Sidebar;
