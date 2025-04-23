import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assets/Styles/carList.css"

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
  
    useEffect(() => {
      loadCars();
    }, []);
  
    useEffect(() => {
      applyFilters();
    }, [cars, searchTerm, filter]);
  
    const loadCars = async () => {
      try {
        const response = await axios.get("/api/cars");
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
  
    const handleAddCar = async () => {
      const newCar = {
        id: "123",
        brand: "تويوتا",
        model: "كورولا",
        type: "سيدان",
        hospital: "الجامعة",
        status: "متاحة",
      };
      try {
        const response = await axios.post("/api/cars", newCar);
        if (response.status !== 201 && response.status !== 200)
          throw new Error("خطأ في إضافة السيارة");
        loadCars();
      } catch (error) {
        console.error("خطأ أثناء الإضافة:", error);
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
              <strong>رقم السيارة:</strong> <a href="#">{car.id}</a>
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
        <button onClick={handleAddCar}>+ إضافة سيارة</button>
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
    </div>
  );
};

export default CarsPage;
