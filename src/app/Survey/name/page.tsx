"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SurveyLayout from "../../components/SurveyLayout";
import { useSurvey } from "../../contexts/SurveyContext";

const NameForm = () => {
  const router = useRouter();
  // const [name, setName] = useState("");
  const { name, setName } = useSurvey();
  return (
    <SurveyLayout step={1} totalSteps={5}>
      <div className="flex-1 flex flex-col justify-center items-center gap-[10px]">
        <h1
          className="text-center font-[400]"
          style={{ fontSize: "20px", color: "#fff" }}
        >
          What is your name?
        </h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Josh Chen"
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            color: "#1f2937",
            outline: "none",
          }}
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push("/Survey/languages")}
          disabled={!name.trim()}
          style={{
            backgroundColor: name.trim() ? "#fff" : "#fff",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#385773",
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontSize: "14px",
            border: "none",
            opacity: name.trim() ? 1 : 0.5,
            transition: "background-color 0.3s",
          }}
        >
          Next
        </button>
      </div>
    </SurveyLayout>
  );
};

export default NameForm;
