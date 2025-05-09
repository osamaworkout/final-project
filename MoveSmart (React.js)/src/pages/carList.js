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
    busID: "",
    brandName: "",
    modelName: "",
    availableSpace: "",
    capacity: "",
    plateNumbers: "",
    associatedTask: "",
    totalKilometersMoved: "",
    fuelType: "",
    fuelConsumptionRate: "",
    oilConsumptionRate: "",
    vehicleType: "",
    associatedHospital: "",
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
      const rawList = response.data?.$values || [];

      const formattedCars = rawList.map((item) => {
        const vehicle = item.vehicle || {};
        return {
          busID: item.busID || "",
          brandName: vehicle.brandName || "",
          modelName: vehicle.modelName || "",
          vehicleType: vehicle.vehicleType?.toString() || "",
          associatedHospital: vehicle.associatedHospital || "",
          status: vehicle.status === 0 ? "متاحة" : "غير متاحة",
        };
      });

      setCars(formattedCars);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
  };

  const applyFilters = () => {
    let list = [...cars];
    if (searchTerm) {
      list = list.filter(
        (car) =>
          car.busID.includes(searchTerm) ||
          car.brandName.toLowerCase().includes(searchTerm) ||
          car.modelName.toLowerCase().includes(searchTerm) ||
          car.vehicleType.toLowerCase().includes(searchTerm) ||
          car.associatedHospital.toLowerCase().includes(searchTerm) ||
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
      const payload = {
        busID: Number(newCarData.busID),
        capacity: Number(newCarData.capacity) || 0,
        availableSpace: Number(newCarData.availableSpace) || 0,
        vehicleID: Number(newCarData.vehicleID) || 0, // جديد
        vehicle: {
          vehicleID: Number(newCarData.vehicleID) || 0,
          brandName: newCarData.brandName || "",
          modelName: newCarData.modelName || "",
          plateNumbers: newCarData.plateNumbers || "",
          vehicleType: Number(newCarData.vehicleType) || 0,
          associatedHospital: newCarData.associatedHospital || "",
          associatedTask: newCarData.associatedTask || "",
          status: newCarData.status === "متاحة" ? 0 : 1,
          totalKilometersMoved: Number(newCarData.totalKilometersMoved) || 0,
          fuelType: Number(newCarData.fuelType) || 0,
          fuelConsumptionRate: Number(newCarData.fuelConsumptionRate) || 0,
          oilConsumptionRate: Number(newCarData.oilConsumptionRate) || 0,
        },
      };

      console.log("📦 البيانات النهائية:", payload);

      await api.post("/Buses", payload);
      setShowPopup(false);
      loadCars();
      setNewCarData({
        busID: "",
        brandName: "",
        modelName: "",
        capacity: "",
        availableSpace: "",
        vehicleID: "",
        plateNumbers: "",
        vehicleType: "",
        fuelType: "",
        fuelConsumptionRate: "",
        oilConsumptionRate: "",
        associatedHospital: "",
        associatedTask: "",
        totalKilometersMoved: "",
        status: "متاحة",
      });
    } catch (error) {
      console.error("فشل في إضافة السيارة:", error);
      alert("حدث خطأ أثناء إضافة السيارة. تأكد من إدخال كل البيانات المطلوبة.");
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
              <Link to={`/car-management/${car.busID}`}>{car.busID}</Link>
            </p>
            <p>
              <strong>الماركة:</strong> {car.brandName}
            </p>
            <p>
              <strong>الموديل:</strong> {car.modelName}
            </p>
            <p>
              <strong>النوع:</strong> {car.vehicleType}
            </p>
            <p>
              <strong>المستشفى:</strong> {car.associatedHospital}
            </p>
            <p
              className={`status ${
                car.status === "متاحة" ? "active" : "inactive"
              }`}
            >
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
            <input
              name="vehicleID"
              placeholder="رقم المركبة"
              onChange={handleInputChange}
              value={newCarData.vehicleID}
            />
            <input
              name="busID"
              type="number"
              placeholder="رقم السيارة"
              onChange={handleInputChange}
              value={newCarData.busID}
            />
            <input
              name="brandName"
              placeholder="الماركة"
              onChange={handleInputChange}
              value={newCarData.brandName}
            />
            <input
              name="modelName"
              placeholder="الموديل"
              onChange={handleInputChange}
              value={newCarData.modelName}
            />
            <input
              name="capacity"
              type="number"
              placeholder="سعة الركاب"
              onChange={handleInputChange}
              value={newCarData.capacity}
            />
            <input
              name="plateNumbers"
              placeholder="رقم اللوحة"
              onChange={handleInputChange}
              value={newCarData.plateNumbers}
            />
            <input
              name="associatedTask"
              placeholder="الوظيفة"
              onChange={handleInputChange}
              value={newCarData.associatedTask}
            />
            <input
              name="totalKilometersMoved"
              placeholder="الكيلومترات المقطوعة"
              onChange={handleInputChange}
              value={newCarData.totalKilometersMoved}
            />
            <input
              name="fuelType"
              placeholder="نوع الوقود"
              onChange={handleInputChange}
              value={newCarData.fuelType}
            />
            <input
              name="fuelConsumptionRate"
              placeholder="معدل استهلاك الوقود"
              onChange={handleInputChange}
              value={newCarData.fuelConsumptionRate}
            />
            <input
              name="oilConsumptionRate"
              placeholder="معدل استهلاك الزيت"
              onChange={handleInputChange}
              value={newCarData.oilConsumptionRate}
            />
            <input
              name="availableSpace"
              type="number"
              placeholder="الأماكن المتاحة"
              onChange={handleInputChange}
              value={newCarData.availableSpace}
            />
            <input
              name="vehicleType"
              placeholder="نوع المركبة"
              onChange={handleInputChange}
              value={newCarData.vehicleType}
            />
            <input
              name="associatedHospital"
              placeholder="المستشفى"
              onChange={handleInputChange}
              value={newCarData.associatedHospital}
            />
            <select
              name="status"
              onChange={handleInputChange}
              value={newCarData.status}
            >
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
