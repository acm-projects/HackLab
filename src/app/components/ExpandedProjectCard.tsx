import React from "react";

interface ExpandedProjectModalProps {
  title: string;
  groupLeader: string;
  image: string;
  tech: string[];
  members: string[];
  totalMembers: number;
  description: string;
  onClose: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  joinRequested: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onJoin: () => void;
  likes: number;
  showJoinButton?: boolean; 
}

const ExpandedProjectModal: React.FC<ExpandedProjectModalProps> = ({
  title,
  groupLeader,
  image,
  tech,
  members,
  totalMembers,
  description,
  onClose,
  isLiked,
  isBookmarked,
  joinRequested,
  onLike,
  onBookmark,
  onJoin,
  likes,
  showJoinButton
}) => {
  return (
    <div
      className="fixed inset-0 z-[40] flex items-center justify-center mt-[-40px] ml-[8%]"
    >
      {/* Modal Container */}
      <div
        className="relative z-10 rounded-[15px] shadow-[0_0_20px_rgba(0,0,0,1)]"
        style={{
          backgroundColor: "#ffffff",
          width: "70vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute font-bold z-[20] border-none bg-transparent"
          style={{
            top: "16px",
            right: "16px",
            fontSize: "24px",
            color: "#ffffff",
            mixBlendMode: "difference", 
          }}
        >
          ✖
        </button>

        {/* Scrollable Content */}
        <div style={{ overflowY: "auto", padding: "20px" }}>
          <img
            src={image}
            alt={title}
            className="object-cover rounded-[10px]"
            style={{ width: "100%", height: "250px" }}
          />

          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginTop: "15px" }}>{title}</h2>
          <p style={{ fontSize: "16px", color: "#4B5563", marginBottom: "12px" }}>Led by: {groupLeader}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {tech.map((t, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 16px",
                  backgroundColor: "#385773",
                  color: "#ffffff",
                  fontSize: "14px",
                  borderRadius: "9999px",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", marginRight: "8px" }}>
              {members.slice(0, 5).map((m, idx) => (
                <img
                  key={idx}
                  src={m}
                  alt={`member-${idx}`}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9999px",
                    border: "2px solid #ffffff",
                    marginLeft: idx === 0 ? "0px" : "-12px",
                    zIndex: 10 - idx,
                    position: "relative",
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "14px", color: "#374151" }}>{totalMembers} members</span>
          </div>

          <p style={{ fontSize: "15px", marginBottom: "24px", lineHeight: "1.6" }}>{description}</p>

          {/* MVPs Table */}
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>MVPs</h3>
          <table style={{ width: "100%", marginBottom: "24px", fontSize: "14px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Feature</th>
                <th style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Login</td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Complete</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Chat</td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>In Progress</td>
              </tr>
            </tbody>
          </table>

          {/* Stretch Goals Table */}
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>Stretch Goals</h3>
          <table style={{ width: "100%", marginBottom: "24px", fontSize: "14px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Goal</th>
                <th style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Dark Mode</td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Medium</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>Mobile App</td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px 12px" }}>High</td>
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          {/* Book mark button */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "24px" }}>
            <button onClick={onBookmark} className="flex items-center outline-none border-none bg-transparent ml-[-5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isBookmarked ? "#EFD033" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>

            </button>
            {/* Like button */}
            <button onClick={onLike} className="flex items-center outline-none border-none bg-transparent ml-[-15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "#FF0000" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span className="text-[12px] ml-[2px] text-[#000]">{likes}</span>

            </button>

            {showJoinButton && (
            <button
              className="border-none"
              onClick={onJoin}
              style={{
                padding: "8px 24px",
                fontSize: "14px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                fontWeight: 500,
                backgroundColor: joinRequested ? "#FACC15" : "#385773",
                color: joinRequested ? "#000000" : "#FFFFFF",
              }}
            >
              {joinRequested ? "Sent Request" : "Join"}
            </button>
          )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedProjectModal;
