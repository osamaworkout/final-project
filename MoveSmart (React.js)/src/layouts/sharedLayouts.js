import { Outlet, NavLink } from "react-router-dom";
// import { useState } from "react";
import '../Assets/Styles/SharedLayout.css';
import bellicon from '../Assets/images/bell.svg';
import usersicon from '../Assets/images/users.svg';
import homeicon from '../Assets/images/home.svg';
import carsicon from '../Assets/images/cars.svg';
import searchicon from '../Assets/images/search.svg';
import carmachineicon from '../Assets/images/car-mechanic.svg';
import repairicon from '../Assets/images/repair-alt.svg';
import documenticon from '../Assets/images/document.svg';
import chartpieicon from '../Assets/images/chart-pie.svg';
const SharedLayout = () => {
  return (
    <div dir="rtl">
      <div className="topbar">
        <div className="profile">
          <span>Sayed</span>
          <img src={usersicon} alt="User" />
        </div>
        <button>
          <img className="notification" src= {bellicon} alt="إشعار" />
        </button>
        <div className="search-container">
          <input type="text" placeholder="بحـث..." />
          <img src={searchicon} alt="بحث" />
        </div>
      </div>
      <div className="sidebar">
        <h2 className="logo">Fleet Track</h2>
        <button className="create-order">إنشاء طلب</button>
        <ul className="menu">
          <li>
            <NavLink to="home" className={({ isActive }) => isActive ? "active" : ""}> 
              <img src={homeicon} alt="" /> الصفحة الرئيسية
            </NavLink>
          </li>
          <li>
            <NavLink to="carList" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={carsicon} alt="" /> السيارات
            </NavLink>
          </li>
          <li>
            <NavLink to="drivers" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={usersicon} alt="" /> السائقين
            </NavLink>
          </li>
          <li>
            <NavLink to="requests" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={documenticon} alt="" /> الطلبات
            </NavLink>
          </li>
          <li>
            <NavLink to="consumables" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={carmachineicon} alt="" /> المستهلكات
            </NavLink>
          </li>
          <li>
            <NavLink to="subscription" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={carmachineicon} alt="" /> الاشتراكات
            </NavLink>
          </li>
          <li>
            <NavLink to="spareParts" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={repairicon} alt="" /> قطع الغيار
            </NavLink>
          </li>
          <li>
            <NavLink to="reports" className={({ isActive }) => isActive ? "active" : ""}>
              <img src={chartpieicon} alt="" /> التقارير
            </NavLink>
          </li>
        </ul>
      </div>

      
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
export default SharedLayout;