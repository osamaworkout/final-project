import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Assets/Styles/carList.css";
import api from "../services/api";

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [showPopup, setShowPopup] = useState(false);
  const [newCarData, setNewCarData] = useState({
    id: "",
    brand: "",
    model: "",
    type: "",
    hospital: "",
    status: "متاحة",
  });

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, searchTerm, filter]);

  const loadCars = async () => {
    try {
      const response = await api.get("Buses/All");
      const data = response.data;
      if (!Array.isArray(data)) {
        console.error("البيانات المستلمة ليست في شكل مصفوفة", data);
        return;
      }
      setCars(data);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
  };

  const applyFilters = () => {
    let list = [...cars];
    if (searchTerm) {
      list = list.filter(
        (car) =>
          car.id.includes(searchTerm) ||
          car.brand.toLowerCase().includes(searchTerm) ||
          car.model.toLowerCase().includes(searchTerm) ||
          car.type.toLowerCase().includes(searchTerm) ||
          car.hospital.toLowerCase().includes(searchTerm) ||
          car.status.toLowerCase().includes(searchTerm)
      );
    }
    if (filter !== "all") {
      list = list.filter((car) => car.status === filter);
    }
    setFilteredCars(list);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCarData({ ...newCarData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/Buses", newCarData);
      setShowPopup(false);
      loadCars();
      setNewCarData({
        id: "",
        brand: "",
        model: "",
        type: "",
        hospital: "",
        status: "متاحة",
      });
    } catch (error) {
      console.error("فشل في إضافة السيارة:", error);
    }
  };

  return (
    <div className="container">
      <h2>السيارات</h2>
      <p className="total-cars">
        إجمالي السيارات: <span id="total-count">{filteredCars.length}</span>
      </p>

      <div id="cars-container" className="cards-container">
        {filteredCars.map((car, index) => (
          <div key={index} className="card">
            <p>
              <strong>رقم السيارة:</strong>{" "}
              <Link to={`/car-management/${car.id}`}>{car.id}</Link> {/* ⬅️ التعديل */}
            </p>
            <p>
              <strong>الماركة:</strong> {car.brand}
            </p>
            <p>
              <strong>الموديل:</strong> {car.model}
            </p>
            <p>
              <strong>النوع:</strong> {car.type}
            </p>
            <p>
              <strong>المستشفى:</strong> {car.hospital}
            </p>
            <p className={`status ${car.status === "متاحة" ? "active" : "inactive"}`}>
              <strong>الحالة:</strong> {car.status}
            </p>
          </div>
        ))}
      </div>

      <div className="actions">
        <input
          type="text"
          id="search"
          placeholder="بحث..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">الجميع</option>
          <option value="متاحة">متاحة</option>
          <option value="غير متاحة">غير متاحة</option>
        </select>
        <button onClick={() => setShowPopup(true)}>+ إضافة سيارة</button>
        <button onClick={loadCars}>🔄 تحديث</button>
      </div>

      <div className="table-header">
        <span>رقم السيارة</span>
        <span>الماركة</span>
        <span>الموديل</span>
        <span>النوع</span>
        <span>المستشفى</span>
        <span>الحالة</span>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>إضافة سيارة جديدة</h3>
            <input name="id" placeholder="رقم السيارة" onChange={handleInputChange} value={newCarData.id} />
            <input name="brand" placeholder="الماركة" onChange={handleInputChange} value={newCarData.brand} />
            <input name="model" placeholder="الموديل" onChange={handleInputChange} value={newCarData.model} />
            <input name="type" placeholder="النوع" onChange={handleInputChange} value={newCarData.type} />
            <input name="hospital" placeholder="المستشفى" onChange={handleInputChange} value={newCarData.hospital} />
            <select name="status" onChange={handleInputChange} value={newCarData.status}>
              <option value="متاحة">متاحة</option>
              <option value="غير متاحة">غير متاحة</option>
            </select>
            <div className="popup-actions">
              <button onClick={handleSubmit}>حفظ</button>
              <button onClick={() => setShowPopup(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarsPage;
