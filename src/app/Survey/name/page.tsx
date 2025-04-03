

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";




const NameForm = () => {
const router = useRouter();
const [name, setName] = useState("");




return (
  <div
    className="flex justify-center items-center h-screen w-screen translate-x-[-8px] translate-y-[-8px]"
    style={{ backgroundColor: "#385773" }}
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
      <div className="flex-1 flex flex-col justify-center items-center gap-[10px]">
        <h1
          className="text-center font-bold"
          style={{ fontSize: "20px", color: "#000000" }}
        >
          What is your name?
        </h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type in your name"
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




      <div className="flex justify-between mt-8">
        <button
          disabled
          style={{
            backgroundColor: "#385773",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#ffffff",
            opacity: 0.5,
            cursor: "not-allowed",
            fontSize: "14px",
            border: "none",
          }}
        >
          Back
        </button>




        <button
          onClick={() => router.push("/Survey/languages")}
          disabled={!name.trim()}
          style={{
            backgroundColor: name.trim() ? "#385773" : "#385773",
            padding: "10px 24px",
            borderRadius: "12px",
            color: "#ffffff",
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
    </div>
  </div>
);
};




export default NameForm;





