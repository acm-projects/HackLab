"use client";




import React, { useState } from "react";
import { useRouter } from "next/navigation";




const UserInfo = () => {
const router = useRouter();
const [location, setLocation] = useState("");
const [status, setStatus] = useState("");
const [school, setSchool] = useState("");
const [resume, setResume] = useState<File | null>(null);




const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.length) {
    setResume(e.target.files[0]);
  }
};




return (
 <div
 className="translate-x-[-8px] translate-y-[-8px] h-full w-screen flex justify-center items-center"
   style={{
     backgroundColor: "#385773",
     height: "100vh",
   }}
 >
   <div
     className="shadow-[10px] flex flex-col justify-center"
     style={{
       backgroundColor: "#ffffff",
       borderRadius: "24px",
       padding: "80px",
       width: "550px",
       height: "600px",
     }}
   >
      {/* Header */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#000000",
            marginBottom: "12px",
          }}
        >
          Let’s finish your profile
        </h1>




        {/* Inputs */}
        <div
        className="flex justify-center translate-x-[-10px]"
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "14px", color: "#4b5563", marginBottom: "4px", display: "block" }}>
              Location
            </label>
            <input
              type="text"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                color: "#374151",
                fontSize: "14px",
              }}
            />
          </div>




          <div>
            <label style={{ fontSize: "14px", color: "#4b5563", marginBottom: "4px", display: "block" }}>
              Status
            </label>
            <input
              type="text"
              placeholder="e.g., Senior, Software Engineer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                color: "#374151",
                fontSize: "14px",
              }}
            />
          </div>




          <div>
            <label style={{ fontSize: "14px", color: "#4b5563", marginBottom: "4px", display: "block" }}>
              Company/School
            </label>
            <input
              type="text"
              placeholder="Enter your school or company"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                color: "#374151",
                fontSize: "14px",
              }}
            />
          </div>




          {/* Resume Upload */}
          <div>
            <label style={{ fontSize: "14px", color: "#4b5563", marginBottom: "4px", display: "block" }}>
              Upload Resume
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="file"
                onChange={handleUpload}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                }}
              />
              <div
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  color: "#6b7280",
                  fontSize: "14px",
                  zIndex: 1,
                }}
              >
                {resume ? resume.name : "No file chosen"}
              </div>
            </div>
            {resume && (
              <p style={{ fontSize: "13px", color: "#1e40af", fontStyle: "italic", marginTop: "6px" }}>
                📄 {resume.name}
              </p>
            )}
          </div>
        </div>
      </div>




      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
        <button
          onClick={() => router.push("/Survey/role")}
          style={{
            backgroundColor: "#385773",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={() => router.push("/homeScreen")}
          disabled={!location || !status || !school}
          style={{
            backgroundColor: "#385773",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "14px",
            border: "none",
            cursor: !location || !status || !school ? "not-allowed" : "pointer",
            opacity: !location || !status || !school ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (location && status && school)
              e.currentTarget.style.backgroundColor = "#2e475f";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#385773";
          }}
        >
          End
        </button>
      </div>
    </div>
  </div>
);
};




export default UserInfo;



