import React from "react";
import image from "../assets/profile-sample.png";

export default function ChatContact({
  contacts,
  selectedChatContact,
  selectChatContact,
}) {
  return (
    <div className="xl:w-[300px] w-auto space-x-3 xl:space-x-0 flex xl:block p-2 overflow-scroll">
      {contacts.map((contact) => (
        <Avatar
          contact={contact}
          selectChatContact={selectChatContact}
          isSelected={contact === selectedChatContact}
        />
      ))}
    </div>
  );
}

function Avatar({ contact, selectChatContact, isSelected }) {
  return (
    <div
      onClick={() => selectChatContact(contact)}
      className={`flex items-center gap-3 p-2 py-2 pr-5 xl:pr-0 xl:my-2 rounded-full xl:rounded-md cursor-pointer ${
        !isSelected && "hover:bg-blue-100"
      } ${isSelected && "bg-blue-200"}`}>
      <img
        src={image}
        alt="Avatar"
        className="w-[50px] h-[50px] rounded-full border"
      />
      <p>{contact}</p>
    </div>
  );
}
