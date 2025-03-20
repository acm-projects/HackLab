"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";

export default function AIProject() {
  const router = useRouter();

  // State to manage the description
  const [description, setDescription] = useState<string>("");

  // State to manage loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Ensure description is not empty
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    // Simulate an API call
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second delay
    console.log("Project Description:", description); // Replace this with your logic to handle the submission

    // Redirect to a success page after submission
    router.push("../successPagePlaceHolder");

    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white font-nunito overflow-hidden relative">
      <NavBar />
      
      {/* Siri-Like Animated Circle */}
      <div className="siri-container mt-[-150px]">
        <div className="siri-circle">
          <div className="siri-wave siri-wave-1"></div>
          <div className="siri-wave siri-wave-2"></div>
          <div className="siri-wave siri-wave-3"></div>
        </div>
      </div>

      {/* Description Section (Now Below the Animation) */}
      <div className="w-[750px] mt-12 relative z-10 mt-[150px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start justify-start space-y-6 pb-8"
        >
          {/* DESCRIPTION */}
          <div className="flex flex-col w-full">
            <p className="text-white mb-2 text-center">DESCRIPTION</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-[#F3F4F6] focus:ring-4 focus:outline-none focus:ring-[#3B82F6] font-nunito rounded-[10px] text-md px-[10px] py-[10px] text-center flex items-center justify-start w-full">
              <textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Enter a detailed description of your project..."
                className="bg-transparent border-none focus:outline-none w-full text-[#385773] resize-none rounded-[10px]"
                rows={8} // Increased height of the textarea
              />
            </div>
          </div>

          {/* Submit Button (Aligned to the Right) */}
          <div className="w-full flex justify-end"> {/* Container to align button to the right */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-[20px] py-[10px] px-[50px] text-white rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-end gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}