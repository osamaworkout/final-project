import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import axios from "axios";
import "../Assets/Styles/SharedLayout.css";
import bellicon from "../Assets/images/bell.svg";
import usersicon from "../Assets/images/users.svg";
import homeicon from "../Assets/images/home.svg";
import carsicon from "../Assets/images/cars.svg";
import searchicon from "../Assets/images/search.svg";
import carmachineicon from "../Assets/images/car-mechanic.svg";
import repairicon from "../Assets/images/repair-alt.svg";
import documenticon from "../Assets/images/document.svg";

const SharedLayout = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications"); 
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };


  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications(); 
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <div dir="rtl">
      <div className="topbar">
        <div className="profile">
          <span>Sayed</span>
          <img src={usersicon} alt="User" />
        </div>
        <div className="rx-1">
          <div className="search-container">
            <input type="text" placeholder="بحـث..." />
            <img src={searchicon} alt="بحث" />
          </div>
          <button className="noti-btn" onClick={toggleNotifications}>
            <img className="notification" src={bellicon} alt="إشعار" width='20px' height= '20px' />
          </button>
          {/* قائمة الإشعارات */}
          {showNotifications && (
            <div className="notification-popup">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p>{notification.message}</p>
                  </div>
                ))
              ) : (
                <p>لا توجد إشعارات</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar">
        <h2 className="logo">Move Smart</h2>
        <button className="create-order">إنشاء طلب</button>
        <ul className="menu">
          <li>
            <NavLink
              to="role0"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={homeicon} alt="" /> الصفحة الرئيسية
            </NavLink>
          </li>
          <li>
            <NavLink
              to="carList"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={carsicon} alt="" /> السيارات
            </NavLink>
          </li>
          <li>
            <NavLink
              to="drivers"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={usersicon} alt="" /> السائقين
            </NavLink>
          </li>
          <li>
            <NavLink
              to="requests"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={documenticon} alt="" /> الطلبات
            </NavLink>
          </li>
          <li>
            <NavLink
              to="consumables"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={carmachineicon} alt="" /> المستهلكات
            </NavLink>
          </li>
          <li>
            <NavLink
              to="subscription"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={carmachineicon} alt="" /> الاشتراكات
            </NavLink>
          </li>
          <li>
            <NavLink
              to="patrolsList"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={carmachineicon} alt="" /> الدوريات
            </NavLink>
          </li>
          <li>
            <NavLink
              to="spareParts"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img src={repairicon} alt="" /> قطع الغيار
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default SharedLayout;
