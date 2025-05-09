import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/Styles/driver.css";
import api from "../services/api";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setIsLoading(true);
    try {
      const { data } = await api.get("/Drivers/All");
      const rawDrivers = data?.$values || [];
      const normalizedDrivers = rawDrivers.map((d) => ({
        id: d.driverID,
        name: d.name,
        phone: d.phone,
        carNumber: d.vehicleID ? d.vehicleID.toString() : "غير محدد",
        status: d.status === 0 ? "متاح" : "غير متاح",
      }));
      setDrivers(normalizedDrivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleStatus(event, driverId) {
    event.stopPropagation();
    try {
      await api.put(`/Drivers/ByID/${driverId}`);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  }

  async function addDriver() {
    const newDriver = {
      name: `السائق ${Math.floor(Math.random() * 100)}`,
      phone: `010${Math.floor(Math.random() * 10000000)}`,
      nationalNo: `${Math.floor(Math.random() * 10000000000000)}`,
      status: 0,
      vehicleID: 1, // أو أي رقم افتراضي حسب النظام عندك
    };

    try {
      await api.post("/Drivers", newDriver);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  }

  const filteredDrivers = drivers.filter((driver) =>
    filter === "all" ? true : driver.status === filter
  );

  const handleDriverClick = (driver) => {
    navigate(`/driverDetails/${driver.id}`);
  };

  return (
    <div className="container">
      <h2 className="h1">إدارة السائقين</h2>
      <p className="h2">إجمالي السائقين: {filteredDrivers.length}</p>

      <div className="controls">
        <button onClick={addDriver}>➕ إضافة سائق</button>
        <button onClick={fetchDrivers}>🔄 تحديث</button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">جميع السائقين</option>
          <option value="متاح">متاح</option>
          <option value="غير متاح">غير متاح</option>
        </select>
      </div>

      <div className="table-header">
        <span>اسم السائق</span>
        <span>الحالة</span>
        <span>رقم الهاتف</span>
        <span>رقم السيارة</span>
      </div>

      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <div className="drivers-list">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="driver-card"
              onClick={() => handleDriverClick(driver)}
            >
              <div className="driver-info">
                <span className="name">👤 {driver.name}</span>
                <span className="car-number">🚗 {driver.carNumber}</span>
                <span className="phone-number">📞 {driver.phone}</span>
              </div>
              <button
                className={`status ${
                  driver.status === "متاح" ? "available" : "not-available"
                }`}
                onClick={(e) => toggleStatus(e, driver.id)}
              >
                {driver.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverManagement;