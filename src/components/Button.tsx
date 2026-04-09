import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: string;
}

const Button = ({ children, onClick, type }: ButtonProps) => {
  //share,add
  const shareButtonStyle = "bg-[#050505] text-[#7B77CE]";
  const addButtonStyle = "bg-[#3b32b9] text-[#E6E2FB]";
  const commonstyle = "p-4 rounded-lg ]  ";
  const navigate = useNavigate();
  if (type === "signin") {
    return (
      <button
        className={`bg-[#3b32b9] text-[#E6E2FB] ${commonstyle}`}
        onClick={() => navigate("/signin")}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`
        ${commonstyle} ${
          type === "share"
            ? shareButtonStyle
            : type === "add"
              ? addButtonStyle
              : type === "signin"
                ? "bg-[#3b32b9] text-[#E6E2FB]"
                : "bg-gray-300 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
};

export default Button;
