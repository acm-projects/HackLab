// components/SurveyLayout.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}

const SurveyLayout: React.FC<Props> = ({ children, step, totalSteps }) => {
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-transparent">
      <div
        className="shadow-[10px] flex flex-col justify-between relative"
        style={{
          backgroundColor: "#385773",
          borderRadius: "24px",
          padding: "60px",
          width: "480px",
          height: "540px",
        }}
      >
        {/* Top Right: Step Text and Small Progress Bar */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "100px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#fff",
              opacity: 0.85,
              marginBottom: "4px",
            }}
          >
            Step {step} / {totalSteps}
          </div>
          <div
            style={{
              backgroundColor: "#ffffff55",
              height: "4px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#fff",
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.3s ease-in-out",
              }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default SurveyLayout;
