import React from "react";
import { Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";

export default function Profile() {
  return (
    <div>
      {/* the whole prfile page */}

      <div>
        {/* the website name */}
        
        {/* the options buttons */}
        
        {/* profile main contect */}
        <div className="flex border-[1px] border-sky-300 mt-3 sm:h-[750px] h-[1000px] mb-2 bg-sky-50">
          {/* the left side */}
          <div className="flex-1 border-[1px] border-sky-300  sm:pt-10 pt-3">
            {/* personal information */}
            <div className="flex sm:flex-col sm:px-20 px-10 text-center ">
              <img
                src="public/images/profile.jfif"
                alt=""
                className="sm:w-24 sm:h-24 w-10 h-10 rounded-full mb-4 mt-3"
              />
              <div>
                <h1 className="sm:text-xl text-sm font-semibold">Username</h1>
                <h2 className="sm:text-sm text-xs text-blue-500">Status</h2>
                <h2 className="sm:text-sm text-xs">Location</h2>
              </div>
            </div>
            {/* contact details */}
            <div className="flex flex-col mt-6 px-4 space-y-2">
              <h2 className="sm:text-lg text-sm font-medium">Contact Details :</h2>
              <span className="flex items-center">
                {" "}
                <PhoneIcon
                  className="text-stone-700 sm:text-lg mr-2 "
                  sx={{ fontSize: 16 }} sm:sx={{ fontSize:8}}
                />
                +1234567890
              </span>
              <span className="flex items-center ">
                {" "}
                <TelegramIcon
                  className="text-stone-700 sm:text-lg text-sm mr-2 "
                  sx={{ fontSize: 16 }}
                />
                Unser_name
              </span>
              <span className="flex items-center">
                {" "}
                <EmailIcon
                  className="text-stone-700 text-lg mr-2"
                  sx={{ fontSize: 16 }}
                />
                Email Adress
              </span>
            </div>
          </div>
          {/* the right side */}
          <div className="pl-5 mt-10 pr-3">
            {/* the BIO */}
            <div>
              <h2 className="sm:text-lg  font-medium sm:mb-2">Bio:</h2>
              <p className="sm:text-sm text-xs">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              {/* interests */}
              <h2 className="text-lg font-medium mt-4 mb-5 ">Interests:</h2>
              <div className="space-x-5 space-y-3 flex flex-wrap">
                <span className="bg-blue-500 px-4 rounded-md text-white py-[2px]">
                  sport
                </span>
                <span className="bg-yellow-500 px-4 rounded-md text-white py-[2px]">
                  Guitar palying
                </span>
                <span className="bg-gray-700 px-4 rounded-md text-white py-[2px]">
                  Swimming
                </span>
                <span className="bg-blue-500 px-4 rounded-md text-white py-[2px]">
                  sport
                </span>
                <span className="bg-teal-500 px-4 rounded-md text-white py-[2px]">
                  Guitar palying
                </span>
                <span className="bg-gray-500 px-4 rounded-md text-white py-[2px]">
                  Swimming
                </span>
                <span className="sm:bg-blue-500 sm:px-4 sm:rounded-md sm:text-white sm:py-[2px] invisible">
                  sport
                </span>
                <span className="sm:bg-yellow-500 sm:px-4 sm:rounded-md sm:text-white sm:py-[2px] invisible">
                  Guitar palying
                </span>
                <span className="sm:bg-teal-500 sm:px-4 sm:rounded-md sm:text-white sm:py-[2px] invisible">
                  Swimming
                </span>
                <span className="invisible sm:bg-blue-500 sm:px-4 sm:rounded-md sm:text-white sm:py-[2px]">
                  sport
                </span>
              </div>
            </div>
            {/* the Common Groups */}
            <div className="sm:mt-16">
              <span className="sm:text-lg">Common groups:</span>
              {/* the first common */}
              <div className="flex mt-4 items-center mb-8">
                <img
                  src="public/images/profile.jfif"
                  className="sm:w-12 sm:h-12 w-8 h-8 rounded-full mr-3"
                  alt=""
                />
                <div>
                  <h2 className="sm:text-sm text-xs font-medium">UserName 1</h2>
                  <p className="sm:text-xs text-[8px]">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <div className="flex flex-wrap space-x-2 mt-2">
                    <span className="bg-teal-500 sm:px-2 px-1 rounded-md text-white py-[1px] text-xs ">
                      Sport
                    </span>
                    <span className="bg-blue-500 sm:px-2 px-1 rounded-md text-white py-[1px] text-xs">
                      Music
                    </span>
                    <span className="bg-gray-500 sm:px-2 px-1 rounded-md text-white py-[1px] text-xs">
                      Swimming
                    </span>
                  </div>
                </div>
              </div>
              {/* the second common */}
              <div className="flex mt-4 items-center mb-8">
                <img
                  src="public/images/profile.jfif"
                  className="sm:w-12 sm:h-12 w-8 h-8 rounded-full mr-3"
                  alt=""
                />
                <div>
                  <h2 className="sm:text-sm text-xs font-medium">UserName 2</h2>
                  <p className="sm:text-xs text-[8px]">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <div className="flex flex-wrap space-x-2 mt-2">
                    <span className="bg-yellow-500 sm:px-2 px-1 rounded-md text-white py-[1px] text-xs ">
                      Coffee
                    </span>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
