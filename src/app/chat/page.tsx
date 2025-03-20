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
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">Group Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === currentUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 text-gray-400">
                {message.sender} • {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="bg-white p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}