import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";

import Signup from "./pages/Signup";
import Signin from "./Signin";
import React, { useEffect, useState } from "react";
// import PublicContent from "./pages/PublicContent";
import PublicHome from "./pages/Home copy";

// function PublicRoute({ children }: { children: React.ReactNode }) {}
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/v1/content", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (data.contents) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    }

    checkAuth();
  }, []);

  // ⏳ Loading state
  if (isValid === null) return <p>Loading...</p>;

  // ❌ Not authorized
  if (!isValid) return <Navigate to="/signin" />;

  // ✅ Authorized
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/:userid" element={<PublicHome />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
