"use client";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export default function GroupChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const currentUser = "User1"; // Replace with dynamic user data

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7), // Generate a unique ID
      sender: currentUser,
      text: inputText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-hidden w-full">
      {/* Chat Header */}
        <NavBar />
        <div className="">
          
        </div>
    </div>
  );
}