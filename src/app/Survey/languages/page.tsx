"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SurveyLayout from "../../components/SurveyLayout";

interface Skill {
  id: number;
  skill: string;
}

const LanguageSelection = () => {
  const { data: session } = useSession();
  const [allLanguages, setAllLanguages] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/skills");
        const data = await res.json();
        const cleaned: Skill[] = data.filter(
          (item: any) => typeof item?.skill === "string"
        );
        setAllLanguages(cleaned);

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
        console.error("Failed to fetch skills or user:", error);
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

  const filteredLanguages = allLanguages.filter(
    (lang) =>
      lang.skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selected.some((s) => s.id === lang.id)
  );

  const handleLangSelect = async (lang: string) => {
    if (!userId) return;

    const skill = allLanguages.find((s) => s.skill === lang);
    if (!skill || selected.some((s) => s.id === skill.id)) return;

    setSelected((prev) => [...prev, skill]);
    setSearchTerm("");
    setDropdownOpen(false);

    try {
      const res = await fetch(
        'http://52.15.58.198:3000/users/${userId}/skills/${skill.id}',
        {
          method: "POST",
        }
      );
      const data = await res.json();
      console.log("✅ Skill added to backend:", data);
    } catch (error) {
      console.error("Error adding skill to backend:", error);
    }
  };

  const handleRemoveLang = (id: number) => {
    setSelected((prev) => prev.filter((lang) => lang.id !== id));
  };

  return (
  <SurveyLayout step={2} totalSteps={5}>
    
        <h1 className="mt-[100px]"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          What programming languages do you use?
        </h1>

        <div ref={dropdownRef} className="flex flex-col justify-center items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder="Search for languages..."
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

          {dropdownOpen && filteredLanguages.length > 0 && (
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
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => handleLangSelect(lang.skill)}
                  style={{
                    color: "#000",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                >
                  {lang.skill}
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
          {selected.map((lang) => (
            <div
              key={lang.id}
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
              {lang.skill}
              <span
                onClick={() => handleRemoveLang(lang.id)}
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
            onClick={() => router.push("/Survey/name")}
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
            onClick={async () => {
              console.log("🧠 Selected (local):", selected);
              try {
                const res = await fetch(
                  'http://52.15.58.198:3000/users/${userId}/skills'
                );
                const data = await res.json();
                console.log("📦 Skills from backend:", data);
              } catch (error) {
                console.error("❌ Could not fetch backend skills:", error);
              }
              router.push("/Survey/interests");
            }}
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

export default LanguageSelection;