import React from "react";

type ErrorProps = {
  message?: string;
  onRetry?: () => void;
};

const Error: React.FC<ErrorProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div style={containerStyle}>
      <p style={messageStyle}>{message}</p>
      {onRetry && (
        <button type="button" style={buttonStyle} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: "1rem",
  border: "1px solid #f44336",
  borderRadius: "8px",
  backgroundColor: "#ffebee",
  color: "#b71c1c",
  textAlign: "center",
};

const messageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1rem",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "0.75rem",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  cursor: "pointer",
};

export default Error;
