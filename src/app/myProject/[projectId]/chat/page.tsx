"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useParams } from "next/navigation";

interface Message {
  username: string;
  text: string;
  time: string;
  isCurrentUser?: boolean;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useParams();
  const projectName = decodeURIComponent(params.projectId as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<typeof Socket | null>(null);
  const [UID, setUID] = useState<number | null>(null);
  const [PID, setPID] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user?.name || !projectName) return;

    const socket = io("http://52.15.58.198:3000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Fetch UID
    socket.emit("getUID", session.user.name);
    socket.on("returnUID", (userID: number) => {
      console.log("Received UID:", userID);
      setUID(userID);
    });

    // Fetch PID
    socket.emit("getPID", projectName);
    socket.on("returnPID", (projectId: number) => {
      if (!projectId) return;
      console.log("Received PID:", projectId);
      setPID(projectId);
    });

    return () => {
      socket.disconnect();
    };
  }, [session, projectName]);

  // Join room once UID & PID are set
  useEffect(() => {
    if (!socketRef.current || !UID || !PID) return;
    console.log("Joining room with UID:", UID, "and PID:", PID);
    socketRef.current.emit("joinRoom", {
      user_id: UID,
      username: session?.user?.name,
      project_id: PID,
    });

    // Load messages
    socketRef.current.on("loadMessages", (loadedMessages: any[]) => {
      console.log("Loading messages:", loadedMessages);
      const formattedMessages = loadedMessages.map((msg) => ({
        username: msg.sender_id.toString(), // Fetch real username later
        text: msg.message,
        time: ((msg.time).replace(':', ' ')).replace(':', ' '),
        isCurrentUser: msg.sender_id === UID,
      }));
      setMessages(formattedMessages);

      // Fetch usernames for all sender IDs
      formattedMessages.forEach((msg) => {
        fetchUsername(msg.username);
      });
    });

    // Listen for new messages
    socketRef.current.on("message", (msg: any) => {
      console.log("New message received:", msg);
    
      // Ensure the message has the required fields
      if (!msg.username || !msg.text || !msg.time) {
        console.error("Error: Incomplete message received!", msg);
        return;
      }
    
      setMessages((prev) => [
        ...prev,
        {
          username: msg.username, // Use directly provided username
          text: msg.text || "⚠️ (Message content missing)",
          time: ((msg.time).replace(':', ' ')).replace(':', ' ') || "Unknown time",
          isCurrentUser: msg.username === session?.user?.name, // Check if it's the current user's message
        },
      ]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("loadMessages");
        socketRef.current.off("message");
      }
    };
  }, [UID, PID]);

  // Fetch username by UID
  const fetchUsername = async (senderId: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve(senderId); // Default to ID if socket fails
      console.log("Requesting username for sender_id:", senderId);
      socketRef.current.emit("getUsername", senderId, `returnUsername_${senderId}`);
      socketRef.current.once(`returnUsername_${senderId}`, (username: string) => {
        console.log("Received username:", username, "for sender_id:", senderId);
        resolve(username || senderId);
      });
    });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current || !session?.user?.name || !UID || !PID) return;
    console.log("Sending message:", newMessage, "from UID:", UID, "to PID:", PID);
    socketRef.current.emit("chatMessage", UID, newMessage, PID, false);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">💬 {projectName} Chat</div>

      {/* Messages Area */}
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.isCurrentUser ? "user-message" : "other-message"}`}>
            <p className="message-text">{msg.text}</p>
            <div className="message-meta">
              <span className="message-sender">{msg.isCurrentUser ? "You" : msg.username}</span>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <style jsx>{`
        .chat-container {
          height: 100vh; /* Full viewport height */
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }
        .chat-header {
          background-color: #385773;
          color: #ffffff;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
        }
        .messages-container {
          flex: 1; /* Allows messages to take available space */
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto; /* Enables scrolling */
          max-height: calc(100vh - 140px); /* Adjust height dynamically */
        }
        .message-bubble {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 18px;
          word-break: break-word;
        }
        .user-message {
          background-color: #DCF8C6;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .other-message {
          background-color: #E5E7EB;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .message-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6B7280;
          margin-top: 4px;
        }
        .input-container {
          position: sticky;
          bottom: 0;
          width: 100%;
          padding: 12px;
          background: white;
          display: flex;
          gap: 8px;
          border-top: 1px solid #E5E7EB;
          height: 50px;
        }
        input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
        }
        button {
          background-color: #385773;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}