"use client";
import React, { useState } from "react";


export default function ChatPage() {
 const [messages, setMessages] = useState([
   { from: "Alice", text: "Hey! Are we still working on the timeline today?" },
   { from: "You", text: "Yep, just started updating it!" },
   { from: "Alice", text: "Nice, let me know if you need help." },
 ]);
 const [newMessage, setNewMessage] = useState("");


 const handleSend = () => {
   if (newMessage.trim() === "") return;
   setMessages([...messages, { from: "You", text: newMessage }]);
   setNewMessage("");
 };


 return (
   <div
     style={{
       height: "100%",
       width: "100%",
       display: "flex",
       flexDirection: "column",
       backgroundColor: "#ffffff",
       borderRadius: "12px",
       boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
     }}
   >
     {/* Header */}
     <div
       style={{
         backgroundColor: "#385773",
         color: "#ffffff",
         padding: "16px",
         borderTopLeftRadius: "12px",
         borderTopRightRadius: "12px",
         fontSize: "18px",
         fontWeight: 600,
       }}
     >
       💬 Project Chat
     </div>


     {/* Messages Area */}
     <div
       style={{
         flex: 1,
         overflowY: "auto",
         padding: "24px 16px",
         display: "flex",
         flexDirection: "column",
         gap: "16px",
       }}
     >
       {messages.map((msg, idx) => (
         <div
           key={idx}
           style={{
             maxWidth: "70%",
             padding: "10px 16px",
             borderRadius: "12px",
             backgroundColor: msg.from === "You" ? "#DCF8C6" : "#E5E7EB",
             alignSelf: msg.from === "You" ? "flex-end" : "flex-start",
             textAlign: msg.from === "You" ? "right" : "left",
           }}
         >
           <p style={{ color: "#1F2937", fontWeight: 500 }}>{msg.text}</p>
           <p style={{ fontSize: "10px", color: "#6B7280", marginTop: "4px" }}>
             {msg.from}
           </p>
         </div>
       ))}
     </div>


     {/* Input Bar */}
     <div
       style={{
         padding: "16px",
         borderTop: "1px solid #E5E7EB",
         display: "flex",
         gap: "8px",
       }}
     >
       <input
         type="text"
         placeholder="Type your message..."
         value={newMessage}
         onChange={(e) => setNewMessage(e.target.value)}
         onKeyDown={(e) => e.key === "Enter" && handleSend()}
         style={{
           flex: 1,
           padding: "10px 16px",
           border: "1px solid #D1D5DB",
           borderRadius: "8px",
           outline: "none",
           fontSize: "14px",
           color: "#1F2937",
           backgroundColor: "#ffffff",
         }}
       />
       <button
         onClick={handleSend}
         style={{
           backgroundColor: "#385773",
           color: "#ffffff",
           padding: "10px 16px",
           borderRadius: "8px",
           fontSize: "14px",
           border: "none",
           cursor: "pointer",
           transition: "background-color 0.2s ease",
         }}
         onMouseOver={(e) => {
           e.currentTarget.style.backgroundColor = "#2e475f";
         }}
         onMouseOut={(e) => {
           e.currentTarget.style.backgroundColor = "#385773";
         }}
       >
         Send
       </button>
     </div>
   </div>
 );
}
