import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assets/Styles/driver.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/drivers");
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleStatus(event, driverId) {
    event.stopPropagation();
    try {
      await axios.put(`/api/drivers/${driverId}/toggle`);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  }

  async function addDriver() {
    const newDriver = {
      name: `السائق ${Math.floor(Math.random() * 100)}`,
      carNumber: `01204515${Math.floor(Math.random() * 100)}`,
      phone: `010${Math.floor(Math.random() * 10000000)}`,
      status: "متاح",
    };

    try {
      await axios.post("/api/drivers", newDriver);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  }

  const filteredDrivers = drivers.filter((driver) =>
    filter === "all" ? true : driver.status === filter
  );

  const handleDriverClick = (driver) => {
    localStorage.setItem("selectedDriver", JSON.stringify(driver));
    window.location.href = `/driver_manege.html?id=${driver.id}`;
  };

  return (
    <div className="container">
        <h2 className="h1">إدارة السائقين</h2>
        <p className="h2">
          إجمالي السائقين: {filteredDrivers.length}
        </p>

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
