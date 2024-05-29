import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { PacmanLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

function Logout_logic() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Make a request to the backend logout route
        await axios.get(`http://localhost:5000/logout`);

        // Clear the token from local storage
        localStorage.removeItem("token");
        // console.log("logout_successful");
        // navigating after a brief delay (3 seconds in this case)

        navigate("/login");
        // console.log("logout_successful");
        // Adjust the duration as needed
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout Failed!", {
          duration: 3000,
          position: "bottom-right",
        });

        // console.log("logout failed!");
      }
    };

    handleLogout(); // Call the logout function

    // Unmount the component after the logout process
    return () => {
      console.log("Component unmounted");
    };
  }, [navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
          background: black;
          font-family: 'Roboto', sans-serif;
          margin: 0;
        }

        .logout-message-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90vh;
          background: black;
          color: #90ee90;
          text-align: center;
        }

        .loader {
          display: inline-block;
          margin-bottom: 10px;
        }

        .logout_text {
          font-size: 28px;
        }
      `}</style>

      <div className="logout-message-container">
        <PacmanLoader className="loader" color="#90ee90" size={60} />
        <h4 className="logout_text">You are being logged out...</h4>
      </div>
    </>
  );
}

export default Logout_logic;
