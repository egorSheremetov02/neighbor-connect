import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
  HiOutlineChat
} from "react-icons/hi";

const userid = sessionStorage.getItem("myid");

export const links = [
  { name: "Home", to: "/home", icon: HiOutlineHome },
  {
    name: "Neighbors",
    to: "/neighbors",
    icon: HiOutlineUserGroup,
  },
  { name: "Profile", to: `/profile/${userid}`, icon: HiOutlinePhotograph },
  {
    name: "Chats",
    to: "/chats",
    icon: HiOutlineChat
  },
  { name: "Logout", to: "/logout", icon: HiOutlineHashtag },
];
