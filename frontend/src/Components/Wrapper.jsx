import React from "react";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";

const Wrapper = ({ children }) => {
  return (
    <div className="relative flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br ">
        <Searchbar />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
