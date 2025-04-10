import React from "react";
import { Outlet } from "react-router-dom";
import "../Assets/Styles/SharedLayout.css";

const SharedLayout = () => {
  return (
    <div className="shared-layout">

      <div className="main-content">

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
