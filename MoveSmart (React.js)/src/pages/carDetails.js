import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../Assets/Styles/cardetails.css";

const CarManagement = () => {
  const { busID } = useParams();
  const [activeTab, setActiveTab] = useState("car-info");
  const [carData, setCarData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!busID) return;

    api
      .get(`/api/Buses/ByID/${busID}`)
      .then((res) => {
        setCarData(res.data);
        setFormData(res.data); // ننسخ البيانات للفورم
      })
      .catch((err) => {
        console.error("Error loading car data:", err);
      });
  }, [busID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!busID) return;

    api
      .put(`/api/Buses/${busID}`, formData)
      .then(() => {
        alert("✅ تم حفظ التعديلات بنجاح");
      })
      .catch((err) => {
        console.error("❌ فشل الحفظ:", err);
        alert("حدث خطأ أثناء الحفظ");
      });
  };

  const handlePrint = () => {
    const printContent = document.getElementById(activeTab);
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>طباعة</title>");
    printWindow.document.write(
      "<style>body { font-family: Arial, sans-serif; direction: rtl; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const showDetailsPopup = (details) => {
    const popup = document.createElement("div");
    popup.classList.add("details-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            <h3>تفاصيل الصيانة</h3>
            <p>${details}</p>
        </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector(".close-btn").addEventListener("click", () => {
      document.body.removeChild(popup);
    });
  };

  const renderOrders = () => {
    if (!carData?.orders?.length) {
      return (
        <tr>
          <td colSpan="6">لا توجد أوامر شغل</td>
        </tr>
      );
    }
    return carData.orders.map((order, idx) => (
      <tr key={idx}>
        <td>{order.car}</td>
        <td>{order.date}</td>
        <td>{order.time}</td>
        <td>{order.trip}</td>
        <td>{order.km}</td>
        <td>{order.orderNumber}</td>
      </tr>
    ));
  };

  const renderMaintenance = () => {
    if (!carData?.maintenance?.length) {
      return (
        <tr>
          <td colSpan="3">لا توجد سجلات صيانة</td>
        </tr>
      );
    }
    return carData.maintenance.map((record, idx) => (
      <tr key={idx}>
        <td>{record.sequenceNumber}</td>
        <td>{record.date}</td>
        <td>
          {record.details}
          <button
            className="details-btn"
            onClick={() => showDetailsPopup(record.details)}
          >
            عرض التفاصيل
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <div className="top-section">
        <div className="car-container">
          <h2 className="car-title">إدارة السيارات</h2>
          <div className="car-info">
            <img
              src="/img/car-placeholder.svg"
              alt="صورة السيارة"
              className="profile-pic"
            />
            <div className="driver-details-container">
              <h2 id="car-number">رقم السيارة</h2>
              <p id="car-make">الماركة: {carData?.carBrand || "غير متوفر"}</p>
              <p id="car-model">الموديل: {carData?.carModel || "غير متوفر"}</p>
              <p id="car-type">نوع السيارة: {carData?.carType || "غير متوفر"}</p>
            </div>
          </div>

          <div className="km-box">
            <p>
              إجمالي الكيلومترات:{" "}
              <span id="total-km">{carData?.totalKM || 0} KM</span>
            </p>
          </div>
        </div>

        <div className="left-side">
          <button className="back-btn" onClick={() => window.history.back()}>
            ⬅ رجوع
          </button>
          <div className="actions">
            <button className="print-btn" onClick={handlePrint}>
              🖨 طباعة
            </button>
            <button className="report-btn">📄 تقرير</button>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "car-info" ? "active" : ""}`}
            onClick={() => setActiveTab("car-info")}
          >
            معلومات السيارة
          </button>
          <button
            className={`tab ${activeTab === "work-orders" ? "active" : ""}`}
            onClick={() => setActiveTab("work-orders")}
          >
            سجل أوامر الشغل
          </button>
          <button
            className={`tab ${activeTab === "maintenance-record" ? "active" : ""}`}
            onClick={() => setActiveTab("maintenance-record")}
          >
            سجل الصيانة
          </button>
        </div>
        {activeTab === "car-info" && (
          <button className="save-btn" onClick={handleSave}>
            ✅ حفظ
          </button>
        )}
      </div>

      {activeTab === "car-info" && (
        <div className="tab-content" id="car-info">
          <div className="form-container">
            {/* العمود الأول */}
            <div className="column">
              <div className="input-group">
                <label>رقم السيارة:</label>
                <input
                  type="text"
                  name="carNumber"
                  value={formData.carNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>الماركة:</label>
                <input
                  type="text"
                  name="carBrand"
                  value={formData.carBrand || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>الموديل:</label>
                <input
                  type="text"
                  name="carModel"
                  value={formData.carModel || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>نوع السيارة:</label>
                <input
                  type="text"
                  name="carType"
                  value={formData.carType || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>حالة السيارة:</label>
                <input
                  type="text"
                  name="carCondition"
                  value={formData.carCondition || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* العمود الثاني */}
            <div className="column">
              <div className="input-group">
                <label>الوظيفة:</label>
                <input
                  type="text"
                  name="carFunction"
                  value={formData.carFunction || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>المستشفى التابعة لها:</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>معدل استهلاك الوقود:</label>
                <input
                  type="text"
                  name="fuelConsumption"
                  value={formData.fuelConsumption || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>معدل استهلاك الزيت:</label>
                <input
                  type="text"
                  name="oilConsumption"
                  value={formData.oilConsumption || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>نوع الوقود:</label>
                <input
                  type="text"
                  name="fuelType"
                  value={formData.fuelType || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* العمود الثالث */}
            <div className="column">
              <div className="input-group">
                <label>اسم السائق:</label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>رقم الهاتف:</label>
                <input
                  type="text"
                  name="driverPhone"
                  value={formData.driverPhone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>الرقم القومي:</label>
                <input
                  type="text"
                  name="driverId"
                  value={formData.driverId || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "work-orders" && (
        <div className="tab-content" id="work-orders">
          <table className="orders-table">
            <thead>
              <tr>
                <th>السيارة</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>الرحلة</th>
                <th>KM</th>
                <th>رقم أمر الشغل</th>
              </tr>
            </thead>
            <tbody>{renderOrders()}</tbody>
          </table>
        </div>
      )}

      {activeTab === "maintenance-record" && (
        <div className="tab-content" id="maintenance-record">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>رقم التسلسل</th>
                <th>التاريخ</th>
                <th>تفاصيل</th>
              </tr>
            </thead>
            <tbody>{renderMaintenance()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CarManagement;
