import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assets/Styles/cardetails.css";

const CarManagement = () => {
  const [activeTab, setActiveTab] = useState("car-info");
  const [carData, setCarData] = useState(null);

  useEffect(() => {
    axios
      .get("carData.json") 
      .then((res) => {
        setCarData(res.data); 
      })
      .catch((err) => {
        console.error("Error loading car data:", err);
      });
  }, []);

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

    const closeButton = popup.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
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
              <p id="car-make">
                الماركة: {carData?.carBrand || "غير متوفر"}
              </p>
              <p id="car-model">
                الموديل: {carData?.carModel || "غير متوفر"}
              </p>
              <p id="car-type">
                نوع السيارة: {carData?.carType || "غير متوفر"}
              </p>
            </div>
          </div>

          <div className="km-box">
            <p>
              إجمالي الكيلومترات: <span id="total-km">0 KM</span>
            </p>
          </div>
        </div>

        <div className="left-side">
          <button
            className="back-btn"
            onClick={() => window.history.back()}
          >
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
        {activeTab === "car-info" && <button className="save-btn">✅ حفظ</button>}
      </div>

      {activeTab === "car-info" && (
        <div className="tab-content" id="car-info">
          <div className="form-container">
            <div className="column">
              <div className="input-group">
                <label>رقم السيارة:</label>
                <input
                  type="text"
                  name="carNumber"
                  defaultValue={carData?.carNumber || ""}
                />
              </div>
              <div className="input-group">
                <label>الماركة:</label>
                <input
                  type="text"
                  name="carBrand"
                  defaultValue={carData?.carBrand || ""}
                />
              </div>
              <div className="input-group">
                <label>الموديل:</label>
                <input
                  type="text"
                  name="carModel"
                  defaultValue={carData?.carModel || ""}
                />
              </div>
              <div className="input-group">
                <label>نوع السيارة:</label>
                <input
                  type="text"
                  name="carType"
                  defaultValue={carData?.carType || ""}
                />
              </div>
              <div className="input-group">
                <label>حالة السيارة:</label>
                <input type="text" name="carCondition" />
              </div>
            </div>
            <div className="column">
              <div className="input-group">
                <label>الوظيفة:</label>
                <input type="text" name="carFunction" />
              </div>
              <div className="input-group">
                <label>المستشفى التابعة لها:</label>
                <input type="text" name="hospital" />
              </div>
              <div className="input-group">
                <label>معدل استهلاك الوقود:</label>
                <input
                  type="text"
                  name="fuelConsumption"
                  defaultValue={carData?.fuelConsumption || ""}
                />
              </div>
              <div className="input-group">
                <label>معدل استهلاك الزيت:</label>
                <input type="text" name="oilConsumption" />
              </div>
              <div className="input-group">
                <label>نوع الوقود:</label>
                <input type="text" name="fuelType" />
              </div>
            </div>
            <div className="column">
              <div className="input-group">
                <label>اسم السائق:</label>
                <input type="text" name="driverName" />
              </div>
              <div className="input-group">
                <label>رقم الهاتف:</label>
                <input type="text" name="driverPhone" />
              </div>
              <div className="input-group">
                <label>الرقم القومي:</label>
                <input type="text" name="driverId" />
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
