"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SurveyLayout from "../../components/SurveyLayout";
import { useSurvey } from "../../contexts/SurveyContext";

const UserInfo = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [school, setSchool] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isValidLinkedin, setIsValidLinkedin] = useState(true);

  const validateLinkedIn = (url: string) => {
    if (!url.trim()) return true; // empty is okay (optional)
    const regex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-_%]+\/?$/;
    return regex.test(url.trim());
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLinkedin(url);
    setIsValidLinkedin(validateLinkedIn(url));
  };

  const isFormValid = location && status && school && isValidLinkedin;

  return (
    <SurveyLayout step={5} totalSteps={5}>
        <div 
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            Let’s finish your profile
          </h1>

          <div
            className="flex justify-center mr-[30px]"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                  display: "block",
                }}
              >
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
              <label
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                  display: "block",
                }}
              >
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
              <label
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                  display: "block",
                }}
              >
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

            {/* LinkedIn URL */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                  display: "block",
                }}
              >
                LinkedIn Profile URL <span style={{ color: "#9ca3af" }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/username"
                value={linkedin}
                onChange={handleLinkedInChange}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: `1px solid ${isValidLinkedin ? "#d1d5db" : "red"}`,
                  color: "#374151",
                  fontSize: "14px",
                }}
              />
              {!isValidLinkedin && (
                <p style={{ fontSize: "12px", color: "red", marginTop: "4px" }}>
                  Please enter a valid LinkedIn profile URL.
                </p>
              )}
              <p
                style={{
                  fontSize: "12px",
                  color: "#fff",
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                We ask for your LinkedIn profile so that when you complete a project, we can generate a personalized resume for you automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
          <button
            onClick={() => router.push("/Survey/role")}
            style={{
              backgroundColor: "#fff",
              padding: "10px 24px",
              borderRadius: "12px",
              color: "#385773",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back
          </button>
          <button
            onClick={() => {
              const userInfo = {
                location,
                position: status,
                school,
                linkedin: linkedin.trim(),
              };
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
              router.push("/homeScreen");
            }}
            disabled={!isFormValid}
            style={{
              backgroundColor: "#fff",
              padding: "10px 24px",
              borderRadius: "12px",
              color: "#385773",
              fontSize: "14px",
              border: "none",
              cursor: isFormValid ? "pointer" : "not-allowed",
              opacity: isFormValid ? 1 : 0.5,
            }}
            onMouseOver={(e) => {
              if (isFormValid)
                e.currentTarget.style.backgroundColor = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            Submit
          </button>
        </div>

    </SurveyLayout>
  );
};

export default UserInfo;
