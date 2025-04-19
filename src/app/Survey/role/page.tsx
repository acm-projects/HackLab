"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SurveyLayout from "../../components/SurveyLayout";
import { useSurvey } from "../../contexts/SurveyContext";

interface Role {
  id: number;
  role: string;
  imageUrl?: string;
}

const RoleSelection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { selectedRole, setSelectedRole } = useSurvey();

  const selectRole = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };
  
  

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/roles");
        const data = await res.json();

        const cleaned: Role[] = data
          .filter((item: any) => typeof item?.role === "string")
          .map((item: any) => ({
            id: item.id,
            role: item.role,
            imageUrl: `/images/${item.role.toLowerCase()}.png`,
          }));

        setAllRoles(cleaned);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    const fetchUserId = async () => {
      try {
        if (session?.user?.email) {
          const res = await fetch("http://52.15.58.198:3000/users");
          const users = await res.json();
          const user = users.find((u: any) => u.email === session.user?.email);
          if (user?.id) setUserId(user.id);
        }
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
      }
    };

    fetchRoles();
    fetchUserId();
  }, [session]);

  const handleNext = async () => {
    if (!selectedRole || !userId) {
      alert("Please select a role before continuing.");
      return;
    }

    const selected = allRoles.find((r) => r.role === selectedRole);
    if (!selected) {
      alert("Selected role not found.");
      return;
    }

    try {
      const res = await fetch(
        `http://52.15.58.198:3000/users/${userId}/role/${selected.id}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to save role.");
      const data = await res.json();
      console.log("✅ Role saved:", data);
      router.push("/Survey/userinfo");
    } catch (error) {
      console.error("❌ Error saving role:", error);
      alert("Something went wrong while saving your role.");
    }
  };

  return (
    <SurveyLayout step={4} totalSteps={5}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#fff",
          marginTop: "60px",
          marginBottom: "30px",
        }}
      >
        Please choose from the following roles
      </h1>

      <div
        className="flex justify-center flex-wrap gap-[12px]"
        style={{ maxHeight: "250px", overflowY: "auto", paddingBottom: "20px" }}
      >
        {allRoles.map((r) => (
          <div
            key={r.id}
            onClick={() => selectRole(r.role)} // ✅ fixed this line
            className="w-[150px] h-[200px] shadow-md cursor-pointer rounded-xl"
            style={{
              backgroundColor: selectedRole === r.role ? "#385773" : "#fff",
              border: selectedRole === r.role ? "2px solid #fff" : "none",
              color: selectedRole === r.role ? "#fff" : "#1f2937",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "500",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={r.imageUrl || "/images/placeholder.png"}
              alt={r.role}
              className="w-full h-[100%] object-cover rounded-t-xl z-[100]"
            />
            <div className="p-[5px] rounded-[10px] bg-transparent">{r.role}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "32px",
        }}
      >
        <button
          onClick={() => router.push("/Survey/interests")}
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
          onClick={handleNext}
          style={{
            backgroundColor: "#fff",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#385773",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#cecece")
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

export default RoleSelection;
