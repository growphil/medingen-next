import React from "react";
import "./style.css";
import { useLegacyRouting } from "@/lib/router-compat";
import { getUser } from "../../api/Api";

export const Splash1 = () => {
  const { navigate } = useLegacyRouting();
  const user = getUser();
  if (user.isLoggedIn) {
    navigate("/");
  }
  return (
    <>
     
    <div className="splash-screen">
      <div className="logo-container">
        <img src="/BlackMIG.svg" fetchPriority="high" alt="Logo" className="logo" />
      </div>
    </div>
    </>
  );
};

