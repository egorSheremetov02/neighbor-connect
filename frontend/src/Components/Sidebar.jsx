import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import ImageUploader from "./ImageUploader";
import logo from "../assets/logo.png";
import { links } from "../assets/constants";

const NavLinks = ({ onLinkClick }) => (
  <div className="mt-10">
    {links.map(({ name, to, icon: Icon }) => {
      if (name === "Logout") {
        return (
          <button
            className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
            onClick={() => {
              sessionStorage.removeItem("TOKEN");
              window.location.href = "login";
            }}
            key={name}
          >
            <Icon className="w-6 h-6 mr-2" />
            {name}
          </button>
        );
      } else {
        return (
          <Fragment key={name}>
            <NavLink
              key={name}
              to={to}
              className="flex flex-row justify-start items-center my-8 text-sm font-medium text-black"
              onClick={onLinkClick}
            >
              <Icon className="w-6 h-6 mr-2" />
              {name}
            </NavLink>
          </Fragment>
        );
      }
    })}
  </div>
);

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#efeffb]">
       <ImageUploader/>
        <p
          id="webappname"
          className="text-2xl font-extrabold text-gray-800 mt-6 text-center tracking-wide shadow-md"
        >
          CampusConnect
        </p>
        <NavLinks />
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
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-[#8989cb] via-white/10 to-[#e2e2e2] backdrop-blur-lg z-10 p-6 md:hidden transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ImageUploader/>
        <p
          id="webappname"
          className="text-2xl font-extrabold text-gray-800 mt-6 text-center tracking-wide shadow-md"
        >
          CampusConnect
        </p>
        <NavLinks onLinkClick={handleMobileMenuToggle} />
      </div>
    </>
  );
};

export default Sidebar;
