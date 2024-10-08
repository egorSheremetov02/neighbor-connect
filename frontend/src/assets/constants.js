import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
} from "react-icons/hi";

export const links = [
  { name: "Home", to: "/home", icon: HiOutlineHome },
  {
    name: "Neighbors",
    to: "/neighbors",
    icon: HiOutlineUserGroup,
  },
  { name: "Profile", to: "/profile", icon: HiOutlinePhotograph },
  { name: "Logout", to: "/logout", icon: HiOutlineHashtag },
];
