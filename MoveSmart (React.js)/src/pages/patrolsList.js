import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assets/Styles/patrolList.css"; // لو عايز تغير الـ CSS الخاص بالصفحة الجديدة

const PatrolsPage = () => {
  const [patrols, setPatrols] = useState([]);
  const [filteredPatrols, setFilteredPatrols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [showPopup, setShowPopup] = useState(false);
  const [newPatrolData, setNewPatrolData] = useState({
    id: "",
    startTime: "",
    carId: "",
    availablePlaces: "",
    carStatus: "متاحة",
    driverStatus: "نشط",
  });

  useEffect(() => {
    loadPatrols();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [patrols, searchTerm, filter]);

  const loadPatrols = async () => {
    try {
      const response = await axios.get("/api/patrols"); // تغيير الرابط للـ API الخاص بالدوريات
      const data = response.data;
      if (!Array.isArray(data)) {
        console.error("البيانات المستلمة ليست في شكل مصفوفة", data);
        return;
      }
      setPatrols(data);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
  };

  const applyFilters = () => {
    let list = [...patrols];
    if (searchTerm) {
      list = list.filter(
        (patrol) =>
          patrol.id.includes(searchTerm) ||
          patrol.carId.includes(searchTerm) ||
          patrol.startTime.includes(searchTerm) ||
          patrol.availablePlaces.toLowerCase().includes(searchTerm) ||
          patrol.carStatus.toLowerCase().includes(searchTerm) ||
          patrol.driverStatus.toLowerCase().includes(searchTerm)
      );
    }
    if (filter !== "all") {
      list = list.filter((patrol) => patrol.carStatus === filter);
    }
    setFilteredPatrols(list);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatrolData({ ...newPatrolData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/patrols", newPatrolData); // إرسال البيانات عبر الـ API
      setShowPopup(false);
      loadPatrols();
      setNewPatrolData({
        id: "",
        startTime: "",
        carId: "",
        availablePlaces: "",
        carStatus: "متاحة",
        driverStatus: "نشط",
      });
    } catch (error) {
      console.error("فشل في إضافة الدورية:", error);
    }
  };

  return (
    <div className="container">
      <h2>الدوريات</h2>
      <p className="total-patrols">
        إجمالي الدوريات: <span id="total-count">{filteredPatrols.length}</span>
      </p>

      <div id="patrols-container" className="cards-container">
        {filteredPatrols.map((patrol, index) => (
          <div key={index} className="card">
            <p>
              <strong>رقم الدورية:</strong> <a href="#">{patrol.id}</a>
            </p>
            <p>
              <strong>وقت البدء:</strong> {patrol.startTime}
            </p>
            <p>
              <strong>رقم السيارة:</strong> {patrol.carId}
            </p>
            <p>
              <strong>الأماكن المتاحة:</strong> {patrol.availablePlaces}
            </p>
            <p className={`status ${patrol.carStatus === "متاحة" ? "active" : "inactive"}`}>
              <strong>حالة السيارة:</strong> {patrol.carStatus}
            </p>
            <p className={`status ${patrol.driverStatus === "نشط" ? "active" : "inactive"}`}>
              <strong>حالة السائق:</strong> {patrol.driverStatus}
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
        <button onClick={() => setShowPopup(true)}>+ إضافة دورية</button>
        <button onClick={loadPatrols}>🔄 تحديث</button>
      </div>

      <div className="table-header">
        <span>رقم الدورية</span>
        <span>وقت البدء</span>
        <span>رقم السيارة</span>
        <span>الأماكن المتاحة</span>
        <span>حالة السيارة</span>
        <span>حالة السائق</span>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>إضافة دورية جديدة</h3>
            <input name="id" placeholder="رقم الدورية" onChange={handleInputChange} value={newPatrolData.id} />
            <input name="startTime" placeholder="وقت البدء" onChange={handleInputChange} value={newPatrolData.startTime} />
            <input name="carId" placeholder="رقم السيارة" onChange={handleInputChange} value={newPatrolData.carId} />
            <input name="availablePlaces" placeholder="الأماكن المتاحة" onChange={handleInputChange} value={newPatrolData.availablePlaces} />
            <select name="carStatus" onChange={handleInputChange} value={newPatrolData.carStatus}>
              <option value="متاحة">متاحة</option>
              <option value="غير متاحة">غير متاحة</option>
            </select>
            <select name="driverStatus" onChange={handleInputChange} value={newPatrolData.driverStatus}>
              <option value="نشط">نشط</option>
              <option value="غير نشط">غير نشط</option>
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

export default PatrolsPage;
