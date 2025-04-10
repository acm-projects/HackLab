"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SurveyLayout from "../../components/SurveyLayout";
import { useSurvey } from "../../contexts/SurveyContext";

interface Topic {
  id: number;
  topic: string;
}

const InterestSelection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  // const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedTopics, setSelectedTopics } = useSurvey();

  // useEffect(() => {
  //   setSelected(selectedTopics);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/topics");
        const data = await res.json();
        const cleaned: Topic[] = data.filter(
          (item: any) => typeof item?.topic === "string"
        );
        setAllTopics(cleaned);

        if (session?.user?.email) {
          const userRes = await fetch("http://52.15.58.198:3000/users");
          const users = await userRes.json();
          const foundUser = users.find(
            (u: any) => u.email === session.user?.email
          );
          if (foundUser?.id) {
            setUserId(foundUser.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch topics or user:", error);
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTopics = allTopics.filter(
    (t) =>
      t.topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTopics.includes(t.topic)
  );

  const handleSelect = async (topic: string) => {
    const match = allTopics.find((t) => t.topic === topic);
    if (!match || !userId) return;

    if (!selectedTopics.includes(topic)) {
      setSearchTerm("");
      setDropdownOpen(false);
      setSelectedTopics([...selectedTopics, topic]); 

      try {
        const res = await fetch(
          `http://52.15.58.198:3000/users/${userId}/topics/${match.id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        if (
          res.status === 500 &&
          data.error?.includes("duplicate key")
        ) {
          console.log("⚠️ Already exists in backend.");
        } else {
          console.log("✅ Interest added to backend:", data);
        }
      } catch (error) {
        console.error("Error adding interest:", error);
      }
    }
  };

  const handleRemove = (topic: string) => {

    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  return (
    <SurveyLayout step={3} totalSteps={5}>
      <h1 className="mt-[100px]"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        What are your interests?
      </h1>

      <div ref={dropdownRef} className="flex flex-col justify-center items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setDropdownOpen(true);
          }}
          placeholder="Search interests..."
          onFocus={() => setDropdownOpen(true)}
          style={{
            width: "80%",
            padding: "12px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            color: "#1f2937",
            outline: "none",
            marginBottom: "0px",
          }}
        />

        {dropdownOpen && filteredTopics.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "8px",
              marginTop: "8px",
              maxHeight: "200px",
              overflowY: "auto",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
              width: "80%",
            }}
          >
            {filteredTopics.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelect(t.topic)}
                style={{
                  color: "#000",
                  padding: "6px 12px",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                {t.topic}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "16px",
          maxHeight: "90px",
          overflowY: "auto",
        }}
      >
        {selectedTopics.map((interest) => (
          <div
            key={interest}
            style={{
              backgroundColor: "#fff",
              color: "#385773",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {interest}
            <span
              onClick={() => handleRemove(interest)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "32px",
        }}
      >
        <button
          onClick={() => router.push("/Survey/languages")}
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
          onClick={() => router.push("/Survey/role")}
          style={{
            backgroundColor: "#fff",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#385773",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#fff")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#fff")
          }
        >
          Next
        </button>
      </div>
    </SurveyLayout>
  );
};

export default InterestSelection;
