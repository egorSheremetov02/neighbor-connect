import React from "react";
import { Button } from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import TelegramIcon from "@mui/icons-material/Telegram";
import DiscountIcon from "@mui/icons-material/Discount";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MapIcon from "@mui/icons-material/Map";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchBar from "./SearchBar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { TextField } from "@mui/material";

export default function Chat() {
  return (
    <div>
      {/* the whole page */}
      <div>
        {/* the page title */}
        
       
        {/* the main chat boxes */}
        <div className="flex bg-sky-50 border-[1px] mt-5 border-sky-500 p-4">
            
          {/* the leftside */}
          <div className=" border-[1px] border-blue-300 px-2 flex-1">
            {/* the searchbar */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <AddCircleOutlineIcon className="text-gray-600" />
              </div>
              <span className="flex items-center space-x-2">
                <SearchBar />
                <MenuRoundedIcon
                  className="text-gray-600"
                  sx={{ fontSize: 30 }}
                />
              </span>
            </div>
            {/* the chats */}
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1 bg-blue-200">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-gray-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-gray-200"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-red-00"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-gray-300"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-brown-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-blue-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-red-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-pink-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-green-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 mb-4 border-[1px] border-gray-400 p-1">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-yellow-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
          {/* the right side */}
          <div>
            {/* the selected client */}
            <div className="flex items-center border-[1px] border-blue-300">
              <span>
                <CircleRoundedIcon
                  className="w-10 h-10 text-green-700"
                  sx={{ fontSize: 54 }}
                />
              </span>
              <div>
                <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                <p className="text-xs">35 members</p>
              </div>
            </div>

            {/* the conversation */}
            <div className="  mt-3 mx-2 py-1 mb-5 flex-col space-y-4 ">
              <div className="flex space-x-1 mb-3  bg-blue-300">
                <span>
                  <CircleRoundedIcon
                    className="w-10 h-10 text-green-700"
                    sx={{ fontSize: 54 }}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                  <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 mb-3  bg-blue-300">
                <span>
                  <CircleRoundedIcon
                    className="w-10 h-10 text-green-700"
                    sx={{ fontSize: 54 }}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                  <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 mb-3  bg-blue-300">
                <span>
                  <CircleRoundedIcon
                    className="w-10 h-10 text-green-700"
                    sx={{ fontSize: 54 }}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                  <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 mb-3  bg-blue-300">
                <span>
                  <CircleRoundedIcon
                    className="w-10 h-10 text-green-700"
                    sx={{ fontSize: 54 }}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                  <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 mb-3  bg-blue-300">
                <span>
                  <CircleRoundedIcon
                    className="w-10 h-10 text-green-700"
                    sx={{ fontSize: 54 }}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-medium"> Rowing Club Bremen</h2>
                  <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry.Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            {/* the typing form */}
            <div className="mx-3 flex items-center mt-[250px]">

            <TextField fullWidth label="Write a message"  id="fullWidth " /> <TelegramIcon sx={{fontSize:30}} className="text-blue-400" />
          </div>
            </div>
        </div>
      </div>
    </div>
  );
}
