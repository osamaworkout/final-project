import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assets/Styles/driverDetails.css"

const DriverManagement = () => {
  const [driverData, setDriverData] = useState(null);
  const [activeTab, setActiveTab] = useState("driver-info");
  const [vacations, setVacations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const response = await axios.get("/api/driver"); // عدل الرابط حسب API بتاعتك
      setDriverData(response.data);
      setVacations(response.data.vacations || []);
    } catch (error) {
      console.error("Error fetching driver data", error);
    }
  };

  const handleSave = async () => {
    const updatedDriver = {
      ...driverData,
      vacations,
    };

    try {
      await axios.put("/api/driver", updatedDriver); // عدل الرابط حسب API بتاعتك
      alert("✅ تم حفظ التعديلات بنجاح!");
      fetchDriverData();
    } catch (error) {
      console.error("Error saving driver data", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("⚠ هل أنت متأكد من حذف بيانات السائق؟")) {
      try {
        await axios.delete("/api/driver"); // عدل الرابط حسب API بتاعتك
        alert("✅ تم حذف بيانات السائق!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting driver data", error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddVacation = () => {
    setShowModal(true);
  };

  const handleSaveVacation = () => {
    if (leaveFrom && leaveTo) {
      const fromDateObj = new Date(leaveFrom);
      const toDateObj = new Date(leaveTo);
      const days = Math.ceil(Math.abs(toDateObj - fromDateObj) / (1000 * 60 * 60 * 24));
      const newVacation = {
        from: leaveFrom,
        to: leaveTo,
        days,
      };
      setVacations([...vacations, newVacation]);
      setShowModal(false);
      setLeaveFrom("");
      setLeaveTo("");
    } else {
      alert("⚠ يرجى اختيار التواريخ!");
    }
  };

  const handleDeleteVacation = (index) => {
    const updatedVacations = [...vacations];
    updatedVacations.splice(index, 1);
    setVacations(updatedVacations);
  };

  if (!driverData) return <div>جارٍ التحميل...</div>;

  return (
    <div className="container">
      {/* الجزء العلوي */}
      <div className="top-section">
        <div className="driver-container">
          <h2 className="driver-title">إدارة السائقين</h2>
          <div className="driver-info">
            <img
              src={driverData.image || "/img/AdobeStock_65772719_Preview.svg"}
              alt="صورة السائق"
              className="profile-pic"
            />
            <div className="driver-details-container">
              <h2 id="driver-name">{driverData.name || "اسم غير متوفر"}</h2>
              <p id="driver-phone" className="driver-details">رقم الهاتف: {driverData.phone || "غير متوفر"}</p>
              <p id="driver-status" className="driver-details">الحالة: {driverData.status || "غير متوفر"}</p>
            </div>
          </div>
        </div>

        <div className="left-side">
          <button className="back-btn" onClick={handleBack}>⬅ رجوع</button>
          <div className="actions">
            <button className="print-btn" onClick={handlePrint}>🖨 طباعة</button>
            <button className="report-btn">📄 تقرير</button>
            <button className="delete-btn" onClick={handleDelete}>🗑 حذف</button>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === "driver-info" ? "active" : ""}`} onClick={() => handleTabChange("driver-info")}>معلومات السائق</button>
          <button className={`tab ${activeTab === "work-history" ? "active" : ""}`} onClick={() => handleTabChange("work-history")}>سجل أوامر الشغل</button>
          <button className={`tab ${activeTab === "vacation-record" ? "active" : ""}`} onClick={() => handleTabChange("vacation-record")}>سجل الإجازات</button>
        </div>
        {activeTab === "driver-info" && (
          <button className="save-btn" onClick={handleSave}>✅ حفظ</button>
        )}
        {activeTab === "vacation-record" && (
          <button className="add-vacation-btn" onClick={handleAddVacation}>➕ إضافة إجازة</button>
        )}
      </div>

      {/* تبويبات المحتوى */}
      {activeTab === "driver-info" && (
        <div className="tab-content" id="driver-info">
          <div className="form-container">
            <div className="input-group">
              <label>الاسم :</label>
              <input
                type="text"
                value={driverData.name}
                onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                placeholder="أدخل الاسم"
                name="name"
              />
            </div>
            <div className="input-group">
              <label>رقم السيارة:</label>
              <input
                type="text"
                value={driverData.carNumber}
                onChange={(e) => setDriverData({ ...driverData, carNumber: e.target.value })}
                placeholder="أدخل رقم السيارة"
                name="carNumber"
              />
            </div>
            <div className="input-group">
              <label>رقم الهاتف:</label>
              <input
                type="text"
                value={driverData.phone}
                onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })}
                placeholder="أدخل رقم الهاتف"
                name="phone"
              />
            </div>
            <div className="input-group">
              <label>الرقم القومي:</label>
              <input
                type="text"
                value={driverData.nationalId}
                onChange={(e) => setDriverData({ ...driverData, nationalId: e.target.value })}
                placeholder="أدخل الرقم القومي"
                name="nationalId"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "work-history" && (
        <div className="tab-content" id="work-history">
          <table className="orders-table">
            <thead>
              <tr>
                <th>السيارة</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>الرحلة</th>
                <th>KM/المسافة</th>
                <th>رقم أمر الشغل</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bheema</td>
                <td>10/22/2024</td>
                <td>12:44</td>
                <td>وجهة الرحلة</td>
                <td>12344</td>
                <td>15</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "vacation-record" && (
        <div className="tab-content" id="vacation-record">
          <div className="vacation-header">
            <table className="vacation-table">
              <thead>
                <tr>
                  <th>من</th>
                  <th>إلى</th>
                  <th>الفترة بالأيام</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {vacations.map((vac, index) => (
                  <tr key={index}>
                    <td>{vac.from}</td>
                    <td>{vac.to}</td>
                    <td>{vac.days} أيام</td>
                    <td>
                      <button className="delete-vacation-btn" onClick={() => handleDeleteVacation(index)}>🗑 حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* مودال الإجازة */}
      {showModal && (
        <div id="leave-modal" className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
            <h3>إضافة إجازة جديدة</h3>
            <label>من: <input type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} /></label>
            <label>إلى: <input type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} /></label>
            <button id="save-leave-btn" onClick={handleSaveVacation}>حفظ الإجازة</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;